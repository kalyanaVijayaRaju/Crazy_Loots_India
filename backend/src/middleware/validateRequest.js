const ApiError = require('./apiError');

/**
 * Validate Request Middleware
 * Validates request parameters, query, and body using custom validator functions or DTO validators
 * @param {Function} validatorFn - Function receiving (req) and returning { error, value }
 */
const validateRequest = (validatorFn) => {
  return (req, _res, next) => {
    if (typeof validatorFn !== 'function') {return next();}

    const { error } = validatorFn(req);
    if (error) {
      const messages = Array.isArray(error) ? error : [error.message || String(error)];
      return next(ApiError.badRequest('Validation failed', messages));
    }

    next();
  };
};

module.exports = validateRequest;
