require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// CORS Configuration: Same origin in production (frontend served by backend)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);

// Serve static files from React frontend build (ONLY in production)
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../public');
  console.log('🗂️  Serving static files from:', publicPath);
  
  // Serve static files ONLY for non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next(); // Skip static middleware for API and health routes
    }
    express.static(publicPath, { maxAge: '1d', etag: false })(req, res, next);
  });

  // Wildcard route for React Router - return index.html only for non-API requests
  app.get(/^(?!\/api|\/health).*/, (req, res) => {
    console.log('📄 Serving index.html for:', req.url);
    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
      if (err) {
        console.error('❌ Error serving index.html:', err);
        res.status(404).json({ error: 'Frontend not found' });
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server (Azure sets PORT env var, local uses 5000)
const PORT = process.env.PORT || 5000;

// Start server FIRST (don't wait for DB)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 InfraTrack Backend running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Public path: ${path.join(__dirname, '../public')}`);
  
  // Connect to database AFTER server starts
  connectDB().catch((error) => {
    console.error('⚠️ Database connection failed, but server is still running:', error.message);
  });
});
