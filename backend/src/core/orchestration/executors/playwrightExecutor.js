const ExecutorInterface = require('./executor.interface');
const logger = require('../../../utils/logger');

class PlaywrightExecutor extends ExecutorInterface {
  constructor() {
    super('PlaywrightExecutor');
    this.initialized = false;
  }

  async initialize() {
    this.initialized = true;
    logger.info('[PlaywrightExecutor] Initialized placeholder stub.');
  }

  async execute(_context) {
    throw new Error('[PlaywrightExecutor] Execution stub called. Real Playwright scraping disabled in Phase 7.');
  }

  async shutdown() {
    this.initialized = false;
    logger.info('[PlaywrightExecutor] Shutdown completed.');
  }

  async healthCheck() {
    return {
      status: this.initialized ? 'HEALTHY' : 'UNINITIALIZED',
      executor: this.name(),
    };
  }

  getCapabilities() {
    return { name: this.name(), type: 'playwright-headless', browserPool: true };
  }
}

module.exports = PlaywrightExecutor;
