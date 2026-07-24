const AmazonSelectors = require('../selectors/amazon.selectors');
const domService = require('../../../browser/dom/domService');
const logger = require('../../../utils/logger');

class AmazonDomExtractor {
  /**
   * Extract raw DOM properties using fallback selector chains
   * @param {Object} page - Playwright page instance
   * @returns {Promise<Object>} RawAmazonProduct object
   */
  async extractRaw(page) {
    logger.debug('[AmazonDomExtractor] Starting raw DOM extraction');

    const extractField = async (selectorList) => {
      for (const sel of selectorList) {
        if (await domService.exists(page, sel)) {
          const val = await domService.text(page, sel);
          if (val && val.trim().length > 0) {
            return val.trim();
          }
        }
      }
      return '';
    };

    const extractAttribute = async (selectorList, attrName) => {
      for (const sel of selectorList) {
        if (await domService.exists(page, sel)) {
          const val = await domService.attribute(page, sel, attrName);
          if (val && val.trim().length > 0) {
            return val.trim();
          }
        }
      }
      return '';
    };

    const title = await extractField(AmazonSelectors.title);
    const currentPrice = await extractField(AmazonSelectors.currentPrice);
    const originalPrice = await extractField(AmazonSelectors.originalPrice);
    const rating = await extractField(AmazonSelectors.rating);
    const reviewCount = await extractField(AmazonSelectors.reviewCount);
    const brand = await extractField(AmazonSelectors.brand);
    const availability = await extractField(AmazonSelectors.availability);
    const image = await extractAttribute(AmazonSelectors.images, 'src');
    const description = await extractField(AmazonSelectors.description);
    const breadcrumb = await extractField(AmazonSelectors.breadcrumb);
    const coupon = await extractField(AmazonSelectors.coupon);
    const delivery = await extractField(AmazonSelectors.delivery);
    const seller = await extractField(AmazonSelectors.seller);

    return {
      title,
      currentPrice,
      originalPrice,
      rating,
      reviewCount,
      brand,
      availability,
      image,
      description,
      breadcrumb,
      coupon,
      delivery,
      seller,
    };
  }
}

module.exports = new AmazonDomExtractor();
