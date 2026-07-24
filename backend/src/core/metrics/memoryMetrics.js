const MetricsInterface = require('./metrics.interface');

class MemoryMetrics extends MetricsInterface {
  constructor() {
    super();
    this.counters = new Map();
    this.gauges = new Map();
    this.durations = new Map();
  }

  increment(metricName, value = 1, _tags = {}) {
    const current = this.counters.get(metricName) || 0;
    this.counters.set(metricName, current + value);
  }

  decrement(metricName, value = 1, _tags = {}) {
    const current = this.counters.get(metricName) || 0;
    this.counters.set(metricName, current - value);
  }

  gauge(metricName, value, _tags = {}) {
    this.gauges.set(metricName, value);
  }

  recordDuration(metricName, durationMs, _tags = {}) {
    if (!this.durations.has(metricName)) {
      this.durations.set(metricName, []);
    }
    const list = this.durations.get(metricName);
    list.push(durationMs);
    // Retain last 100 duration records
    if (list.length > 100) {
      list.shift();
    }
  }

  getMetrics() {
    const durationStats = {};
    for (const [name, list] of this.durations.entries()) {
      if (list.length === 0) {
        continue;
      }
      const sum = list.reduce((a, b) => a + b, 0);
      const avg = Math.round(sum / list.length);
      const min = Math.min(...list);
      const max = Math.max(...list);
      durationStats[name] = { avgMs: avg, minMs: min, maxMs: max, count: list.length };
    }

    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      durations: durationStats,
      timestamp: new Date().toISOString(),
    };
  }

  reset() {
    this.counters.clear();
    this.gauges.clear();
    this.durations.clear();
  }
}

module.exports = new MemoryMetrics();
