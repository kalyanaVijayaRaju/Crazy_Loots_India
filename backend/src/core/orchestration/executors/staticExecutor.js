const ExecutorInterface = require('./executor.interface');
const { merchantRegistry } = require('../../../merchants');
const logger = require('../../../utils/logger');

class StaticExecutor extends ExecutorInterface {
  constructor() {
    super('StaticExecutor');
    this.initialized = true;
  }

  async initialize() {
    this.initialized = true;
    logger.info('[StaticExecutor] Initialized default static executor.');
  }

  async execute(context) {
    const merchantName = context.merchant;
    const productId = context.productId;
    logger.debug(`[StaticExecutor] Executing fetch for merchant '${merchantName}' (product: ${productId})`);

    const adapter = merchantRegistry.get(merchantName);
    const productDTO = await adapter.getProduct(productId);
    return productDTO;
  }

  async shutdown() {
    this.initialized = false;
    logger.info('[StaticExecutor] Shutdown completed.');
  }

  async healthCheck() {
    return {
      status: this.initialized ? 'HEALTHY' : 'UNINITIALIZED',
      executor: this.name(),
    };
  }

  supports(_merchantName) {
    return true; // Supports all registered merchants
  }

  getCapabilities() {
    return { name: this.name(), type: 'static-mock', headless: false };
  }
}

module.exports = StaticExecutor;
