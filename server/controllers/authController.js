import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';
import { validateRegistrationData, sanitizeString } from '../utils/validators.js';
import { sendSuccess, sendError, sendCreated, sendValidationError, sendConflict } from '../utils/responseHandler.js';
import { AUTH_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES, MONGOOSE_STATES, HTTP_STATUS } from '../constants/index.js';

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT token
 * @throws {Error} If JWT_SECRET is not configured
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || AUTH_CONFIG.JWT_EXPIRE
  });
};

/**
 * Check database connection status
 * @throws {AppError} If database is not connected
 */
const checkDatabase = () => {
  if (mongoose.connection.readyState !== MONGOOSE_STATES.CONNECTED) {
    throw new AppError(ERROR_MESSAGES.DB_UNAVAILABLE, HTTP_STATUS.SERVICE_UNAVAILABLE);
  }
};

/**
 * Register new user
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {Object} req.body - User registration data
 * @returns {Object} User data and authentication token
 */
export const register = async (req, res, next) => {
  try {
    // Check database connection
    checkDatabase();

    const { name, email, password, preferredLanguage, accessibility } = req.body;

    // Validate input data
    const validation = validateRegistrationData({ name, email, password });
    if (!validation.isValid) {
      return sendValidationError(res, validation.errors);
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email.toLowerCase());

    // Check if user exists
    const userExists = await User.findOne({ email: sanitizedEmail });
    if (userExists) {
      return sendConflict(res, ERROR_MESSAGES.USER_EXISTS);
    }

    // Create user
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password,
      preferredLanguage: preferredLanguage || 'en',
      accessibility: accessibility || {}
    });

    // Generate token
    const token = generateToken(user._id);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    logger.error('Get me error:', error);
    next(error);
  }
};
