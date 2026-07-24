const HealthCheckInterface = require('../health/healthCheck.interface');

/**
 * Abstract ExecutorInterface
 */
class ExecutorInterface extends HealthCheckInterface {
  constructor(name = 'AbstractExecutor') {
    super(name);
    if (this.constructor === ExecutorInterface) {
      throw new Error('ExecutorInterface is an abstract class.');
    }
  }

  async initialize() {
    throw new Error(`Method 'initialize()' must be implemented by ${this.name()}`);
  }

  async execute(_context) {
    throw new Error(`Method 'execute()' must be implemented by ${this.name()}`);
  }

  async shutdown() {
    throw new Error(`Method 'shutdown()' must be implemented by ${this.name()}`);
  }

  async healthCheck() {
    return { status: 'HEALTHY', executor: this.name() };
  }

  supports(_merchantName) {
    return true;
  }

  getCapabilities() {
    return { name: this.name(), type: 'abstract', async: true };
  }
}

module.exports = ExecutorInterface;
