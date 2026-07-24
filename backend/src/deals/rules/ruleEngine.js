const ruleRegistry = require('./ruleRegistry');
const logger = require('../../utils/logger');

class RuleEngine {
  /**
   * Evaluate context against all active rules
   * @param {Object} context - { product, historySummary, trend, comparisonSpec }
   * @returns {Object} Evaluation summary { passed: boolean, passedRules: [], failedRules: [] }
   */
  evaluate(context) {
    const activeRules = ruleRegistry.getRules();
    const passedRules = [];
    const failedRules = [];

    for (const rule of activeRules) {
      try {
        const result = rule.evaluate(context);
        if (result) {
          passedRules.push(rule);
        } else {
          failedRules.push({ rule, reason: `Failed ${rule.name} (${rule.description})` });
        }
      } catch (err) {
        logger.error(`[RuleEngine] Error evaluating rule '${rule.id}': ${err.message}`);
        failedRules.push({ rule, reason: `Execution Error: ${err.message}` });
      }
    }

    const passed = failedRules.length === 0;
    return {
      passed,
      passedRules,
      failedRules,
    };
  }
}

module.exports = new RuleEngine();
