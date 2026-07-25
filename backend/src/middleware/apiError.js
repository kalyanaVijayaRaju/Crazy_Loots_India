/**
 * ApiError
 * Custom Operational Error Class for API responses
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP Status code (400, 404, 500, etc.)
   * @param {string} message - Error message
   * @param {Array<string>} [errors=[]] - Array of error details
   * @param {boolean} [isOperational=true] - Whether the error is operational
   * @param {string} [stack=''] - Error stack trace
   */
  constructor(statusCode, message, errors = [], isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden access') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Resource conflict') {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, [], false);
  }
}

module.exports = ApiError;
