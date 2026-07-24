const crypto = require('crypto');
const ProviderInterface = require('../interfaces/provider.interface');

class IdProvider extends ProviderInterface {
  constructor() {
    super('IdProvider');
  }

  uuid() {
    return crypto.randomUUID();
  }

  generateTraceId() {
    return `trc_${crypto.randomUUID().replace(/-/g, '')}`;
  }

  generateCorrelationId() {
    return `corr_${crypto.randomUUID()}`;
  }

  generateTaskId() {
    return `task_${crypto.randomUUID().slice(0, 8)}`;
  }
}

module.exports = new IdProvider();
