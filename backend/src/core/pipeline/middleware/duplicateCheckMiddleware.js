const PipelineMiddleware = require('../interfaces/middleware.interface');
const DuplicatePolicy = require('../policies/duplicatePolicy');

class DuplicateCheckMiddleware extends PipelineMiddleware {
  constructor() {
    super('DuplicateCheckMiddleware', 80);
    this.duplicatePolicy = new DuplicatePolicy();
  }

  async execute(context, next) {
    const res = await this.duplicatePolicy.evaluate(context);
    if (!res.allowed) {
      context.updateMetadata('rejectedDuplicate', true);
      throw new Error(`[DuplicateCheckMiddleware] Duplicate request rejected for item '${res.itemId}'`);
    }
    return next();
  }
}

module.exports = DuplicateCheckMiddleware;
