const logger = require('../../utils/logger');

class Container {
  constructor() {
    this.services = new Map();
    this.instances = new Map();
  }

  /**
   * Register a singleton service
   * @param {string} name
   * @param {Function|Object} factoryOrInstance
   */
  registerSingleton(name, factoryOrInstance) {
    if (!name || typeof name !== 'string') {
      throw new Error('Container requires a valid service name string.');
    }
    const key = name.toLowerCase().trim();

    if (typeof factoryOrInstance === 'function') {
      this.services.set(key, { type: 'singleton', factory: factoryOrInstance });
    } else {
      this.instances.set(key, factoryOrInstance);
      this.services.set(key, { type: 'instance' });
    }
    logger.debug(`[DIContainer] Registered singleton '${key}'`);
  }

  /**
   * Register a transient service (instantiated on every resolve)
   * @param {string} name
   * @param {Function} factory
   */
  registerTransient(name, factory) {
    if (!name || typeof name !== 'string') {
      throw new Error('Container requires a valid service name string.');
    }
    if (typeof factory !== 'function') {
      throw new Error('Transient registration requires a factory function.');
    }
    const key = name.toLowerCase().trim();
    this.services.set(key, { type: 'transient', factory });
    logger.debug(`[DIContainer] Registered transient '${key}'`);
  }

  /**
   * Resolve service instance by name
   * @param {string} name
   * @returns {Object}
   */
  resolve(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Container.resolve requires a valid service name.');
    }
    const key = name.toLowerCase().trim();

    if (this.instances.has(key)) {
      return this.instances.get(key);
    }

    const reg = this.services.get(key);
    if (!reg) {
      throw new Error(`Service '${name}' is not registered in DI container.`);
    }

    if (reg.type === 'singleton') {
      const instance = reg.factory(this);
      this.instances.set(key, instance);
      return instance;
    }

    if (reg.type === 'transient') {
      return reg.factory(this);
    }

    throw new Error(`Unknown registration type for service '${name}'.`);
  }

  /**
   * Clear all registered services and instances
   */
  clear() {
    this.services.clear();
    this.instances.clear();
    logger.debug('[DIContainer] Container cleared.');
  }
}

module.exports = new Container();
