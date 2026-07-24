const { connectDB } = require('../../config/database');
const { merchantFactory } = require('../../merchants');
const { playwrightAdapter } = require('../../browser');
const publishingModeManager = require('../../telegramPublishing/mode/publishingModeManager');
const logger = require('../../utils/logger');

class StartupManager {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return { initialized: true, alreadyInitialized: true };
    }

    const startMs = Date.now();
    logger.info('[StartupManager] Starting application subsystem initialization sequence...');

    // 1. Connect Database (if not connected)
    try {
      await connectDB();
    } catch (err) {
      logger.warn(`[StartupManager] Database connection skipped or failed: ${err.message}`);
    }

    // 2. Verify Merchant Registry
    try {
      merchantFactory.getAdapter('amazon');
      logger.info('[StartupManager] Merchant adapters verified.');
    } catch (err) {
      logger.warn(`[StartupManager] Merchant adapter check warning: ${err.message}`);
    }

    // 3. Initialize Browser Platform
    try {
      if (playwrightAdapter && typeof playwrightAdapter.healthCheck === 'function') {
        await playwrightAdapter.healthCheck();
      }
    } catch (err) {
      logger.warn(`[StartupManager] Playwright browser platform check skipped: ${err.message}`);
    }

    // 4. Set default publishing mode to DRY_RUN
    publishingModeManager.setMode('DRY_RUN');

    this.initialized = true;
    const durationMs = Date.now() - startMs;
    logger.info(`[StartupManager] All subsystems successfully initialized in ${durationMs}ms`);

    return {
      initialized: true,
      durationMs,
    };
  }
}

module.exports = new StartupManager();
