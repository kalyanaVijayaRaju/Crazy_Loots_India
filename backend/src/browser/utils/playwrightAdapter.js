const logger = require('../../utils/logger');

/**
 * PlaywrightAdapter Class
 * Wraps Playwright API interactions to ensure clean architecture isolation.
 */
class PlaywrightAdapter {
  constructor() {
    this.playwrightModule = null;
    this.initPlaywrightModule();
  }

  initPlaywrightModule() {
    try {
      // Lazy load playwright if installed
      // eslint-disable-next-line global-require
      this.playwrightModule = require('playwright');
      logger.info('[PlaywrightAdapter] Loaded native Playwright module.');
    } catch (_err) {
      logger.info('[PlaywrightAdapter] Playwright module not installed. Operating in architecture mock mode.');
      this.playwrightModule = null;
    }
  }

  isNativeAvailable() {
    return Boolean(this.playwrightModule);
  }

  async launchBrowser(type = 'chromium', options = {}) {
    if (this.isNativeAvailable() && this.playwrightModule[type]) {
      logger.info(`[PlaywrightAdapter] Launching native ${type} browser...`);
      return this.playwrightModule[type].launch(options);
    }

    logger.debug(`[PlaywrightAdapter] Creating mock ${type} browser instance...`);
    return {
      _isMock: true,
      type,
      newContext: async (ctxOpts = {}) => this.createMockContext(ctxOpts),
      close: async () => logger.debug(`[PlaywrightAdapter] Mock browser closed`),
      isConnected: () => true,
    };
  }

  async createMockContext(options = {}) {
    return {
      _isMock: true,
      options,
      newPage: async () => this.createMockPage(),
      close: async () => logger.debug(`[PlaywrightAdapter] Mock context closed`),
    };
  }

  async createMockPage() {
    return {
      _isMock: true,
      url: () => 'about:blank',
      goto: async (url) => ({ status: () => 200, url: () => url }),
      reload: async () => ({ status: () => 200 }),
      goBack: async () => null,
      goForward: async () => null,
      click: async () => true,
      fill: async () => true,
      textContent: async () => 'Sample text',
      getAttribute: async () => 'sample-attribute',
      waitForSelector: async () => true,
      screenshot: async () => Buffer.from('mock-screenshot'),
      close: async () => logger.debug(`[PlaywrightAdapter] Mock page closed`),
    };
  }
}

module.exports = new PlaywrightAdapter();
