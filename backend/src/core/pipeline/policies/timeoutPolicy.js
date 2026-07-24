const PolicyInterface = require('../interfaces/policy.interface');

class TimeoutPolicy extends PolicyInterface {
  constructor(timeoutMs = 30000) {
    super('TimeoutPolicy');
    this.timeoutMs = timeoutMs;
  }

  async evaluate(context) {
    const elapsed = Date.now() - new Date(context.createdAt).getTime();
    const isTimedOut = elapsed > this.timeoutMs;

    return {
      allowed: !isTimedOut,
      isTimedOut,
      elapsedMs: elapsed,
      timeoutMs: this.timeoutMs,
    };
  }
}

module.exports = TimeoutPolicy;
