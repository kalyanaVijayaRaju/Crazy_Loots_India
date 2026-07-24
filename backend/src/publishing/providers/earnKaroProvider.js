const AffiliateProviderInterface = require('../affiliate/affiliateProvider.interface');

class EarnKaroProvider extends AffiliateProviderInterface {
  constructor() {
    super('earnkaro');
  }

  async generateAffiliateLink(productUrl, _merchant) {
    return `https://earnkaro.com/sharedeal?url=${encodeURIComponent(productUrl)}`;
  }

  async validateAffiliateLink(affiliateUrl) {
    return Boolean(affiliateUrl && affiliateUrl.includes('earnkaro'));
  }

  async healthCheck() {
    return { status: 'HEALTHY', provider: this.name };
  }

  supportsMerchant(_merchant) {
    return true;
  }
}

module.exports = EarnKaroProvider;
