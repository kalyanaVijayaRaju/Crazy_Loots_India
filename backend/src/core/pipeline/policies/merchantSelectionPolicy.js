const PolicyInterface = require('../interfaces/policy.interface');
const { merchantRegistry } = require('../../../merchants');

class MerchantSelectionPolicy extends PolicyInterface {
  constructor() {
    super('MerchantSelectionPolicy');
  }

  async evaluate(context) {
    const merchant = context.merchant;
    const isSupported = merchantRegistry.has(merchant);

    return {
      allowed: isSupported,
      merchant,
      isSupported,
    };
  }
}

module.exports = MerchantSelectionPolicy;
