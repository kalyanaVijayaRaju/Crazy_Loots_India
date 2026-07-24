/**
 * Standardized Domain Event Constants
 */
const DomainEventTypes = Object.freeze({
  PRODUCT_MONITORING_REQUESTED: 'ProductMonitoringRequested',
  PRODUCT_MONITORING_STARTED: 'ProductMonitoringStarted',
  PRODUCT_MONITORING_COMPLETED: 'ProductMonitoringCompleted',
  PRODUCT_MONITORING_FAILED: 'ProductMonitoringFailed',
  PRODUCT_QUEUED: 'ProductQueued',
  PRODUCT_DEQUEUED: 'ProductDequeued',
  MERCHANT_RESOLVED: 'MerchantResolved',
  MERCHANT_UNAVAILABLE: 'MerchantUnavailable',
  QUEUE_OVERFLOW: 'QueueOverflow',
  RETRY_SCHEDULED: 'RetryScheduled',
  RETRY_STARTED: 'RetryStarted',
  RETRY_COMPLETED: 'RetryCompleted',
  RETRY_EXCEEDED: 'RetryExceeded',
  STATE_CHANGED: 'StateChanged',
  MONITORING_CANCELLED: 'MonitoringCancelled',
  EXECUTION_STARTED: 'ExecutionStarted',
  EXECUTION_COMPLETED: 'ExecutionCompleted',
  EXECUTION_FAILED: 'ExecutionFailed',
});

module.exports = DomainEventTypes;
