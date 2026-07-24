const crypto = require('crypto');

/**
 * ExecutionContext DTO
 */
class ExecutionContext {
  constructor({ monitoringContext, attempt = 1, metadata = {} }) {
    this.contextId = `exec_${crypto.randomUUID()}`;
    this.monitoringContext = monitoringContext;
    this.attempt = attempt;
    this.startTime = Date.now();
    this.metadata = metadata;
  }
}

/**
 * ExecutionResult DTO
 */
class ExecutionResult {
  constructor({ success, data = null, error = null, durationMs = 0 }) {
    this.success = Boolean(success);
    this.data = data;
    this.error = error ? (typeof error === 'object' ? error.message : String(error)) : null;
    this.durationMs = durationMs;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Abstract Executor Interface Contract
 */
class ExecutorInterface {
  constructor() {
    if (this.constructor === ExecutorInterface) {
      throw new Error('ExecutorInterface is an abstract class.');
    }
  }

  async execute(_context) {
    throw new Error(`Method 'execute()' must be implemented by ${this.constructor.name}.`);
  }
}

/**
 * Abstract CircuitBreaker Interface Contract (Placeholder)
 */
class CircuitBreakerInterface {
  constructor(name = 'default') {
    if (this.constructor === CircuitBreakerInterface) {
      throw new Error('CircuitBreakerInterface is an abstract class.');
    }
    this.name = name;
  }

  open() {
    throw new Error('Method open() must be implemented.');
  }

  close() {
    throw new Error('Method close() must be implemented.');
  }

  halfOpen() {
    throw new Error('Method halfOpen() must be implemented.');
  }

  allowRequest() {
    throw new Error('Method allowRequest() must be implemented.');
  }

  reset() {
    throw new Error('Method reset() must be implemented.');
  }
}

module.exports = {
  ExecutionContext,
  ExecutionResult,
  ExecutorInterface,
  CircuitBreakerInterface,
};
