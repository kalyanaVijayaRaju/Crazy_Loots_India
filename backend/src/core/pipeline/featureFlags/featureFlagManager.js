const logger = require('../../../utils/logger');

class FeatureFlagManager {
  constructor() {
    this.flags = new Map();
    this.initDefaultFlags();
  }

  initDefaultFlags() {
    this.register('ENABLE_PLAYWRIGHT', false);
    this.register('ENABLE_REDIS', false);
    this.register('ENABLE_KAFKA', false);
    this.register('ENABLE_RABBITMQ', false);
    this.register('ENABLE_TELEGRAM', true);
    this.register('ENABLE_AI_SCORING', false);
    this.register('ENABLE_AFFILIATE', true);
    this.register('ENABLE_ANALYTICS', true);
    this.register('ENABLE_COUPONS', true);
  }

  register(flagName, defaultValue = false) {
    if (!flagName || typeof flagName !== 'string') {
      throw new Error('FeatureFlagManager requires a valid flagName string.');
    }
    const key = flagName.toUpperCase().trim();
    this.flags.set(key, Boolean(defaultValue));
    logger.debug(`[FeatureFlagManager] Registered flag '${key}' = ${this.flags.get(key)}`);
  }

  enable(flagName) {
    const key = flagName.toUpperCase().trim();
    this.flags.set(key, true);
    logger.info(`[FeatureFlagManager] Feature flag '${key}' ENABLED`);
  }

  disable(flagName) {
    const key = flagName.toUpperCase().trim();
    this.flags.set(key, false);
    logger.info(`[FeatureFlagManager] Feature flag '${key}' DISABLED`);
  }

  toggle(flagName) {
    const key = flagName.toUpperCase().trim();
    const current = this.isEnabled(key);
    this.flags.set(key, !current);
    logger.info(`[FeatureFlagManager] Feature flag '${key}' toggled to ${!current}`);
    return !current;
  }

  isEnabled(flagName) {
    if (!flagName || typeof flagName !== 'string') {
      return false;
    }
    const key = flagName.toUpperCase().trim();
    return Boolean(this.flags.get(key));
  }

  getAllFlags() {
    return Object.fromEntries(this.flags);
  }
}

module.exports = new FeatureFlagManager();
