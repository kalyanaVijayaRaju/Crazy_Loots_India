/**
 * Response Time Middleware
 * Measures execution duration and sets X-Response-Time header
 */
const responseTimeHandler = (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function (...args) {
    const duration = Date.now() - start;
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${duration}ms`);
    }
    return originalSend.apply(res, args);
  };

  next();
};

module.exports = responseTimeHandler;
