const PolicyInterface = require('../interfaces/policy.interface');

class RetryPolicy extends PolicyInterface {
  constructor(maxRetries = 3, backoffFactor = 2) {
    super('RetryPolicy');
    this.maxRetries = maxRetries;
    this.backoffFactor = backoffFactor;
  }

  async evaluate(context) {
    const currentRetries = context.retryCount || 0;
    const shouldRetry = currentRetries < this.maxRetries;
    const delayMs = shouldRetry ? Math.pow(this.backoffFactor, currentRetries) * 1000 : 0;

    return {
      allowed: shouldRetry,
      retryCount: currentRetries,
      maxRetries: this.maxRetries,
      delayMs,
    };
  }
}

module.exports = RetryPolicy;
