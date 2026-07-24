const logger = require('../../utils/logger');

class BrowserRateLimiter {
  constructor(maxConcurrent = 5, minDelayMs = 500) {
    this.maxConcurrent = maxConcurrent;
    this.minDelayMs = minDelayMs;
    this.activeRequests = 0;
    this.lastRequestTime = 0;
  }

  async acquirePermission() {
    while (this.activeRequests >= this.maxConcurrent) {
      logger.debug('[BrowserRateLimiter] Max concurrency reached. Throttling...');
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minDelayMs) {
      const waitTime = this.minDelayMs - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.activeRequests += 1;
    this.lastRequestTime = Date.now();
  }

  releasePermission() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
  }
}

module.exports = new BrowserRateLimiter();
