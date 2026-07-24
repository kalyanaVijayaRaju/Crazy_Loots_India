const crypto = require('crypto');

/**
 * Standardized Domain Event Wrapper DTO
 */
class DomainEvent {
  constructor({
    eventName,
    payload,
    correlationId = null,
    source = 'crazy-loots-core',
    version = '1.0.0',
    metadata = {},
  }) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('DomainEvent requires a valid eventName string.');
    }

    this.eventId = crypto.randomUUID();
    this.eventName = eventName;
    this.timestamp = new Date().toISOString();
    this.correlationId = correlationId || `corr_${crypto.randomUUID()}`;
    this.payload = payload || {};
    this.metadata = metadata;
    this.source = source;
    this.version = version;
  }
}

/** Payload DTO for Monitoring Requested */
class MonitoringRequestedEvent {
  constructor({ merchant, productId, url = '', priority = 40 }) {
    this.merchant = merchant;
    this.productId = productId;
    this.url = url;
    this.priority = priority;
  }
}

/** Payload DTO for Monitoring Completed */
class MonitoringCompletedEvent {
  constructor({ merchant, productId, productData, durationMs = 0 }) {
    this.merchant = merchant;
    this.productId = productId;
    this.productData = productData;
    this.durationMs = durationMs;
  }
}

/** Payload DTO for Retry Events */
class RetryEvent {
  constructor({ merchant, productId, retryCount, maxRetries, error }) {
    this.merchant = merchant;
    this.productId = productId;
    this.retryCount = retryCount;
    this.maxRetries = maxRetries;
    this.error = typeof error === 'object' ? error.message : String(error);
  }
}

/** Payload DTO for Queue Events */
class QueueEvent {
  constructor({ queueName, itemId, size, priority }) {
    this.queueName = queueName;
    this.itemId = itemId;
    this.size = size;
    this.priority = priority;
  }
}

/** Payload DTO for Merchant Events */
class MerchantEvent {
  constructor({ merchant, status, reason = '' }) {
    this.merchant = merchant;
    this.status = status;
    this.reason = reason;
  }
}

/** Payload DTO for State Change Events */
class StateChangeEvent {
  constructor({ correlationId, merchant, productId, fromState, toState }) {
    this.correlationId = correlationId;
    this.merchant = merchant;
    this.productId = productId;
    this.fromState = fromState;
    this.toState = toState;
  }
}

module.exports = {
  DomainEvent,
  MonitoringRequestedEvent,
  MonitoringCompletedEvent,
  RetryEvent,
  QueueEvent,
  MerchantEvent,
  StateChangeEvent,
};
