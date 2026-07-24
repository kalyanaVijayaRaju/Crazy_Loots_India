const PipelineMiddleware = require('../interfaces/middleware.interface');

class PolicyMiddleware extends PipelineMiddleware {
  constructor(policies = []) {
    super('PolicyMiddleware', 50);
    this.policies = policies;
  }

  addPolicy(policy) {
    this.policies.push(policy);
  }

  async execute(context, next) {
    for (const policy of this.policies) {
      const result = await policy.evaluate(context);
      if (!result.allowed) {
        throw new Error(`[PolicyMiddleware] Policy '${policy.name()}' rejected context evaluation.`);
      }
    }
    return next();
  }
}

module.exports = PolicyMiddleware;
