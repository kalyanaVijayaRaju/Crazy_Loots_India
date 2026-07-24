const HealthCheckInterface = require('../health/healthCheck.interface');

/**
 * Abstract SchedulerInterface
 */
class SchedulerInterface extends HealthCheckInterface {
  constructor(name = 'AbstractScheduler') {
    super(name);
    if (this.constructor === SchedulerInterface) {
      throw new Error('SchedulerInterface is an abstract class.');
    }
  }

  async schedule(_task, _options = {}) {
    throw new Error(`Method 'schedule()' must be implemented by ${this.name()}`);
  }

  async cancel(_taskId) {
    throw new Error(`Method 'cancel()' must be implemented by ${this.name()}`);
  }

  async pause() {
    throw new Error(`Method 'pause()' must be implemented by ${this.name()}`);
  }

  async resume() {
    throw new Error(`Method 'resume()' must be implemented by ${this.name()}`);
  }

  async shutdown() {
    throw new Error(`Method 'shutdown()' must be implemented by ${this.name()}`);
  }

  async healthCheck() {
    return { status: 'HEALTHY', scheduler: this.name() };
  }
}

module.exports = SchedulerInterface;
