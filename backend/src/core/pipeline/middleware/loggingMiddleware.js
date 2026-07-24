const PipelineMiddleware = require('../interfaces/middleware.interface');
const logger = require('../../../utils/logger');

class LoggingMiddleware extends PipelineMiddleware {
  constructor() {
    super('LoggingMiddleware', 40);
  }

  async execute(context, next) {
    const startTime = Date.now();
    logger.debug(`[Pipeline] Executing context [corr: ${context.correlationId}, merchant: ${context.merchant}]`);
    try {
      const result = await next();
      const duration = Date.now() - startTime;
      logger.debug(`[Pipeline] Finished context [corr: ${context.correlationId}] in ${duration}ms`);
      return result;
    } catch (err) {
      const duration = Date.now() - startTime;
      logger.error(`[Pipeline] Failed context [corr: ${context.correlationId}] in ${duration}ms: ${err.message}`);
      throw err;
    }
  }
}

module.exports = LoggingMiddleware;
