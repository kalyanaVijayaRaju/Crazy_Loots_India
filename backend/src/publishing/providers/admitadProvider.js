const AffiliateProviderInterface = require('../affiliate/affiliateProvider.interface');

class AdmitadProvider extends AffiliateProviderInterface {
  constructor() {
    super('admitad');
  }

  async generateAffiliateLink(productUrl, _merchant) {
    return `https://ad.admitad.com/g/mocklink/?subid=crazyloots&url=${encodeURIComponent(productUrl)}`;
  }

  async validateAffiliateLink(affiliateUrl) {
    return Boolean(affiliateUrl && affiliateUrl.includes('admitad'));
  }

  async healthCheck() {
    return { status: 'HEALTHY', provider: this.name };
  }

  supportsMerchant(_merchant) {
    return true;
  }
}

module.exports = AdmitadProvider;
