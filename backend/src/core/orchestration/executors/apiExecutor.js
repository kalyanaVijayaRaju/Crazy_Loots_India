const ExecutorInterface = require('./executor.interface');
const logger = require('../../../utils/logger');

class ApiExecutor extends ExecutorInterface {
  constructor() {
    super('ApiExecutor');
    this.initialized = false;
  }

  async initialize() {
    this.initialized = true;
    logger.info('[ApiExecutor] Initialized placeholder stub.');
  }

  async execute(_context) {
    throw new Error('[ApiExecutor] Execution stub called. Direct API requests disabled in Phase 7.');
  }

  async shutdown() {
    this.initialized = false;
    logger.info('[ApiExecutor] Shutdown completed.');
  }

  async healthCheck() {
    return {
      status: this.initialized ? 'HEALTHY' : 'UNINITIALIZED',
      executor: this.name(),
    };
  }

  getCapabilities() {
    return { name: this.name(), type: 'direct-api', rateLimited: true };
  }
}

module.exports = ApiExecutor;
