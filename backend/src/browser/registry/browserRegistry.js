const logger = require('../../utils/logger');

class BrowserRegistry {
  constructor() {
    this.browsers = new Map();
    this.contexts = new Map();
    this.pages = new Map();
  }

  registerBrowser(id, browserInstance, metadata = {}) {
    this.browsers.set(id, { instance: browserInstance, metadata, registeredAt: new Date().toISOString() });
    logger.debug(`[BrowserRegistry] Registered browser '${id}'`);
  }

  unregisterBrowser(id) {
    const deleted = this.browsers.delete(id);
    if (deleted) {
      logger.debug(`[BrowserRegistry] Unregistered browser '${id}'`);
    }
    return deleted;
  }

  registerContext(id, contextInstance, metadata = {}) {
    this.contexts.set(id, { instance: contextInstance, metadata, registeredAt: new Date().toISOString() });
    logger.debug(`[BrowserRegistry] Registered context '${id}'`);
  }

  unregisterContext(id) {
    return this.contexts.delete(id);
  }

  registerPage(id, pageInstance, metadata = {}) {
    this.pages.set(id, { instance: pageInstance, metadata, registeredAt: new Date().toISOString() });
    logger.debug(`[BrowserRegistry] Registered page '${id}'`);
  }

  unregisterPage(id) {
    return this.pages.delete(id);
  }

  getStats() {
    return {
      activeBrowsers: this.browsers.size,
      activeContexts: this.contexts.size,
      activePages: this.pages.size,
    };
  }

  clearAll() {
    this.browsers.clear();
    this.contexts.clear();
    this.pages.clear();
  }
}

module.exports = new BrowserRegistry();
