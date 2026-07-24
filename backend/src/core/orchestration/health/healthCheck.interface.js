/**
 * HealthCheckInterface Contract
 * Every core system component must implement healthCheck().
 */
class HealthCheckInterface {
  constructor(name) {
    if (this.constructor === HealthCheckInterface) {
      throw new Error('HealthCheckInterface is an abstract interface and cannot be instantiated directly.');
    }
    this._name = name || this.constructor.name;
  }

  name() {
    return this._name;
  }

  async healthCheck() {
    throw new Error(`Method 'healthCheck()' must be implemented by ${this.name()}`);
  }
}

module.exports = HealthCheckInterface;
