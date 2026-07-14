/**
 * Application Constants
 * Centralized configuration values to avoid magic numbers and improve maintainability
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 300, // 5 minutes
  SHORT_TTL: 60, // 1 minute
  LONG_TTL: 3600, // 1 hour
  CHAT_RESPONSE_TTL: 60,
  USER_PROFILE_TTL: 300,
  NAVIGATION_TTL: 180
};

// Rate Limiting Configuration
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 60,
  AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  AUTH_MAX_REQUESTS: 5,
  MESSAGE: 'Too many requests from this IP, please try again later'
};

// Database Configuration
export const DB_CONFIG = {
  CONNECTION_TIMEOUT: 5000,
  RECONNECT_TRIES: 3,
  RECONNECT_INTERVAL: 5000
};

// AI Configuration
export const AI_CONFIG = {
  DEFAULT_MODEL: 'gpt-4-turbo-preview',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  INTENT_DETECTION_TEMPERATURE: 0.3,
  INTENT_DETECTION_MAX_TOKENS: 150,
  GENERAL_QUERY_MAX_TOKENS: 500
};

// Authentication Configuration
export const AUTH_CONFIG = {
  JWT_EXPIRE: '7d',
  BCRYPT_ROUNDS: 12,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  TOKEN_PREFIX: 'Bearer '
};

// Validation Constants
export const VALIDATION = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MIN_NAME_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko',
  'ar', 'hi', 'bn', 'pa', 'te', 'mr', 'ta', 'ur', 'gu', 'kn',
  'ml', 'or', 'ne', 'si'
];

// Intent Types
export const INTENT_TYPES = {
  NAVIGATION: 'navigation',
  INFORMATION: 'information',
  EMERGENCY: 'emergency',
  ACCESSIBILITY: 'accessibility',
  SERVICES: 'services',
  SOCIAL: 'social'
};

// Priority Levels
export const PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists with this email',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid or expired token',
  NO_TOKEN: 'No authentication token provided',
  UNAUTHORIZED: 'Not authorized to access this resource',
  
  // Database
  DB_CONNECTION_ERROR: 'Database connection error',
  DB_UNAVAILABLE: 'Database service temporarily unavailable',
  
  // AI Service
  AI_SERVICE_ERROR: 'AI service error',
  AI_NOT_CONFIGURED: 'AI service is not configured',
  OPENAI_KEY_MISSING: 'OpenAI API key not configured',
  
  // Validation
  INVALID_INPUT: 'Invalid input data',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  INVALID_EMAIL: 'Invalid email format',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  MESSAGE_TOO_LONG: 'Message exceeds maximum length',
  
  // General
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  NOT_FOUND: 'Resource not found',
  INVALID_REQUEST: 'Invalid request'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_UPDATED: 'User profile updated successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  MESSAGE_SENT: 'Message processed successfully',
  CHAT_CREATED: 'Chat session created',
  CHAT_DELETED: 'Chat session deleted'
};

// MongoDB Connection States
export const MONGOOSE_STATES = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3
};

// Environment
export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

export default {
  HTTP_STATUS,
  CACHE_CONFIG,
  RATE_LIMIT,
  DB_CONFIG,
  AI_CONFIG,
  AUTH_CONFIG,
  VALIDATION,
  SUPPORTED_LANGUAGES,
  INTENT_TYPES,
  PRIORITY,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  MONGOOSE_STATES,
  ENVIRONMENT
};
