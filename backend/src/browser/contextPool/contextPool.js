const browserFactory = require('../factory/browserFactory');
const browserPool = require('../browserPool/browserPool');
const browserRegistry = require('../registry/browserRegistry');
const idProvider = require('../../core/pipeline/providers/idProvider');
const eventBus = require('../../core/events/eventBus');
const BrowserEventTypes = require('../events/browserEventTypes');
const logger = require('../../utils/logger');

class ContextPool {
  constructor() {
    this.contexts = new Map();
    this.factory = browserFactory;
  }

  async acquireContext(config = null) {
    const browser = await browserPool.acquireBrowser();
    const context = await this.factory.createContext(browser, config);
    const contextId = `ctx_${idProvider.generateTaskId()}`;

    this.contexts.set(context, contextId);
    browserRegistry.registerContext(contextId, context);
    await eventBus.emit(BrowserEventTypes.CONTEXT_CREATED, { contextId });

    logger.debug(`[ContextPool] Acquired new context '${contextId}'`);
    return context;
  }

  async releaseContext(context) {
    const contextId = this.contexts.get(context);
    if (!contextId) {
      return;
    }
    logger.debug(`[ContextPool] Releasing context '${contextId}'`);

    try {
      if (context.close) {
        await context.close();
      }
    } catch (err) {
      logger.error(`[ContextPool] Error closing context '${contextId}': ${err.message}`);
    }

    browserRegistry.unregisterContext(contextId);
    this.contexts.delete(context);
    await eventBus.emit(BrowserEventTypes.CONTEXT_DESTROYED, { contextId });
  }

  async clearAll() {
    for (const context of Array.from(this.contexts.keys())) {
      await this.releaseContext(context);
    }
  }
}

module.exports = new ContextPool();
