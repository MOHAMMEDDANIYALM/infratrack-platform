require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);

// Serve static files from React frontend build (disabled on Azure until frontend is deployed)
// if (process.env.NODE_ENV === 'production') {
//   const publicPath = path.join(__dirname, '../public');
//   app.use(express.static(publicPath));
//
//   // Handle React routing - return all requests to React app
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(publicPath, 'index.html'));
//   });
// }

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server (Azure sets PORT env var)
const PORT = process.env.PORT;

if (!PORT) {
  console.error('❌ PORT not defined by Azure');
  process.exit(1);
}

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 InfraTrack Backend running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
