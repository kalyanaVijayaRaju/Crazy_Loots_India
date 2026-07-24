const PolicyInterface = require('../interfaces/policy.interface');
const queueManager = require('../../queue/queueManager');

class DuplicatePolicy extends PolicyInterface {
  constructor() {
    super('DuplicatePolicy');
  }

  async evaluate(context) {
    const queueName = context.metadata?.queueName || 'monitoring';
    const itemId = context.productId || context.correlationId;

    const queue = queueManager.getQueue(queueName);
    const isDuplicate = await queue.contains(itemId);

    return {
      allowed: !isDuplicate,
      isDuplicate,
      itemId,
    };
  }
}

module.exports = DuplicatePolicy;
