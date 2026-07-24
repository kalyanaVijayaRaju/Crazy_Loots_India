const PolicyInterface = require('../interfaces/policy.interface');
const { PriorityLevels } = require('../../priority/priority.constants');

class PriorityPolicy extends PolicyInterface {
  constructor() {
    super('PriorityPolicy');
  }

  async evaluate(context) {
    const rawPriority = context.priority || PriorityLevels.NORMAL;
    const isFlashSale = rawPriority >= PriorityLevels.FLASH_SALE;
    const isHighPriority = rawPriority >= PriorityLevels.HIGH;

    return {
      allowed: true,
      priority: rawPriority,
      isFlashSale,
      isHighPriority,
    };
  }
}

module.exports = PriorityPolicy;
