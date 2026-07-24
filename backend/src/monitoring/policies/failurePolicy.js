class FailurePolicy {
  /**
   * Evaluate whether monitoring should be disabled after repeated failures
   * @param {number} consecutiveFailures
   * @param {number} maxRetries
   * @returns {Object} { shouldDisable, shouldRetry }
   */
  evaluate(consecutiveFailures = 0, maxRetries = 3) {
    return {
      shouldDisable: consecutiveFailures >= maxRetries,
      shouldRetry: consecutiveFailures < maxRetries,
    };
  }
}

module.exports = new FailurePolicy();
