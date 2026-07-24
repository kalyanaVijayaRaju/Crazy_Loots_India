const ruleRegistry = require('./ruleRegistry');
const logger = require('../../utils/logger');

class RuleVersionManager {
  constructor() {
    this.history = new Map(); // ruleId -> array of versions
  }

  saveVersion(rule) {
    const list = this.history.get(rule.id) || [];
    list.push({ ...rule, savedAt: new Date().toISOString() });
    this.history.set(rule.id, list);
    logger.debug(`[RuleVersionManager] Saved version ${rule.version} for rule '${rule.id}'`);
  }

  rollback(ruleId, versionStr) {
    const list = this.history.get(ruleId);
    if (!list) {
      throw new Error(`RuleVersionManager: No history found for rule '${ruleId}'`);
    }
    const match = list.find((r) => r.version === versionStr);
    if (!match) {
      throw new Error(`RuleVersionManager: Version '${versionStr}' not found for rule '${ruleId}'`);
    }
    ruleRegistry.registerRule({ ...match });
    logger.info(`[RuleVersionManager] Rolled back rule '${ruleId}' to version ${versionStr}`);
    return match;
  }
}

module.exports = new RuleVersionManager();
