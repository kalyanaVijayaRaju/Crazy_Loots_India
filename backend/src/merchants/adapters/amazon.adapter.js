const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class AmazonAdapter extends MerchantAdapter {
  constructor() {
    super('amazon');
    this.domainRegex = /(?:amazon\.in|amzn\.to|amazon\.com)/i;
    this.asinRegex = /(?:dp|gp\/product)\/([A-Z0-9]{10})/i;
  }

  validateProductUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }
    return this.domainRegex.test(url);
  }

  async searchProducts(query) {
    // Placeholder DTO list for Amazon search
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'B08N5WRWNW',
        title: `Amazon Sample: ${query}`,
        brand: 'Amazon Brand',
        image: 'https://m.media-amazon.com/images/I/ sample.jpg',
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
        metadata: { asin: 'B08N5WRWNW', isPrime: true },
      }),
    ];
  }

  async getProduct(productId) {
    const cleanId = productId || 'B08N5WRWNW';
    return ProductDTO.from({
      merchant: this.name,
      productId: cleanId,
      title: 'Amazon Echo Dot (4th Gen) Smart Speaker',
      brand: 'Amazon',
      image: 'https://m.media-amazon.com/images/I/61MB86jV6rL._SL1000_.jpg',
      productUrl: `https://www.amazon.in/dp/${cleanId}`,
      affiliateUrl: `https://www.amazon.in/dp/${cleanId}?tag=crazylootsin-21`,
      currentPrice: 2499,
      originalPrice: 4499,
      discountPercentage: 44,
      rating: 4.4,
      reviewCount: 8520,
      availability: 'IN_STOCK',
      currency: 'INR',
      category: 'Smart Home',
      metadata: { asin: cleanId, isFulfilledByAmazon: true },
    });
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
    const tag = 'crazylootsin-21';
    const separator = productUrl.includes('?') ? '&' : '?';
    return `${productUrl}${separator}tag=${tag}`;
  }

  async healthCheck() {
    return MerchantHealthDTO.from({
      merchant: this.name,
      status: 'HEALTHY',
      responseTime: 12,
      lastChecked: new Date(),
    });
  }
}

module.exports = AmazonAdapter;
