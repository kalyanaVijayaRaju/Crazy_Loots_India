const ApiError = require('./apiError');

/**
 * Rate Limiter Middleware
 * Simple in-memory sliding window rate limiter per IP address
 */
class RateLimiter {
  constructor(limit = 100, windowMs = 60 * 1000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.hits = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
      const now = Date.now();

      if (!this.hits.has(ip)) {
        this.hits.set(ip, []);
      }

      const timestamps = this.hits.get(ip).filter((time) => now - time < this.windowMs);
      timestamps.push(now);
      this.hits.set(ip, timestamps);

      res.setHeader('X-RateLimit-Limit', this.limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.limit - timestamps.length));

      if (timestamps.length > this.limit) {
        return next(new ApiError(429, 'Too many requests. Please try again later.'));
      }

      next();
    };
  }
}

const defaultLimiter = new RateLimiter();
module.exports = defaultLimiter.middleware();
