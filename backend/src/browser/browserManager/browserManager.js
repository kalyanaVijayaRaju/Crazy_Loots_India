const browserFactory = require('../factory/browserFactory');
const browserRegistry = require('../registry/browserRegistry');
const BrowserConfiguration = require('../configuration/browserConfiguration');
const idProvider = require('../../core/pipeline/providers/idProvider');
const eventBus = require('../../core/events/eventBus');
const BrowserEventTypes = require('../events/browserEventTypes');
const logger = require('../../utils/logger');

class BrowserManager {
  constructor() {
    this.currentBrowser = null;
    this.currentBrowserId = null;
    this.restartCount = 0;
    this.factory = browserFactory;
    this.registry = browserRegistry;
  }

  async launchBrowser(type = 'chromium', config = null) {
    if (this.currentBrowser && this.currentBrowser.isConnected && this.currentBrowser.isConnected()) {
      return this.currentBrowser;
    }

    const cfg = config || BrowserConfiguration.defaultConfig();
    this.currentBrowserId = `brw_${idProvider.generateTaskId()}`;
    logger.info(`[BrowserManager] Launching browser '${this.currentBrowserId}'...`);

    this.currentBrowser = await this.factory.createBrowser(type, cfg);
    this.registry.registerBrowser(this.currentBrowserId, this.currentBrowser, { type, headless: cfg.headless });
    await eventBus.emit(BrowserEventTypes.BROWSER_STARTED, { browserId: this.currentBrowserId, type });

    return this.currentBrowser;
  }

  async shutdownBrowser() {
    if (!this.currentBrowser) {
      return;
    }
    const id = this.currentBrowserId;
    logger.info(`[BrowserManager] Shutting down browser '${id}'...`);

    try {
      if (this.currentBrowser.close) {
        await this.currentBrowser.close();
      }
    } catch (err) {
      logger.error(`[BrowserManager] Error closing browser '${id}': ${err.message}`);
    }

    this.registry.unregisterBrowser(id);
    this.currentBrowser = null;
    this.currentBrowserId = null;
    await eventBus.emit(BrowserEventTypes.BROWSER_CLOSED, { browserId: id });
  }

  async restartBrowser(type = 'chromium', config = null) {
    logger.warn('[BrowserManager] Triggering browser restart...');
    this.restartCount += 1;
    await this.shutdownBrowser();
    const browser = await this.launchBrowser(type, config);
    await eventBus.emit(BrowserEventTypes.BROWSER_RESTARTED, { restartCount: this.restartCount });
    return browser;
  }
}

module.exports = new BrowserManager();
