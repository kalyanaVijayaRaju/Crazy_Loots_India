const idProvider = require('../../pipeline/providers/idProvider');
const timeProvider = require('../../pipeline/providers/timeProvider');

/**
 * Immutable TraceContext DTO
 */
class TraceContext {
  constructor({
    requestId,
    traceId,
    correlationId,
    taskId,
    executionId,
    merchant,
    productId,
    metadata = {},
  }) {
    this.requestId = requestId || idProvider.generateTraceId();
    this.traceId = traceId || idProvider.generateTraceId();
    this.correlationId = correlationId || idProvider.generateCorrelationId();
    this.taskId = taskId || idProvider.generateTaskId();
    this.executionId = executionId || `exec_${idProvider.uuid()}`;
    this.merchant = merchant ? String(merchant).toLowerCase().trim() : '';
    this.productId = productId ? String(productId).trim() : '';
    this.createdAt = timeProvider.iso();
    this.metadata = Object.freeze({ ...metadata });

    Object.freeze(this);
  }

  static from(params) {
    return new TraceContext(params);
  }
}

module.exports = TraceContext;
