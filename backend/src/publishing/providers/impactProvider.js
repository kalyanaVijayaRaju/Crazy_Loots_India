const AffiliateProviderInterface = require('../affiliate/affiliateProvider.interface');

class ImpactProvider extends AffiliateProviderInterface {
  constructor() {
    super('impact');
  }

  async generateAffiliateLink(productUrl, _merchant) {
    return `https://impact.com/link?url=${encodeURIComponent(productUrl)}`;
  }

  async validateAffiliateLink(affiliateUrl) {
    return Boolean(affiliateUrl && affiliateUrl.includes('impact'));
  }

  async healthCheck() {
    return { status: 'HEALTHY', provider: this.name };
  }

  supportsMerchant(_merchant) {
    return true;
  }
}

module.exports = ImpactProvider;
