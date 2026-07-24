const PluginInterface = require('../interfaces/plugin.interface');
const logger = require('../../../utils/logger');

class AffiliatePlugin extends PluginInterface {
  constructor() {
    super('AffiliatePlugin', '1.0.0');
    this.initialized = false;
  }

  async initialize() {
    this.initialized = true;
    logger.info('[AffiliatePlugin] Initialized architecture stub.');
  }

  async shutdown() {
    this.initialized = false;
    logger.info('[AffiliatePlugin] Shutdown completed.');
  }

  async healthCheck() {
    return {
      status: this.initialized ? 'HEALTHY' : 'UNINITIALIZED',
      plugin: this.name(),
    };
  }
}

module.exports = AffiliatePlugin;
