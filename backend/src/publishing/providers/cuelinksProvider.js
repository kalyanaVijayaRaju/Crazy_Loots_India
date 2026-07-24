const AffiliateProviderInterface = require('../affiliate/affiliateProvider.interface');

class CuelinksProvider extends AffiliateProviderInterface {
  constructor() {
    super('cuelinks');
  }

  async generateAffiliateLink(productUrl, _merchant) {
    return `https://links.cuelinks.com/deep_link?url=${encodeURIComponent(productUrl)}`;
  }

  async validateAffiliateLink(affiliateUrl) {
    return Boolean(affiliateUrl && affiliateUrl.includes('cuelinks'));
  }

  async healthCheck() {
    return { status: 'HEALTHY', provider: this.name };
  }

  supportsMerchant(_merchant) {
    return true;
  }
}

module.exports = CuelinksProvider;
