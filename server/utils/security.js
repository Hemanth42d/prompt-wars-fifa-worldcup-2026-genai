import bcrypt from 'bcryptjs';

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
export const getPasswordHash = (password) => {
  const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_ROUNDS) || 12);
  return bcrypt.hashSync(password, salt);
};

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} True if password matches
 */
export const verifyPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

/**
 * Sanitize user input to prevent XSS and injection attacks
 * @param {string} text - User input text
 * @returns {string} Sanitized text
 */
export const sanitize_input = (text) => {
  if (!text) return '';
  
  // Remove potentially dangerous characters
  const dangerous = ['<', '>', '"', "'", '&', ';', '(', ')', '{', '}', '`'];
  let sanitized = text;
  
  dangerous.forEach(char => {
    sanitized = sanitized.replaceAll(char, '');
  });
  
  return sanitized.trim();
};

/**
 * Validate input length
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if valid
 */
export const validate_input_length = (text, maxLength = 1000) => {
  return text && text.length <= maxLength;
};

/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} Random token
 */
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {object} Strength analysis
 */
export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    isStrong: score >= 4,
    score,
    checks,
    strength: score >= 4 ? 'strong' : score >= 3 ? 'medium' : 'weak'
  };
};
