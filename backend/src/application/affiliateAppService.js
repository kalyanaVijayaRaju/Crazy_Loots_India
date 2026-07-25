const { affiliateManager, shortUrlManager } = require('../publishing');

/**
 * Affiliate Application Service
 * Manages link generation, provider registry, and status
 */
class AffiliateAppService {
  async generateAffiliateLink(data = {}) {
    const url = data.url || 'https://www.amazon.in/dp/B08N5WRWNW';
    const merchant = data.merchant || 'amazon';

    const affiliateLink = await affiliateManager.generateLink(url, merchant);
    const shortUrl = await shortUrlManager.shorten(affiliateLink);

    return {
      originalUrl: url,
      merchant,
      affiliateLink,
      shortUrl,
      generatedAt: new Date().toISOString(),
    };
  }

  async getProviders() {
    return {
      providers: [
        { name: 'amazon', active: true, tag: process.env.AMAZON_AFFILIATE_TAG || 'crazyloots-21' },
        { name: 'cuesinks', active: false },
        { name: 'earnly', active: false },
      ],
    };
  }

  async getStatus() {
    return {
      status: 'ACTIVE',
      activeProvider: 'amazon',
      tagConfigured: Boolean(process.env.AMAZON_AFFILIATE_TAG || 'crazyloots-21'),
      shortenerConfigured: true,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new AffiliateAppService();
