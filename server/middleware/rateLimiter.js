import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

// General rate limiter
const rateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 60, // 60 requests per minute
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
});

// Strict rate limiter for sensitive routes (auth)
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true
});

// AI request rate limiter (more restrictive due to cost)
export const aiRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 20, // 20 AI requests per minute
  message: {
    success: false,
    message: 'AI request limit exceeded, please wait a moment.'
  }
});

export default rateLimiter;
