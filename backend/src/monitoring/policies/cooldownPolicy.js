class CooldownPolicy {
  /**
   * Check if a product is still within its cooldown window
   * @param {Object} config - MonitoringConfiguration document
   * @returns {boolean} true if still in cooldown
   */
  isInCooldown(config) {
    if (!config || !config.lastRun) {
      return false;
    }
    const intervalMs = (config.interval || 3600) * 1000;
    const elapsed = Date.now() - new Date(config.lastRun).getTime();
    return elapsed < intervalMs;
  }
}

module.exports = new CooldownPolicy();
