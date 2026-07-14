import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import connectDB from './config/database.js';
import connectRedis from './config/redis.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import navigationRoutes from './routes/navigation.js';
import userRoutes from './routes/user.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO for real-time features
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Rate limiting
app.use(rateLimiter);

// Health check endpoint with service status
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      server: 'running',
      mongodb: 'unknown',
      redis: 'unknown',
      openai: 'unknown'
    },
    warnings: []
  };

  // Check MongoDB connection
  try {
    if (mongoose.connection.readyState === 1) {
      health.services.mongodb = 'connected';
    } else if (mongoose.connection.readyState === 0) {
      health.services.mongodb = 'disconnected';
      health.warnings.push('MongoDB is not connected. Database features unavailable.');
    } else if (mongoose.connection.readyState === 2) {
      health.services.mongodb = 'connecting';
    }
  } catch (error) {
    health.services.mongodb = 'error';
    health.warnings.push('MongoDB check failed');
  }

  // Check Redis connection
  try {
    const { redisClient } = await import('./config/redis.js');
    if (redisClient && redisClient.isOpen) {
      health.services.redis = 'connected';
    } else {
      health.services.redis = 'disconnected';
      health.warnings.push('Redis is not connected. Caching unavailable.');
    }
  } catch (error) {
    health.services.redis = 'disconnected';
    health.warnings.push('Redis not configured. Running without cache.');
  }

  // Check OpenAI API key
  if (process.env.OPENAI_API_KEY) {
    health.services.openai = 'configured';
  } else {
    health.services.openai = 'not_configured';
    health.warnings.push('OpenAI API key not set. AI features unavailable.');
  }

  // Check JWT secret
  if (!process.env.JWT_SECRET) {
    health.warnings.push('JWT_SECRET not set. Authentication may fail.');
  }

  res.status(200).json(health);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/user', userRoutes);

// Root endpoint with configuration status
app.get('/', (req, res) => {
  const configStatus = {
    mongodb: !!process.env.MONGODB_URI,
    redis: !!process.env.REDIS_URL,
    openai: !!process.env.OPENAI_API_KEY,
    jwt: !!process.env.JWT_SECRET
  };

  const missingConfigs = Object.entries(configStatus)
    .filter(([key, value]) => !value)
    .map(([key]) => key.toUpperCase());

  res.json({
    message: 'FIFA World Cup 2026 GenAI Stadium Assistant API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    configuration: {
      status: missingConfigs.length === 0 ? 'complete' : 'incomplete',
      missing: missingConfigs.length > 0 ? missingConfigs : undefined,
      note: missingConfigs.length > 0 
        ? `Missing configurations: ${missingConfigs.join(', ')}. Some features may be unavailable.`
        : 'All configurations present'
    },
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      chat: '/api/chat',
      navigation: '/api/navigation',
      user: '/api/user'
    },
    docs: {
      setup: 'See README.md for setup instructions',
      deployment: 'See DEPLOYMENT.md for deployment guide'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('location-update', (data) => {
    // Broadcast location updates to relevant rooms
    socket.to(data.stadiumId).emit('crowd-update', data);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Start HTTP server first (for health checks)
    httpServer.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
    });

    // Connect to databases (non-blocking, optional)
    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
      } catch (error) {
        logger.warn('MongoDB connection failed, running without database:', error.message);
      }
    } else {
      logger.warn('⚠️  MONGODB_URI not set, running without database');
    }

    if (process.env.REDIS_URL) {
      try {
        await connectRedis();
      } catch (error) {
        logger.warn('Redis connection failed, running without cache:', error.message);
      }
    } else {
      logger.info('ℹ️  REDIS_URL not set, running without cache');
    }
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

export default app;
