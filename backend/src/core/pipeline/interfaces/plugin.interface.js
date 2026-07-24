/**
 * PluginInterface Contract
 */
class PluginInterface {
  constructor(name, version = '1.0.0') {
    if (this.constructor === PluginInterface) {
      throw new Error('PluginInterface is an abstract class.');
    }
    this._name = name || this.constructor.name;
    this._version = version;
  }

  name() {
    return this._name;
  }

  version() {
    return this._version;
  }

  async initialize() {
    throw new Error(`Method 'initialize()' must be implemented by ${this.name()}`);
  }

  async shutdown() {
    throw new Error(`Method 'shutdown()' must be implemented by ${this.name()}`);
  }

  async healthCheck() {
    return { status: 'HEALTHY', plugin: this.name() };
  }

  metadata() {
    return { name: this.name(), version: this.version() };
  }
}

module.exports = PluginInterface;
