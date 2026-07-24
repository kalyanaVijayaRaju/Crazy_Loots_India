const browserManager = require('../browserManager/browserManager');
const logger = require('../../utils/logger');

class BrowserPool {
  constructor(maxSize = 2) {
    this.maxSize = maxSize;
    this.activePool = [];
    this.manager = browserManager;
  }

  async acquireBrowser(type = 'chromium') {
    logger.debug(`[BrowserPool] Acquiring browser instance (Pool size: ${this.activePool.length})`);
    const browser = await this.manager.launchBrowser(type);
    if (!this.activePool.includes(browser)) {
      this.activePool.push(browser);
    }
    return browser;
  }

  async releaseBrowser(browser) {
    logger.debug('[BrowserPool] Released browser instance back to pool');
    // Keep in pool for reuse until size exceeds limit
    if (this.activePool.length > this.maxSize) {
      await this.manager.shutdownBrowser();
      this.activePool = this.activePool.filter((b) => b !== browser);
    }
  }

  async closeAll() {
    logger.info('[BrowserPool] Closing all pooled browsers...');
    await this.manager.shutdownBrowser();
    this.activePool = [];
  }
}

module.exports = new BrowserPool();
