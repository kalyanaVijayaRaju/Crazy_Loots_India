/**
 * Deal Detection Engine Event Type Constants
 */
module.exports = Object.freeze({
  DEAL_DETECTED: 'deal:detected',
  DEAL_REJECTED: 'deal:rejected',
  DEAL_APPROVED: 'deal:approved',
  DEAL_EXPIRED: 'deal:expired',
  DUPLICATE_DEAL_BLOCKED: 'deal:duplicate_blocked',
  COOLDOWN_APPLIED: 'deal:cooldown_applied',
  RULE_EVALUATED: 'deal:rule_evaluated',
  SCORE_CALCULATED: 'deal:score_calculated',
});
