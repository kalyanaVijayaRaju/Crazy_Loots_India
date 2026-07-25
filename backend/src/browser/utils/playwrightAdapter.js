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
      try {
        const browser = await this.playwrightModule[type].launch(options);
        return browser;
      } catch (launchErr) {
        logger.warn(`[PlaywrightAdapter] Native ${type} browser launch failed: ${launchErr.message}`);
        // If browser binary missing error, try auto-installing
        if (launchErr.message.includes('Executable doesn\'t exist') || launchErr.message.includes('Please run the following command')) {
          try {
            logger.info('[PlaywrightAdapter] Attempting automatic browser binary installation...');
            const { execSync } = require('child_process');
            execSync('npx playwright install chromium', { stdio: 'ignore' });
            logger.info('[PlaywrightAdapter] Browser installation completed. Retrying browser launch...');
            return await this.playwrightModule[type].launch(options);
          } catch (installErr) {
            logger.error(`[PlaywrightAdapter] Auto-installation of browser binaries failed: ${installErr.message}`);
          }
        }
      }
    }

    logger.warn(`[PlaywrightAdapter] Native Playwright unavailable or failed. Operating in architecture mock mode.`);
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
