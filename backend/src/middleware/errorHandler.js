const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/environment');
const { HTTP_STATUS } = require('../constants');

/**
 * Centralized Global Express Error Handler Middleware
 */
const errorHandler = (err, req, res, _next) => {
  let error = err;

  // Transform non-ApiError instances into operational ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Log error details using Winston logger
  if (error.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message}`, { stack: error.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${error.message}`);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    timestamp: new Date().toISOString(),
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
