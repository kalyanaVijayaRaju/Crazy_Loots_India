const PipelineMiddleware = require('../interfaces/middleware.interface');
const { merchantRegistry } = require('../../../merchants');

class MerchantResolutionMiddleware extends PipelineMiddleware {
  constructor() {
    super('MerchantResolutionMiddleware', 70);
  }

  async execute(context, next) {
    const merchant = context.merchant;
    const adapter = merchantRegistry.get(merchant);
    context.updateMetadata('resolvedAdapter', adapter.getMerchantName());
    return next();
  }
}

module.exports = MerchantResolutionMiddleware;
