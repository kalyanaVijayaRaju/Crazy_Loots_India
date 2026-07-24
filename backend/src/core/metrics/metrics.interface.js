/**
 * Abstract Metrics Interface Contract
 */
class MetricsInterface {
  constructor() {
    if (this.constructor === MetricsInterface) {
      throw new Error('MetricsInterface is an abstract class and cannot be instantiated directly.');
    }
  }

  increment(_metricName, _value = 1, _tags = {}) {
    throw new Error(`Method 'increment()' must be implemented by ${this.constructor.name}.`);
  }

  decrement(_metricName, _value = 1, _tags = {}) {
    throw new Error(`Method 'decrement()' must be implemented by ${this.constructor.name}.`);
  }

  gauge(_metricName, _value, _tags = {}) {
    throw new Error(`Method 'gauge()' must be implemented by ${this.constructor.name}.`);
  }

  recordDuration(_metricName, _durationMs, _tags = {}) {
    throw new Error(`Method 'recordDuration()' must be implemented by ${this.constructor.name}.`);
  }

  getMetrics() {
    throw new Error(`Method 'getMetrics()' must be implemented by ${this.constructor.name}.`);
  }

  reset() {
    throw new Error(`Method 'reset()' must be implemented by ${this.constructor.name}.`);
  }
}

module.exports = MetricsInterface;
