require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// Global error handlers - MUST be at the top
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Do NOT exit - log and continue
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Only exit if truly critical
  if (error.code === 'EADDRINUSE' || error.code === 'EACCES') {
    console.error('🔴 Critical error - cannot start server');
    process.exit(1);
  }
});

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const azureRoutes = require('./routes/azureRoutes');
const RealTimeMetricsController = require('./controllers/realTimeController');

const app = express();
const server = http.createServer(app);

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
];

// Socket.IO Configuration
let io;
let realTimeController;

try {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  });

  // Initialize Real-Time Metrics Controller
  realTimeController = new RealTimeMetricsController(io);
  realTimeController.initialize();
  console.log('✅ Socket.IO and RealTimeController initialized');
} catch (error) {
  console.warn('⚠️  Warning: Could not initialize Socket.IO:', error.message);
  console.warn('⚠️  App will continue without real-time features');
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`CORS rejected origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle CORS preflight requests (Express 5 compatible)
app.options(/.*/, cors(corsOptions));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// WebSocket status endpoint
app.get('/api/realtime/status', (req, res) => {
  if (!realTimeController) {
    return res.json({
      status: 'unavailable',
      message: 'Real-time features not initialized'
    });
  }
  res.json({
    status: 'active',
    connections: realTimeController.getStats()
  });
});

// API Routes - MUST come BEFORE static files and wildcard
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);
app.use('/api/azure', azureRoutes);

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

// Start server only after attempting DB connection
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080;
const FALLBACK_PORT = parseInt(process.env.FALLBACK_PORT, 10) || DEFAULT_PORT + 1;
let currentPort = DEFAULT_PORT;
let serverListening = false;

console.log(`Starting InfraTrack on port ${DEFAULT_PORT}...`);
console.log(`Env: ${process.env.NODE_ENV || 'development'}`);

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn('JWT secrets are not set. Set JWT_SECRET and JWT_REFRESH_SECRET for production.');
}

(async () => {
  try {
    // Start server FIRST - don't wait for DB
    const startListening = (port) => {
      currentPort = port;
      console.log(`🔄 Attempting to listen on port ${port} at 0.0.0.0...`);
      server.listen(port, '0.0.0.0', () => {
        serverListening = true;
        console.log(`✅ Server is listening on ${port}`);
        console.log(`InfraTrack started (env=${process.env.NODE_ENV || 'development'})`);

        // Keep alive - Azure needs to see the process running
        setInterval(() => {}, 60000);
      });
    };

    startListening(DEFAULT_PORT);

    // Handle server errors, attempt one automatic fallback port
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE' && !serverListening) {
        if (currentPort !== FALLBACK_PORT) {
          console.warn(`⚠️  Port ${currentPort} is in use, retrying on ${FALLBACK_PORT}`);
          return startListening(FALLBACK_PORT);
        }
        console.error(`🔴 Ports ${DEFAULT_PORT} and ${FALLBACK_PORT} are already in use`);
        process.exit(1);
      } else if (error.code === 'EACCES') {
        console.error(`🔴 Permission denied for port ${currentPort}`);
        process.exit(1);
      }
    });

    // Attempt DB connection in background (don't wait)
    console.log('🔄 Attempting database connection...');
    connectDB().then(connected => {
      if (connected) {
        console.log('✅ Database connected successfully');
      } else {
        console.warn('⚠️  Database not available - using demo data for all endpoints');
      }
    }).catch(err => {
      console.warn('⚠️  Database connection error:', err.message);
      console.warn('⚠️  Using demo data for all endpoints');
    });
    
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();
