const AffiliateProviderInterface = require('../affiliate/affiliateProvider.interface');

class AmazonAssociatesProvider extends AffiliateProviderInterface {
  constructor(tag = 'crazylootsin-21') {
    super('amazon_associates');
    this.tag = tag;
  }

  async generateAffiliateLink(productUrl, _merchant) {
    if (!productUrl || typeof productUrl !== 'string') {
      throw new Error('AmazonAssociatesProvider: productUrl must be a string.');
    }
    const cleanUrl = productUrl.split('?')[0];
    return `${cleanUrl}?tag=${this.tag}`;
  }

  async validateAffiliateLink(affiliateUrl) {
    if (!affiliateUrl || typeof affiliateUrl !== 'string') {
      return false;
    }
    return affiliateUrl.includes(`tag=${this.tag}`);
  }

  async healthCheck() {
    return { status: 'HEALTHY', provider: this.name, tagConfigured: Boolean(this.tag) };
  }

  supportsMerchant(merchant) {
    return String(merchant).toLowerCase() === 'amazon';
  }
}

module.exports = AmazonAssociatesProvider;
