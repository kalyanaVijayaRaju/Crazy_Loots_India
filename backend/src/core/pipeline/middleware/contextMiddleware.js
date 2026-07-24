const PipelineMiddleware = require('../interfaces/middleware.interface');
const idProvider = require('../providers/idProvider');

class ContextMiddleware extends PipelineMiddleware {
  constructor() {
    super('ContextMiddleware', 30);
  }

  async execute(context, next) {
    if (!context.traceId) {
      context.updateMetadata('traceId', idProvider.generateTraceId());
    }
    return next();
  }
}

module.exports = ContextMiddleware;
