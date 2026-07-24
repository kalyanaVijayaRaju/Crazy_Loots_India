const crypto = require('crypto');
const { MonitoringStateMachine, MonitoringStates } = require('../state/monitoringStateMachine');
const { PriorityLevels } = require('../priority/priority.constants');

/**
 * MonitoringContext Class
 * Immutable/Flow object passed across all monitoring pipeline stages.
 */
class MonitoringContext {
  constructor({
    correlationId,
    merchant,
    productId,
    priority = PriorityLevels.NORMAL,
    state = MonitoringStates.IDLE,
    retryCount = 0,
    metadata = {},
  }) {
    if (!merchant || typeof merchant !== 'string') {
      throw new Error('MonitoringContext requires a valid merchant string.');
    }
    if (!productId || typeof productId !== 'string') {
      throw new Error('MonitoringContext requires a valid productId string.');
    }

    this.correlationId = correlationId || `mon_${crypto.randomUUID()}`;
    this.merchant = merchant.toLowerCase().trim();
    this.productId = productId.trim();
    this.priority = typeof priority === 'number' ? priority : PriorityLevels.NORMAL;
    this.stateMachine = new MonitoringStateMachine(state);
    this.retryCount = Number(retryCount) || 0;
    this.createdAt = new Date().toISOString();
    this.metadata = metadata;
  }

  get state() {
    return this.stateMachine.getCurrentState();
  }

  setState(nextState, reason = '') {
    return this.stateMachine.transitionTo(nextState, reason);
  }

  incrementRetry() {
    this.retryCount += 1;
    return this.retryCount;
  }

  updateMetadata(key, value) {
    if (typeof key === 'object') {
      this.metadata = { ...this.metadata, ...key };
    } else {
      this.metadata[key] = value;
    }
  }

  toJSON() {
    return {
      correlationId: this.correlationId,
      merchant: this.merchant,
      productId: this.productId,
      priority: this.priority,
      state: this.state,
      retryCount: this.retryCount,
      createdAt: this.createdAt,
      metadata: this.metadata,
      history: this.stateMachine.getHistory(),
    };
  }
}

module.exports = MonitoringContext;
