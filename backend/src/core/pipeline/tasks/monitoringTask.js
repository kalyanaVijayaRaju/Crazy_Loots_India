const idProvider = require('../providers/idProvider');
const timeProvider = require('../providers/timeProvider');
const { PriorityLevels } = require('../../priority/priority.constants');
const { MonitoringStates } = require('../../state/monitoringStateMachine');

/**
 * Immutable MonitoringTask Model
 */
class MonitoringTask {
  constructor(builder) {
    if (!builder._merchant || !builder._productId) {
      throw new Error('MonitoringTask requires merchant and productId.');
    }

    this.taskId = builder._taskId || idProvider.generateTaskId();
    this.traceId = builder._traceId || idProvider.generateTraceId();
    this.correlationId = builder._correlationId || idProvider.generateCorrelationId();
    this.merchant = String(builder._merchant).toLowerCase().trim();
    this.productId = String(builder._productId).trim();
    this.priority = builder._priority || PriorityLevels.NORMAL;
    this.state = builder._state || MonitoringStates.IDLE;
    this.strategy = builder._strategy || 'default-strategy';
    this.retryPolicy = builder._retryPolicy || { maxRetries: 3, backoffFactor: 2 };
    this.createdAt = builder._createdAt || timeProvider.iso();
    this.updatedAt = timeProvider.iso();
    this.metadata = Object.freeze({ ...builder._metadata });

    Object.freeze(this);
  }

  static get Builder() {
    class MonitoringTaskBuilder {
      constructor() {
        this._metadata = {};
      }

      setTaskId(id) {
        this._taskId = id;
        return this;
      }

      setTraceId(traceId) {
        this._traceId = traceId;
        return this;
      }

      setCorrelationId(corrId) {
        this._correlationId = corrId;
        return this;
      }

      setMerchant(merchant) {
        this._merchant = merchant;
        return this;
      }

      setProductId(productId) {
        this._productId = productId;
        return this;
      }

      setPriority(priority) {
        this._priority = priority;
        return this;
      }

      setState(state) {
        this._state = state;
        return this;
      }

      setStrategy(strategy) {
        this._strategy = strategy;
        return this;
      }

      setRetryPolicy(policy) {
        this._retryPolicy = policy;
        return this;
      }

      setMetadata(metadata) {
        this._metadata = { ...this._metadata, ...metadata };
        return this;
      }

      build() {
        return new MonitoringTask(this);
      }
    }
    return MonitoringTaskBuilder;
  }
}

module.exports = MonitoringTask;
