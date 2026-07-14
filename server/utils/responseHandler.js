/**
 * Standardized Response Handler
 * Provides consistent API response formatting
 */

import { HTTP_STATUS } from '../constants/index.js';
import logger from './logger.js';

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @returns {Object} Express response
 */
export const sendSuccess = (res, statusCode = HTTP_STATUS.OK, message, data = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Detailed errors
 * @returns {Object} Express response
 */
export const sendError = (res, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  
  logger.error(`Error Response [${statusCode}]: ${message}`, errors);
  
  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 * @returns {Object} Express response
 */
export const sendValidationError = (res, errors) => {
  return sendError(
    res,
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    'Validation failed',
    errors
  );
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, HTTP_STATUS.UNAUTHORIZED, message);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, HTTP_STATUS.NOT_FOUND, message);
};

/**
 * Send service unavailable response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export const sendServiceUnavailable = (res, message = 'Service temporarily unavailable') => {
  return sendError(res, HTTP_STATUS.SERVICE_UNAVAILABLE, message);
};

/**
 * Send conflict response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export const sendConflict = (res, message = 'Resource conflict') => {
  return sendError(res, HTTP_STATUS.CONFLICT, message);
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Created resource data
 * @returns {Object} Express response
 */
export const sendCreated = (res, message, data) => {
  return sendSuccess(res, HTTP_STATUS.CREATED, message, data);
};

export default {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendNotFound,
  sendServiceUnavailable,
  sendConflict,
  sendCreated
};
