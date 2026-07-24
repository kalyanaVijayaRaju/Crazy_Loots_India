const ExecutorInterface = require('./executor.interface');
const logger = require('../../../utils/logger');

class SeleniumExecutor extends ExecutorInterface {
  constructor() {
    super('SeleniumExecutor');
    this.initialized = false;
  }

  async initialize() {
    this.initialized = true;
    logger.info('[SeleniumExecutor] Initialized placeholder stub.');
  }

  async execute(_context) {
    throw new Error('[SeleniumExecutor] Execution stub called. Selenium disabled in Phase 7.');
  }

  async shutdown() {
    this.initialized = false;
    logger.info('[SeleniumExecutor] Shutdown completed.');
  }

  async healthCheck() {
    return {
      status: this.initialized ? 'HEALTHY' : 'UNINITIALIZED',
      executor: this.name(),
    };
  }

  getCapabilities() {
    return { name: this.name(), type: 'selenium-grid', gridSupport: true };
  }
}

module.exports = SeleniumExecutor;
