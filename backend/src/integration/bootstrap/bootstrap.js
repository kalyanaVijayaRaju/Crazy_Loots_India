const startupManager = require('../startup/startupManager');
const logger = require('../../utils/logger');

class Bootstrap {
  async boot() {
    logger.info('[Bootstrap] Bootstrapping Crazy Loots India Platform...');
    return startupManager.initialize();
  }
}

module.exports = new Bootstrap();
