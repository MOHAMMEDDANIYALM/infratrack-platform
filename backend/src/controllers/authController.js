const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

// Generate tokens
const generateTokens = (userId, email, role) => {
  const token = jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { token, refreshToken };
};

// Login
exports.login = async (req, res) => {
  try {
    const { organizationId, email, password } = req.body;

    if (!organizationId || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ email, organizationId });

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

// Register
exports.register = async (req, res) => {
  try {
    const { organizationId, name, email, password, department, role } = req.body;

    if (!organizationId || !name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      organizationId,
      name,
      email,
      password: hashedPassword,
      department: department || '',
      role: role || 'Viewer',
      status: 'pending',
    });

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
        organizationId: user.organizationId,
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

// Microsoft Entra ID login (token verification only - no token generation from backend)
exports.microsoftLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }


    const tenantId = process.env.MICROSOFT_TENANT_ID;
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const allowedDomains = (process.env.ALLOWED_LOGIN_DOMAINS || '')
      .split(',')
      .map(d => d.trim().toLowerCase())
      .filter(Boolean);

    if (!tenantId || !clientId) {
      return res.status(500).json({ message: 'Microsoft login not configured: missing tenant or client ID' });
    }

    // Get Microsoft JWKS keys for signature verification
    const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
    const client = jwksClient({ jwksUri, cache: true, rateLimit: true });

    let decoded;
    try {
      // Decode header to get key ID
      const decodedHeader = jwt.decode(token, { complete: true });
      if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
        console.error('Invalid Microsoft token header');
        return res.status(401).json({ message: 'Invalid Microsoft token' });
      }

      // Get public key from JWKS
      const signingKey = await client.getSigningKey(decodedHeader.header.kid);
      const publicKey = signingKey.getPublicKey();

      // Verify token signature and claims
      // Audience must match the SPA client ID
      // Issuer must be the tenant-specific login endpoint
      decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: clientId, // Must be the SPA client ID (3f2cb0db-...)
        issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      });
    } catch (verifyErr) {
      console.error('Microsoft token verification failed:', verifyErr.message);
      return res.status(401).json({ message: 'Invalid Microsoft token: ' + verifyErr.message });
    }

    // Extract email from token claims
    const email = decoded?.email || decoded?.preferred_username;

    if (!decoded || !email) {
      console.error('Missing email in Microsoft token');
      return res.status(401).json({ message: 'Invalid Microsoft token: missing email' });
    }

    console.log('Microsoft login verified for:', email);

    // OPTIONAL: Enforce domain allowlist (e.g., allow only @yourorg.com)
    if (allowedDomains.length > 0) {
      const emailDomain = (email || '').split('@')[1]?.toLowerCase();
      if (!emailDomain || !allowedDomains.includes(emailDomain)) {
        console.error('Email domain not allowed:', emailDomain);
        return res.status(403).json({ message: 'Email domain not allowed' });
      }
    }

    // Check if user exists and is active (no auto-provisioning)
    let user = await User.findOne({ email });
    if (!user) {
      console.error('User not found in database:', email);
      return res.status(403).json({ message: 'User not authorized. Please contact admin.' });
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
