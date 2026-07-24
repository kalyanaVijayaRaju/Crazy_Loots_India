const playwrightAdapter = require('../utils/playwrightAdapter');
const BrowserConfiguration = require('../configuration/browserConfiguration');
const logger = require('../../utils/logger');

class BrowserFactory {
  constructor() {
    this.adapter = playwrightAdapter;
  }

  async createBrowser(type = 'chromium', config = null) {
    const cfg = config || BrowserConfiguration.defaultConfig();
    logger.debug(`[BrowserFactory] Creating browser type '${type}' (headless: ${cfg.headless})`);
    return this.adapter.launchBrowser(type, {
      headless: cfg.headless,
      slowMo: cfg.slowMo,
      timeout: cfg.timeout,
    });
  }

  async createContext(browser, config = null) {
    const cfg = config || BrowserConfiguration.defaultConfig();
    logger.debug(`[BrowserFactory] Creating browser context (locale: ${cfg.locale}, tz: ${cfg.timezone})`);
    if (browser.newContext) {
      return browser.newContext({
        viewport: cfg.viewport,
        locale: cfg.locale,
        timezoneId: cfg.timezone,
        userAgent: cfg.userAgent,
      });
    }
    return this.adapter.createMockContext(cfg);
  }

  async createPage(context) {
    logger.debug('[BrowserFactory] Creating new browser page');
    if (context.newPage) {
      return context.newPage();
    }
    return this.adapter.createMockPage();
  }
}

module.exports = new BrowserFactory();
