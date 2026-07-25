const crypto = require('crypto');

/**
 * Request ID Middleware
 * Attaches X-Request-ID, X-Trace-ID, and X-Correlation-ID headers
 */
const requestIdHandler = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || `req_${crypto.randomUUID().slice(0, 12)}`;
  const traceId = req.headers['x-trace-id'] || `trc_${crypto.randomUUID().replace(/-/g, '')}`;
  const correlationId = req.headers['x-correlation-id'] || `crl_${crypto.randomUUID().slice(0, 12)}`;

  req.requestId = requestId;
  req.traceId = traceId;
  req.correlationId = correlationId;

  res.setHeader('X-Request-ID', requestId);
  res.setHeader('X-Trace-ID', traceId);
  res.setHeader('X-Correlation-ID', correlationId);

  next();
};

module.exports = requestIdHandler;
