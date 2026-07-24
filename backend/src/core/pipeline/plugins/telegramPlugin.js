const PluginInterface = require('../interfaces/plugin.interface');
const logger = require('../../../utils/logger');

class TelegramPlugin extends PluginInterface {
  constructor() {
    super('TelegramPlugin', '1.0.0');
    this.initialized = false;
  }

  async initialize() {
    this.initialized = true;
    logger.info('[TelegramPlugin] Initialized architecture stub.');
  }

  async shutdown() {
    this.initialized = false;
    logger.info('[TelegramPlugin] Shutdown completed.');
  }

  async healthCheck() {
    return {
      status: this.initialized ? 'HEALTHY' : 'UNINITIALIZED',
      plugin: this.name(),
    };
  }
}

module.exports = TelegramPlugin;
