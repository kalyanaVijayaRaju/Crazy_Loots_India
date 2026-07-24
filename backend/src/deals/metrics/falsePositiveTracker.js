const logger = require('../../utils/logger');

class FalsePositiveTracker {
  constructor() {
    this.records = [];
  }

  trackRejection(productId, dealScore, reason) {
    const entry = {
      productId,
      dealScore,
      reason,
      timestamp: new Date().toISOString(),
    };
    this.records.push(entry);
    logger.debug(`[FalsePositiveTracker] Tracked false positive / rejection for '${productId}': ${reason}`);
    if (this.records.length > 500) {
      this.records.shift();
    }
  }

  getRecords() {
    return [...this.records];
  }
}

module.exports = new FalsePositiveTracker();
