const eventBus = require('../../core/events/eventBus');
const BrowserEventTypes = require('../events/browserEventTypes');
const logger = require('../../utils/logger');

class NavigationService {
  async goto(page, url, options = {}) {
    if (!page || !url) {
      throw new Error('NavigationService.goto requires page and url.');
    }
    const startMs = Date.now();
    logger.debug(`[NavigationService] Navigating to '${url}'`);
    await eventBus.emit(BrowserEventTypes.NAVIGATION_STARTED, { url });

    try {
      const res = await page.goto(url, { waitUntil: options.waitUntil || 'domcontentloaded', timeout: options.timeout || 30000 });
      const durationMs = Date.now() - startMs;
      await eventBus.emit(BrowserEventTypes.NAVIGATION_COMPLETED, { url, durationMs });
      return res;
    } catch (err) {
      const durationMs = Date.now() - startMs;
      await eventBus.emit(BrowserEventTypes.NAVIGATION_FAILED, { url, durationMs, error: err.message });
      logger.error(`[NavigationService] Failed to navigate to '${url}': ${err.message}`);
      throw err;
    }
  }

  async reload(page, options = {}) {
    logger.debug('[NavigationService] Reloading page');
    return page.reload(options);
  }

  async waitForLoad(page) {
    if (page.waitForLoadState) {
      await page.waitForLoadState('load');
    }
    return true;
  }

  async waitForNetworkIdle(page) {
    if (page.waitForLoadState) {
      await page.waitForLoadState('networkidle');
    }
    return true;
  }

  async goBack(page) {
    return page.goBack();
  }

  async goForward(page) {
    return page.goForward();
  }
}

module.exports = new NavigationService();
