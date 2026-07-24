const eventBus = require('../../core/events/eventBus');
const BrowserEventTypes = require('../events/browserEventTypes');
const logger = require('../../utils/logger');

class ScreenshotService {
  async capturePage(page, options = {}) {
    logger.debug('[ScreenshotService] Capturing page screenshot...');
    const buffer = page.screenshot ? await page.screenshot(options) : Buffer.from('mock-screenshot');
    await eventBus.emit(BrowserEventTypes.SCREENSHOT_CAPTURED, { fullPage: Boolean(options.fullPage) });
    return buffer;
  }

  async captureElement(page, selector, options = {}) {
    logger.debug(`[ScreenshotService] Capturing element screenshot '${selector}'...`);
    if (page.locator) {
      const loc = page.locator(selector);
      return loc.screenshot(options);
    }
    return this.capturePage(page, options);
  }

  async captureFullPage(page) {
    return this.capturePage(page, { fullPage: true });
  }

  async captureFailure(page, contextId = 'failure') {
    logger.warn(`[ScreenshotService] Capturing failure screenshot for context '${contextId}'`);
    return this.capturePage(page, { fullPage: true });
  }
}

module.exports = new ScreenshotService();
