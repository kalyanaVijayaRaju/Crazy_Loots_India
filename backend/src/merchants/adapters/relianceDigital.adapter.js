const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class RelianceDigitalAdapter extends MerchantAdapter {
  constructor() {
    super('reliancedigital');
    this.domainRegex = /(?:reliancedigital\.in)/i;
  }

  validateProductUrl(url) {
    return Boolean(url && typeof url === 'string' && this.domainRegex.test(url));
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'RD10001',
        title: `Reliance Digital: ${query}`,
        brand: 'Reconnect',
        image: 'https://www.reliancedigital.in/sample.jpg',
        productUrl: 'https://www.reliancedigital.in/p/rd10001',
        affiliateUrl: 'https://www.reliancedigital.in/p/rd10001?aff=crazyloots',
        currentPrice: 8990,
        originalPrice: 15990,
        discountPercentage: 43,
        rating: 4.3,
        reviewCount: 310,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Electronics',
      }),
    ];
  }

  async getProduct(productId) {
    return ProductDTO.from({
      merchant: this.name,
      productId: productId || 'RD10001',
      title: 'Reconnect 32 Inch HD Ready LED TV',
      brand: 'Reconnect',
      image: 'https://www.reliancedigital.in/tv.jpg',
      productUrl: `https://www.reliancedigital.in/p/${productId || 'RD10001'}`,
      affiliateUrl: `https://www.reliancedigital.in/p/${productId || 'RD10001'}?aff=crazyloots`,
      currentPrice: 9990,
      originalPrice: 17990,
      discountPercentage: 44,
      rating: 4.4,
      reviewCount: 450,
      availability: 'IN_STOCK',
      currency: 'INR',
      category: 'Televisions',
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
        couponCode: 'RELIANCE500',
        description: 'Instant ₹500 OFF on Bank Credit Cards',
        discount: '₹500',
        minimumOrder: 5000,
        status: 'ACTIVE',
      }),
    ];
  }

  async generateAffiliateLink(productUrl) {
    if (!this.validateProductUrl(productUrl)) {
      throw new InvalidProductUrlError(productUrl, this.name);
    }
    return `${productUrl}?aff=crazyloots`;
  }

  async healthCheck() {
    return MerchantHealthDTO.from({
      merchant: this.name,
      status: 'HEALTHY',
      responseTime: 20,
      lastChecked: new Date(),
    });
  }
}

module.exports = RelianceDigitalAdapter;
