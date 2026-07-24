const featureFlags = require('./featureFlags');
const logger = require('../../utils/logger');

const Modes = Object.freeze({
  DRY_RUN: 'DRY_RUN',
  SANDBOX: 'SANDBOX',
  LIVE: 'LIVE',
});

class PublishingModeManager {
  constructor() {
    this.currentMode = Modes.DRY_RUN; // Default mode MUST be DRY_RUN
  }

  getMode() {
    return this.currentMode;
  }

  setMode(mode) {
    const uppercaseMode = String(mode).toUpperCase();
    if (!Modes[uppercaseMode]) {
      throw new Error(`Invalid publishing mode '${mode}'. Must be DRY_RUN, SANDBOX, or LIVE.`);
    }

    if (uppercaseMode === Modes.LIVE && !featureFlags.isEnabled('ENABLE_LIVE_PUBLISHING')) {
      logger.warn('[PublishingModeManager] Cannot switch to LIVE mode: ENABLE_LIVE_PUBLISHING feature flag is disabled.');
      return false;
    }

    if (uppercaseMode === Modes.SANDBOX && !featureFlags.isEnabled('ENABLE_SANDBOX')) {
      logger.warn('[PublishingModeManager] Cannot switch to SANDBOX mode: ENABLE_SANDBOX feature flag is disabled.');
      return false;
    }

    this.currentMode = uppercaseMode;
    logger.info(`[PublishingModeManager] Switched publishing mode to '${this.currentMode}'`);
    return true;
  }

  isDryRun() {
    return this.currentMode === Modes.DRY_RUN;
  }

  isSandbox() {
    return this.currentMode === Modes.SANDBOX;
  }

  isLive() {
    return this.currentMode === Modes.LIVE;
  }
}

module.exports = new PublishingModeManager();
