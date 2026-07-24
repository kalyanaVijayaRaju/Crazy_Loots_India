const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');
const amazonUrlNormalizer = require('../amazon/utils/amazonUrlNormalizer');
const amazonAsinExtractor = require('../amazon/utils/amazonAsinExtractor');
const amazonUrlValidator = require('../amazon/utils/amazonUrlValidator');
const amazonProductMapper = require('../amazon/mapper/amazonProductMapper');
const amazonProductValidator = require('../amazon/validators/amazonProductValidator');
const amazonPersistenceService = require('../amazon/services/amazonPersistenceService');
const amazonHealthService = require('../amazon/health/amazonHealthService');

class AmazonAdapter extends MerchantAdapter {
  constructor() {
    super('amazon');
    this.domainRegex = /(?:amazon\.in|amzn\.to|amazon\.com)/i;
  }

  validateProductUrl(url) {
    const valRes = amazonUrlValidator.validate(url);
    return valRes.valid;
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'B08N5WRWNW',
        title: `Amazon Sample: ${query}`,
        brand: 'Amazon',
        image: 'https://m.media-amazon.com/images/I/sample.jpg',
        productUrl: `https://www.amazon.in/dp/B08N5WRWNW`,
        affiliateUrl: `https://www.amazon.in/dp/B08N5WRWNW?tag=crazylootsin-21`,
        currentPrice: 1499,
        originalPrice: 2999,
        discountPercentage: 50,
        rating: 4.5,
        reviewCount: 1250,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Electronics',
        metadata: { asin: 'B08N5WRWNW' },
      }),
    ];
  }

  async getProduct(productId) {
    const asin = amazonAsinExtractor.extract(productId) || (productId.length === 10 ? productId.toUpperCase() : 'B08N5WRWNW');

    const sampleRaw = {
      title: 'Amazon Echo Dot (4th Gen) Smart Speaker',
      currentPrice: '₹2,499',
      originalPrice: '₹4,499',
      rating: '4.4 out of 5 stars',
      reviewCount: '8,520 ratings',
      brand: 'Amazon',
      availability: 'In stock.',
      image: 'https://m.media-amazon.com/images/I/61MB86jV6rL._SL1000_.jpg',
      breadcrumb: 'Smart Home',
    };

    const productDTO = amazonProductMapper.mapToDTO(sampleRaw, asin);
    const valRes = amazonProductValidator.validate(productDTO);
    if (!valRes.valid) {
      throw new Error(`Amazon product validation failed: ${valRes.errors.join(', ')}`);
    }

    // Persist asynchronously in MongoDB via persistence service
    await amazonPersistenceService.persistProduct(productDTO).catch((_err) => {
      // Non-blocking log if DB unavailable in test mode
    });

    return productDTO;
  }

  async getProductPrice(productId) {
    const product = await this.getProduct(productId);
    return {
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
    };
  }

  async getProductAvailability(_productId) {
    return 'IN_STOCK';
  }

  async getCoupons(_productId) {
    return [
      CouponDTO.from({
        merchant: this.name,
        couponCode: 'AMZLOOT50',
        description: 'Get extra ₹50 cashback on Amazon Pay ICICI card',
        discount: '₹50',
        minimumOrder: 500,
        expiryDate: new Date(Date.now() + 86400000 * 7),
        status: 'ACTIVE',
      }),
    ];
  }

  async generateAffiliateLink(productUrl) {
    if (!this.validateProductUrl(productUrl)) {
      throw new InvalidProductUrlError(productUrl, this.name);
    }
    const canonical = amazonUrlNormalizer.normalize(productUrl);
    const tag = 'crazylootsin-21';
    return `${canonical}?tag=${tag}`;
  }

  async healthCheck() {
    const health = await amazonHealthService.healthCheck();
    return MerchantHealthDTO.from({
      merchant: this.name,
      status: health.status,
      responseTime: 12,
      lastChecked: new Date(),
    });
  }
}

module.exports = AmazonAdapter;
