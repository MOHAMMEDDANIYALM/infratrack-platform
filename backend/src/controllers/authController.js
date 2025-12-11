const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Microsoft Entra ID login (token-based)
exports.microsoftLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // NOTE: For production, validate against Microsoft JWKS. Here we decode only.
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.email) {
      console.error('Invalid or missing email in Microsoft token:', decoded);
      return res.status(401).json({ message: 'Invalid Microsoft token' });
    }

    console.log('Microsoft login attempt for email:', decoded.email);

    let user = await User.findOne({ email: decoded.email });

    // Auto-create user on first Microsoft login
    if (!user) {
      console.log('Creating new user from Microsoft token:', decoded.email);
      
      user = await User.create({
        email: decoded.email,
        name: decoded.name || decoded.given_name || 'Microsoft User',
        organizationId: decoded.oid || 'MICROSOFT_TENANT', // Use object ID as org fallback
        role: 'Viewer', // Default role for new users
        department: 'Engineering',
        status: 'active',
        password: require('crypto').randomBytes(16).toString('hex'), // Random pwd for SSO users
      });
      
      console.log('New user created:', user._id, user.email);
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    const { token: accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

    res.json({
      message: 'Login success',
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
    console.error('Microsoft login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
