const browserFactory = require('../factory/browserFactory');
const contextPool = require('../contextPool/contextPool');
const browserRegistry = require('../registry/browserRegistry');
const idProvider = require('../../core/pipeline/providers/idProvider');
const eventBus = require('../../core/events/eventBus');
const BrowserEventTypes = require('../events/browserEventTypes');
const logger = require('../../utils/logger');

class PagePool {
  constructor() {
    this.pages = new Map();
    this.factory = browserFactory;
  }

  async acquirePage(config = null) {
    const context = await contextPool.acquireContext(config);
    const page = await this.factory.createPage(context);
    const pageId = `pg_${idProvider.generateTaskId()}`;

    this.pages.set(page, { pageId, context });
    browserRegistry.registerPage(pageId, page);
    await eventBus.emit(BrowserEventTypes.PAGE_CREATED, { pageId });

    logger.debug(`[PagePool] Acquired new page '${pageId}'`);
    return page;
  }

  async releasePage(page) {
    const entry = this.pages.get(page);
    if (!entry) {
      return;
    }
    const { pageId, context } = entry;
    logger.debug(`[PagePool] Releasing page '${pageId}'`);

    try {
      if (page.close) {
        await page.close();
      }
    } catch (err) {
      logger.error(`[PagePool] Error closing page '${pageId}': ${err.message}`);
    }

    browserRegistry.unregisterPage(pageId);
    this.pages.delete(page);
    await eventBus.emit(BrowserEventTypes.PAGE_DESTROYED, { pageId });

    await contextPool.releaseContext(context);
  }

  async clearAll() {
    for (const page of Array.from(this.pages.keys())) {
      await this.releasePage(page);
    }
  }
}

module.exports = new PagePool();
