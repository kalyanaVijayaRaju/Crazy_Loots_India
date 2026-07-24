class DealMetrics {
  constructor() {
    this.reset();
  }

  reset() {
    this.dealsDetected = 0;
    this.scores = [];
    this.confidences = [];
    this.duplicatePreventionCount = 0;
    this.cooldownCount = 0;
    this.approvalQueueSize = 0;
  }

  recordDetection(score, confidence) {
    this.dealsDetected += 1;
    this.scores.push(score);
    this.confidences.push(confidence);

    if (this.scores.length > 100) {
      this.scores.shift();
    }
    if (this.confidences.length > 100) {
      this.confidences.shift();
    }
  }

  recordDuplicateBlock() {
    this.duplicatePreventionCount += 1;
  }

  recordCooldownBlock() {
    this.cooldownCount += 1;
  }

  setQueueSize(size) {
    this.approvalQueueSize = size;
  }

  getMetrics() {
    const avgScore = this.scores.length
      ? Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length)
      : 0;
    const avgConfidence = this.confidences.length
      ? Math.round(this.confidences.reduce((a, b) => a + b, 0) / this.confidences.length)
      : 0;

    return {
      dealsDetected: this.dealsDetected,
      averageScore: avgScore,
      averageConfidence: avgConfidence,
      duplicatePreventionCount: this.duplicatePreventionCount,
      cooldownCount: this.cooldownCount,
      approvalQueueSize: this.approvalQueueSize,
    };
  }
}

module.exports = new DealMetrics();
