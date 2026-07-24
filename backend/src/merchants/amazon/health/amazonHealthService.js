const AmazonSelectors = require('../selectors/amazon.selectors');

class AmazonHealthService {
  async healthCheck() {
    const selectorCount = Object.keys(AmazonSelectors).length;
    const hasTitleSelectors = AmazonSelectors.title.length > 0;
    const hasPriceSelectors = AmazonSelectors.currentPrice.length > 0;

    const healthy = hasTitleSelectors && hasPriceSelectors;

    return {
      status: healthy ? 'HEALTHY' : 'DEGRADED',
      merchant: 'amazon',
      selectorHealth: {
        totalConfigured: selectorCount,
        titleFallbackCount: AmazonSelectors.title.length,
        priceFallbackCount: AmazonSelectors.currentPrice.length,
      },
    };
  }
}

module.exports = new AmazonHealthService();
