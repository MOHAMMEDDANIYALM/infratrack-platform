const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Add request logging
router.use((req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.path}`);
  next();
});

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.get('/me', protect, authController.getMe);

module.exports = router;
