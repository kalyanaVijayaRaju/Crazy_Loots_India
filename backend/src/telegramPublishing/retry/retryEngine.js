const logger = require('../../utils/logger');

class RetryEngine {
  constructor(maxRetries = 3, baseBackoffMs = 1000) {
    this.maxRetries = maxRetries;
    this.baseBackoffMs = baseBackoffMs;
    this.deadLetterQueue = [];
    this.retryHistory = new Map(); // taskId -> array of retry attempts
  }

  calculateBackoff(retryCount) {
    return Math.pow(2, retryCount) * this.baseBackoffMs;
  }

  canRetry(task) {
    const currentRetries = task.retryCount || 0;
    return currentRetries < this.maxRetries;
  }

  recordAttempt(task, error) {
    const taskId = task.taskId;
    const list = this.retryHistory.get(taskId) || [];
    const attempt = {
      attemptNumber: (task.retryCount || 0) + 1,
      error: error.message || String(error),
      timestamp: new Date().toISOString(),
    };
    list.push(attempt);
    this.retryHistory.set(taskId, list);
  }

  moveToDLQ(task, finalReason) {
    const dlqItem = {
      ...task,
      failedAt: new Date().toISOString(),
      reason: finalReason,
    };
    this.deadLetterQueue.push(dlqItem);
    logger.error(`[RetryEngine] Task '${task.taskId}' moved to Dead Letter Queue (DLQ). Reason: ${finalReason}`);
    return dlqItem;
  }

  getDLQ() {
    return [...this.deadLetterQueue];
  }
}

module.exports = new RetryEngine();
