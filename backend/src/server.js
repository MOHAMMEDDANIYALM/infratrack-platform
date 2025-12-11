require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'http://localhost:3000',  // Alternative local
  'https://infratrack-backend.azurewebsites.net', // Azure prod
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle CORS preflight requests
app.options('*', cors(corsOptions));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// API Routes - MUST come BEFORE static files and wildcard
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);

// Serve static files from React frontend build (ONLY in production)
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../public');
  
  // Serve static files for non-API routes only
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    return express.static(publicPath, {
      maxAge: '1d',
      etag: false,
      setHeaders: (res, p) => {
        if (p.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        }
      },
    })(req, res, next);
  });

  // Fallback: serve index.html for all non-API routes (Express 5 regex)
  app.get(/^\/(?!api|health)(.*)/, (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Frontend not found' });
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
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
