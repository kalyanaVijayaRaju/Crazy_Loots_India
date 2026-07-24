const logger = require('../../utils/logger');

class LifecycleManager {
  constructor() {
    this.startupHooks = [];
    this.shutdownHooks = [];
    this.isInitialized = false;
    this.isShuttingDown = false;
  }

  /**
   * Register startup initialization hook
   * @param {string} name
   * @param {Function} hookFn
   */
  registerStartupHook(name, hookFn) {
    if (typeof hookFn !== 'function') {
      throw new Error('Startup hook must be a function.');
    }
    this.startupHooks.push({ name, fn: hookFn });
    logger.debug(`[LifecycleManager] Registered startup hook '${name}'`);
  }

  /**
   * Register graceful shutdown hook
   * @param {string} name
   * @param {Function} hookFn
   */
  registerShutdownHook(name, hookFn) {
    if (typeof hookFn !== 'function') {
      throw new Error('Shutdown hook must be a function.');
    }
    this.shutdownHooks.push({ name, fn: hookFn });
    logger.debug(`[LifecycleManager] Registered shutdown hook '${name}'`);
  }

  /**
   * Execute all registered startup hooks sequentially
   */
  async initialize() {
    if (this.isInitialized) {
      logger.warn('[LifecycleManager] Already initialized.');
      return;
    }

    logger.info(`[LifecycleManager] Executing ${this.startupHooks.length} startup hooks...`);
    for (const hook of this.startupHooks) {
      try {
        logger.info(`[LifecycleManager] Running startup hook '${hook.name}'...`);
        await hook.fn();
        logger.info(`[LifecycleManager] Startup hook '${hook.name}' completed.`);
      } catch (err) {
        logger.error(`[LifecycleManager] Startup hook '${hook.name}' failed: ${err.message}`, {
          stack: err.stack,
        });
        throw err;
      }
    }
    this.isInitialized = true;
    logger.info('[LifecycleManager] All startup hooks executed successfully.');
  }

  /**
   * Execute all registered shutdown hooks sequentially
   */
  async shutdown() {
    if (this.isShuttingDown) {
      return;
    }
    this.isShuttingDown = true;
    logger.info(`[LifecycleManager] Executing ${this.shutdownHooks.length} shutdown hooks...`);

    for (const hook of this.shutdownHooks) {
      try {
        logger.info(`[LifecycleManager] Running shutdown hook '${hook.name}'...`);
        await hook.fn();
        logger.info(`[LifecycleManager] Shutdown hook '${hook.name}' completed.`);
      } catch (err) {
        logger.error(`[LifecycleManager] Shutdown hook '${hook.name}' failed: ${err.message}`, {
          stack: err.stack,
        });
      }
    }
    this.isInitialized = false;
    logger.info('[LifecycleManager] Shutdown hooks completed.');
  }
}

module.exports = new LifecycleManager();
