const logger = require('../../utils/logger');

/**
 * MetricsAggregator
 *
 * Aggregates telemetry from every subsystem — browser, monitoring,
 * deal engine, publishing, scheduler, workers, and Telegram — into
 * a single unified metrics report.
 */
class MetricsAggregator {
  constructor() {
    this._counters = {};
    this._gauges = {};
    this._histograms = {};
    this._lastReset = Date.now();
  }

  /**
   * Increment a named counter
   * @param {string} name
   * @param {number} [value=1]
   */
  incrementCounter(name, value = 1) {
    if (!this._counters[name]) {
      this._counters[name] = 0;
    }
    this._counters[name] += value;
  }

  /**
   * Set a gauge to an absolute value
   * @param {string} name
   * @param {number} value
   */
  setGauge(name, value) {
    this._gauges[name] = value;
  }

  /**
   * Record a histogram value (duration, size, etc.)
   * @param {string} name
   * @param {number} value
   */
  recordHistogram(name, value) {
    if (!this._histograms[name]) {
      this._histograms[name] = [];
    }
    this._histograms[name].push(value);

    // Cap to last 1000 values
    if (this._histograms[name].length > 1000) {
      this._histograms[name] = this._histograms[name].slice(-1000);
    }
  }

  /**
   * Compute summary statistics for a histogram
   * @param {string} name
   * @returns {Object|null}
   */
  getHistogramSummary(name) {
    const values = this._histograms[name];
    if (!values || values.length === 0) {return null;}

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);

    return {
      count: sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: parseFloat((sum / sorted.length).toFixed(2)),
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Get unified metrics report from all subsystems
   * @returns {Object}
   */
  getUnifiedReport() {
    const histogramSummaries = {};
    for (const name of Object.keys(this._histograms)) {
      histogramSummaries[name] = this.getHistogramSummary(name);
    }

    return {
      counters: { ...this._counters },
      gauges: { ...this._gauges },
      histograms: histogramSummaries,
      uptimeMs: Date.now() - this._lastReset,
      collectedAt: new Date().toISOString(),
    };
  }

  /**
   * Record subsystem metrics in batch
   * @param {string} subsystem - e.g. 'browser', 'monitoring', 'deals'
   * @param {Object} metrics
   * @param {Object} [metrics.counters]
   * @param {Object} [metrics.gauges]
   * @param {Object} [metrics.histograms]
   */
  recordSubsystemMetrics(subsystem, metrics) {
    if (metrics.counters) {
      for (const [key, val] of Object.entries(metrics.counters)) {
        this.incrementCounter(`${subsystem}.${key}`, val);
      }
    }
    if (metrics.gauges) {
      for (const [key, val] of Object.entries(metrics.gauges)) {
        this.setGauge(`${subsystem}.${key}`, val);
      }
    }
    if (metrics.histograms) {
      for (const [key, val] of Object.entries(metrics.histograms)) {
        this.recordHistogram(`${subsystem}.${key}`, val);
      }
    }
  }

  /**
   * Reset all metrics
   */
  reset() {
    this._counters = {};
    this._gauges = {};
    this._histograms = {};
    this._lastReset = Date.now();
    logger.info('[MetricsAggregator] All metrics reset');
  }
}

module.exports = new MetricsAggregator();
