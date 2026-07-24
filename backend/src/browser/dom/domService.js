const logger = require('../../utils/logger');

class DomService {
  async click(page, selector, options = {}) {
    logger.debug(`[DomService] Clicking selector '${selector}'`);
    if (page.click) {
      return page.click(selector, options);
    }
    return true;
  }

  async fill(page, selector, value, options = {}) {
    logger.debug(`[DomService] Filling selector '${selector}'`);
    if (page.fill) {
      return page.fill(selector, value, options);
    }
    return true;
  }

  async text(page, selector) {
    if (page.textContent) {
      return page.textContent(selector);
    }
    return '';
  }

  async attribute(page, selector, name) {
    if (page.getAttribute) {
      return page.getAttribute(selector, name);
    }
    return null;
  }

  async exists(page, selector) {
    try {
      if (page.$) {
        const el = await page.$(selector);
        return el !== null;
      }
      return true;
    } catch (_err) {
      return false;
    }
  }

  async scroll(page, selectorOrPosition) {
    logger.debug(`[DomService] Scrolling '${selectorOrPosition}'`);
    if (page.evaluate) {
      await page.evaluate(() => {
        if (typeof globalThis.window !== 'undefined') {
          globalThis.window.scrollBy(0, globalThis.window.innerHeight);
        }
      });
    }
    return true;
  }

  async hover(page, selector) {
    logger.debug(`[DomService] Hovering selector '${selector}'`);
    if (page.hover) {
      await page.hover(selector);
    }
    return true;
  }

  async waitForSelector(page, selector, options = {}) {
    if (page.waitForSelector) {
      return page.waitForSelector(selector, options);
    }
    return true;
  }

  async count(page, selector) {
    if (page.$$) {
      const els = await page.$$(selector);
      return els.length;
    }
    return 1;
  }
}

module.exports = new DomService();
