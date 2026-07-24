const ProductDTO = require('../../dto/product.dto');
const {
  PriceParser,
  RatingParser,
  ReviewParser,
  CurrencyParser,
  BrandParser,
  AvailabilityParser,
  ImageParser,
} = require('../parser/amazonParsers');
const amazonUrlNormalizer = require('../utils/amazonUrlNormalizer');

class AmazonProductMapper {
  /**
   * Map raw extracted DOM product to standardized ProductDTO
   * @param {Object} rawData - Raw DOM extraction result
   * @param {string} asin - 10-character Amazon ASIN
   * @returns {ProductDTO}
   */
  mapToDTO(rawData, asin) {
    const canonicalUrl = amazonUrlNormalizer.normalize(`https://www.amazon.in/dp/${asin}`);
    const currentPrice = PriceParser.parse(rawData.currentPrice);
    const originalPrice = PriceParser.parse(rawData.originalPrice) || currentPrice;
    const rating = RatingParser.parse(rawData.rating);
    const reviewCount = ReviewParser.parse(rawData.reviewCount);
    const brand = BrandParser.parse(rawData.brand);
    const availability = AvailabilityParser.parse(rawData.availability);
    const image = ImageParser.parse(rawData.image);
    const currency = CurrencyParser.parse(rawData.currentPrice);

    return ProductDTO.from({
      merchant: 'amazon',
      productId: asin,
      title: rawData.title || `Amazon Product (${asin})`,
      brand,
      image,
      productUrl: canonicalUrl,
      affiliateUrl: canonicalUrl,
      currentPrice,
      originalPrice,
      rating,
      reviewCount,
      availability,
      currency,
      category: rawData.breadcrumb || 'General',
      metadata: {
        asin,
        coupon: rawData.coupon || null,
        delivery: rawData.delivery || null,
        seller: rawData.seller || null,
      },
    });
  }
}

module.exports = new AmazonProductMapper();
