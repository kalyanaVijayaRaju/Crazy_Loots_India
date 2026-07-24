class RuleSimulator {
  /**
   * Simulate a rule evaluation on sample context without affecting state
   * @param {Object} rule - Rule object with evaluate function
   * @param {Object} context - Test context
   * @returns {Object} Simulation result
   */
  simulate(rule, context) {
    try {
      const passed = Boolean(rule.evaluate(context));
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        passed,
        reason: passed ? 'Rule conditions satisfied.' : `Rule condition failed: ${rule.description}`,
        expectedScore: passed ? 100 : 0,
        simulatedAt: new Date().toISOString(),
      };
    } catch (err) {
      return {
        ruleId: rule.id || 'unknown',
        ruleName: rule.name || 'unknown',
        passed: false,
        reason: `Simulation Exception: ${err.message}`,
        expectedScore: 0,
        simulatedAt: new Date().toISOString(),
      };
    }
  }
}

module.exports = new RuleSimulator();
