const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Add request logging
router.use((req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.path}`);
  next();
});

// Demo login for testing (when database is unavailable)
router.post('/demo-login', (req, res) => {
  try {
    const token = jwt.sign(
      { 
        userId: 'demo-user-id', 
        email: 'admin@enterprise.sa', 
        role: 'Admin',
        organizationId: 'SA-GOV-001'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: 'demo-user-id' },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Demo login successful',
      token,
      refreshToken,
      user: {
        id: 'demo-user-id',
        name: 'Mohammed Daniyal',
        email: 'admin@enterprise.sa',
        role: 'Admin',
        department: 'Infrastructure',
        organizationId: 'SA-GOV-001',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.get('/me', protect, authController.getMe);

module.exports = router;
