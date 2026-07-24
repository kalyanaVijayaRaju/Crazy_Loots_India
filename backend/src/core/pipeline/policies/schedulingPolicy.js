const PolicyInterface = require('../interfaces/policy.interface');

class SchedulingPolicy extends PolicyInterface {
  constructor(defaultIntervalMs = 60000) {
    super('SchedulingPolicy');
    this.defaultIntervalMs = defaultIntervalMs;
  }

  async evaluate(context) {
    const isFlashSale = (context.priority || 40) >= 100;
    const intervalMs = isFlashSale ? 10000 : this.defaultIntervalMs;

    return {
      allowed: true,
      nextScheduleMs: Date.now() + intervalMs,
      intervalMs,
    };
  }
}

module.exports = SchedulingPolicy;
