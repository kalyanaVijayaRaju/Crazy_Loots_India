const browserManager = require('../browserManager/browserManager');
const browserPool = require('../browserPool/browserPool');
const contextPool = require('../contextPool/contextPool');
const pagePool = require('../pagePool/pagePool');
const logger = require('../../utils/logger');

class BrowserLifecycle {
  async handleCrashAndRecover(type = 'chromium') {
    logger.error('[BrowserLifecycle] Browser crash detected! Initiating automated recovery...');
    await pagePool.clearAll();
    await contextPool.clearAll();
    await browserPool.closeAll();
    return browserManager.restartBrowser(type);
  }

  async gracefulShutdown() {
    logger.info('[BrowserLifecycle] Initiating graceful browser infrastructure shutdown...');
    await pagePool.clearAll();
    await contextPool.clearAll();
    await browserPool.closeAll();
    logger.info('[BrowserLifecycle] Browser infrastructure shutdown complete.');
  }
}

module.exports = new BrowserLifecycle();
