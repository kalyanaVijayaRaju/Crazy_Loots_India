class MonitoringMetrics {
  constructor() {
    this.reset();
  }

  reset() {
    this.executionCount = 0;
    this.totalDurationMs = 0;
    this.priceChanges = 0;
    this.retries = 0;
    this.failures = 0;
    this.productsMonitored = new Set();
  }

  recordExecution(productId, durationMs, priceChanged = false) {
    this.executionCount += 1;
    this.totalDurationMs += durationMs;
    if (priceChanged) {
      this.priceChanges += 1;
    }
    this.productsMonitored.add(String(productId));
  }

  recordRetry() {
    this.retries += 1;
  }

  recordFailure() {
    this.failures += 1;
  }

  getMetrics() {
    return {
      executionCount: this.executionCount,
      averageDurationMs: this.executionCount ? Math.round(this.totalDurationMs / this.executionCount) : 0,
      priceChanges: this.priceChanges,
      retries: this.retries,
      failures: this.failures,
      productsMonitored: this.productsMonitored.size,
    };
  }
}

module.exports = new MonitoringMetrics();
