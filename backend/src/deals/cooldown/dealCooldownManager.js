const logger = require('../../utils/logger');

class DealCooldownManager {
  constructor() {
    this.cooldowns = new Map(); // productId -> timestamp
  }

  isCoolingDown(productId, cooldownHours = 6) {
    const key = String(productId);
    const lastTime = this.cooldowns.get(key);
    if (!lastTime) {
      return false;
    }
    const elapsedMs = Date.now() - lastTime;
    const cooldownMs = cooldownHours * 3600 * 1000;
    const isCool = elapsedMs < cooldownMs;

    if (isCool) {
      logger.debug(`[DealCooldownManager] Product '${key}' is in cooldown (${Math.round((cooldownMs - elapsedMs) / 60000)}m remaining)`);
    }
    return isCool;
  }

  applyCooldown(productId) {
    const key = String(productId);
    this.cooldowns.set(key, Date.now());
    logger.debug(`[DealCooldownManager] Applied deal cooldown for product '${key}'`);
  }
}

module.exports = new DealCooldownManager();
