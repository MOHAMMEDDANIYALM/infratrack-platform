const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyMicrosoftIdToken } = require('../utils/verifyMicrosoftToken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

// Generate tokens
const generateTokens = (userId, email, role) => {
  const token = jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '1d' } // 1 day expiration as required
  );

  const refreshToken = jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { token, refreshToken };
};

// Login - Email + Password only
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const { token, refreshToken } = generateTokens(user._id, user.email, user.role);

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        organizationId: user.organizationId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register - Email + Password only
exports.register = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (organizationId set to default 'infratrack')
    const user = await User.create({
      organizationId: 'infratrack',
      name,
      email,
      password: hashedPassword,
      department: department || '',
      role: role || 'Viewer',
      status: 'active', // Active by default
    });

    // Generate JWT tokens (1 day expiration)
    const { token, refreshToken } = generateTokens(user._id, user.email, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { token, refreshToken: newRefreshToken } = generateTokens(
      user._id,
      user.email,
      user.role
    );

    res.json({
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In real app, send reset link via email
    // For now, just return success
    res.json({
      message: 'Password reset link sent to email',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        organizationId: user.organizationId,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Microsoft Entra ID login: verify Microsoft ID token via JWKS, then issue app JWT
exports.microsoftLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const tenantId = process.env.MICROSOFT_TENANT_ID;
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const allowedDomains = (process.env.ALLOWED_LOGIN_DOMAINS || '')
      .split(',')
      .map(d => d.trim().toLowerCase())
      .filter(Boolean);
    const allowedEmails = (process.env.ALLOWED_LOGIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    const autoProvision = String(process.env.AUTO_PROVISION_MS_USERS || 'false').toLowerCase() === 'true';

    let email;
    try {
      const result = await verifyMicrosoftIdToken({ token, clientId, tenantId });
      email = result.email;
    } catch (verifyErr) {
      console.error('Microsoft token verification failed:', verifyErr.message);
      return res.status(401).json({ message: 'Invalid Microsoft token: ' + verifyErr.message });
    }

    // Enforce email allowlist if configured (takes precedence over domain list)
    if (allowedEmails.length > 0) {
      const emailLower = (email || '').toLowerCase();
      if (!allowedEmails.includes(emailLower)) {
        console.error('Email not in allowlist:', emailLower);
        return res.status(403).json({ message: 'User not authorized. Please contact admin.' });
      }
    } else if (allowedDomains.length > 0) {
      // OPTIONAL: Enforce domain allowlist (e.g., allow only @yourorg.com)
      const emailDomain = (email || '').split('@')[1]?.toLowerCase();
      if (!emailDomain || !allowedDomains.includes(emailDomain)) {
        console.error('Email domain not allowed:', emailDomain);
        return res.status(403).json({ message: 'User not authorized. Please contact admin.' });
      }
    }

    // Check if user exists and is active (no auto-provisioning)
    let user = await User.findOne({ email });
    if (!user) {
      if (!autoProvision) {
        console.error('User not found in database:', email);
        return res.status(403).json({ message: 'User not authorized. Please contact admin.' });
      }
      // Auto-provision guarded by allowlist/domain checks above
      user = await User.create({
        organizationId: 'SA-GOV-001',
        name: email.split('@')[0],
        email,
        password: await require('bcryptjs').hash(require('crypto').randomBytes(16).toString('hex'), 10),
        role: 'Viewer',
        department: '',
        status: 'active',
      });
    }

    if (user.status !== 'active') {
      console.error('User account not active:', email, user.status);
      return res.status(403).json({ message: 'Account is not active. Please contact admin.' });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate backend JWT tokens (for session management within app)
    const { token: accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

    res.json({
      message: 'Login successful',
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        organizationId: user.organizationId,
      },
    });
  } catch (error) {
    console.error('Microsoft login error:', error.message, error.stack);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
