/**
 * Input Validation Utilities
 * Centralized validation functions for consistent input validation
 */

import { VALIDATION, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  if (email.length > VALIDATION.MAX_EMAIL_LENGTH) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return { 
      isValid: false, 
      message: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters` 
    };
  }
  
  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    return { 
      isValid: false, 
      message: `Password must not exceed ${VALIDATION.MAX_PASSWORD_LENGTH} characters` 
    };
  }
  
  return { isValid: true, message: 'Valid password' };
};

/**
 * Validates user name
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Name is required' };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < VALIDATION.MIN_NAME_LENGTH) {
    return { 
      isValid: false, 
      message: `Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters` 
    };
  }
  
  if (trimmedName.length > VALIDATION.MAX_NAME_LENGTH) {
    return { 
      isValid: false, 
      message: `Name must not exceed ${VALIDATION.MAX_NAME_LENGTH} characters` 
    };
  }
  
  return { isValid: true, message: 'Valid name' };
};

/**
 * Validates message content
 * @param {string} message - Message to validate
 * @returns {Object} Validation result
 */
export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, message: 'Message is required' };
  }
  
  const trimmedMessage = message.trim();
  
  if (trimmedMessage.length === 0) {
    return { isValid: false, message: 'Message cannot be empty' };
  }
  
  if (trimmedMessage.length > VALIDATION.MAX_MESSAGE_LENGTH) {
    return { 
      isValid: false, 
      message: `Message must not exceed ${VALIDATION.MAX_MESSAGE_LENGTH} characters` 
    };
  }
  
  return { isValid: true, message: 'Valid message' };
};

/**
 * Validates MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Sanitizes string input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validates and sanitizes user registration data
 * @param {Object} data - Registration data
 * @returns {Object} Validation result with errors array
 */
export const validateRegistrationData = (data) => {
  const errors = [];
  
  // Validate name
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.push({ field: 'name', message: nameValidation.message });
  }
  
  // Validate email
  if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: ERROR_MESSAGES.INVALID_EMAIL });
  }
  
  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push({ field: 'password', message: passwordValidation.message });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates language code
 * @param {string} languageCode - Language code to validate
 * @param {Array} supportedLanguages - Array of supported language codes
 * @returns {boolean} True if valid
 */
export const isValidLanguageCode = (languageCode, supportedLanguages) => {
  if (!languageCode || typeof languageCode !== 'string') return false;
  return supportedLanguages.includes(languageCode.toLowerCase());
};

/**
 * Validates context object
 * @param {Object} context - Context object to validate
 * @returns {boolean} True if valid
 */
export const isValidContext = (context) => {
  if (!context || typeof context !== 'object') return false;
  if (Array.isArray(context)) return false;
  return true;
};

export default {
  isValidEmail,
  validatePassword,
  validateName,
  validateMessage,
  isValidObjectId,
  sanitizeString,
  validateRegistrationData,
  isValidLanguageCode,
  isValidContext
};
