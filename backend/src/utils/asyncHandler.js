/**
 * Higher-order wrapper to catch errors in async route handlers and forward them to Express error middleware.
 * @param {Function} requestHandler - Async route handler function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
