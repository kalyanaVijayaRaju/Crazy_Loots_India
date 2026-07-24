const PipelineMiddleware = require('../interfaces/middleware.interface');

class ValidationMiddleware extends PipelineMiddleware {
  constructor() {
    super('ValidationMiddleware', 100); // Highest priority
  }

  async execute(context, next) {
    if (!context || !context.merchant || !context.productId) {
      throw new Error('[ValidationMiddleware] Invalid context: missing merchant or productId.');
    }
    context.updateMetadata('validated', true);
    return next();
  }
}

module.exports = ValidationMiddleware;
