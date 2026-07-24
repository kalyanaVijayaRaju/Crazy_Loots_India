class AmazonMetrics {
  constructor() {
    this.reset();
  }

  reset() {
    this.navigationMs = 0;
    this.extractionMs = 0;
    this.parsingMs = 0;
    this.validationMs = 0;
    this.persistenceMs = 0;
    this.totalDurationMs = 0;
  }

  toJSON() {
    return {
      navigationMs: this.navigationMs,
      extractionMs: this.extractionMs,
      parsingMs: this.parsingMs,
      validationMs: this.validationMs,
      persistenceMs: this.persistenceMs,
      totalDurationMs: this.totalDurationMs,
    };
  }
}

module.exports = AmazonMetrics;
