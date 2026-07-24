const logger = require('../../utils/logger');

class MonitoringLockManager {
  constructor() {
    this.activeLocks = new Set();
  }

  acquireLock(productId) {
    const lockKey = String(productId);
    if (this.activeLocks.has(lockKey)) {
      logger.debug(`[MonitoringLockManager] Product '${lockKey}' is already locked for monitoring.`);
      return false;
    }
    this.activeLocks.add(lockKey);
    logger.debug(`[MonitoringLockManager] Acquired lock for product '${lockKey}'`);
    return true;
  }

  releaseLock(productId) {
    const lockKey = String(productId);
    this.activeLocks.delete(lockKey);
    logger.debug(`[MonitoringLockManager] Released lock for product '${lockKey}'`);
  }

  isLocked(productId) {
    return this.activeLocks.has(String(productId));
  }
}

module.exports = new MonitoringLockManager();
