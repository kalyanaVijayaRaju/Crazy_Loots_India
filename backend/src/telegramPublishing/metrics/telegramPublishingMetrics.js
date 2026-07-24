class TelegramPublishingMetrics {
  constructor() {
    this.reset();
  }

  reset() {
    this.messagesPublished = 0;
    this.messagesEdited = 0;
    this.messagesDeleted = 0;
    this.failures = 0;
    this.retries = 0;
    this.publishDurations = [];
    this.floodWaitCount = 0;
    this.deadLetterCount = 0;
    this.dryRunCount = 0;
    this.sandboxCount = 0;
    this.liveCount = 0;
  }

  recordPublish(durationMs, mode = 'DRY_RUN') {
    this.messagesPublished += 1;
    this.publishDurations.push(durationMs);
    if (mode === 'LIVE') {
      this.liveCount += 1;
    } else if (mode === 'SANDBOX') {
      this.sandboxCount += 1;
    } else {
      this.dryRunCount += 1;
    }
  }

  recordEdit() {
    this.messagesEdited += 1;
  }

  recordDelete() {
    this.messagesDeleted += 1;
  }

  recordFailure() {
    this.failures += 1;
  }

  recordRetry() {
    this.retries += 1;
  }

  recordFloodWait() {
    this.floodWaitCount += 1;
  }

  recordDLQ() {
    this.deadLetterCount += 1;
  }

  getMetrics() {
    const avgDuration = this.publishDurations.length
      ? Math.round(this.publishDurations.reduce((a, b) => a + b, 0) / this.publishDurations.length)
      : 0;

    return {
      messagesPublished: this.messagesPublished,
      messagesEdited: this.messagesEdited,
      messagesDeleted: this.messagesDeleted,
      failures: this.failures,
      retries: this.retries,
      averagePublishTimeMs: avgDuration,
      floodWaitCount: this.floodWaitCount,
      deadLetterCount: this.deadLetterCount,
      dryRunCount: this.dryRunCount,
      sandboxCount: this.sandboxCount,
      liveCount: this.liveCount,
    };
  }
}

module.exports = new TelegramPublishingMetrics();
