const ApiError = require('../utils/ApiError');

/**
 * 404 Handler for undefined API routes
 */
const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(`Route non-existent: ${req.method} ${req.originalUrl}`);
  next(error);
};

module.exports = notFoundHandler;
