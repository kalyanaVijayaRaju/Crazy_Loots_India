const logger = require('../../../utils/logger');

class AmazonRetryHandler {
  async executeWithRetry(fn, maxRetries = 3) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await fn();
      } catch (err) {
        attempt += 1;
        logger.warn(`[AmazonRetryHandler] Operation failed (Attempt ${attempt}/${maxRetries}): ${err.message}`);
        if (attempt >= maxRetries) {
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }
}

module.exports = new AmazonRetryHandler();
