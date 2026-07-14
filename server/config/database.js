import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      logger.warn('⚠️  MONGODB_URI not provided, skipping database connection');
      return null;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ no longer needs these options
      // useNewUrlParser and useUnifiedTopology are default
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    
    return conn;
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
    logger.warn('⚠️  Continuing without database connection');
    return null;
  }
};

export default connectDB;
