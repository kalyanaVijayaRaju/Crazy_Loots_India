const logger = require('../utils/logger');

/**
 * Audit Logger Middleware
 * Logs mutating API operations (POST, PUT, PATCH, DELETE) with user/client details
 */
const auditLogger = (req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (mutatingMethods.includes(req.method)) {
    res.on('finish', () => {
      logger.info(`[Audit] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} [Client IP: ${req.ip || '127.0.0.1'}, Request ID: ${req.requestId || 'N/A'}]`);
    });
  }

  next();
};

module.exports = auditLogger;
