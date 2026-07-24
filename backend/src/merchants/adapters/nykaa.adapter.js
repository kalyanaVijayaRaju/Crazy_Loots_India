const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class NykaaAdapter extends MerchantAdapter {
  constructor() {
    super('nykaa');
    this.domainRegex = /(?:nykaa\.com)/i;
  }

  validateProductUrl(url) {
    return Boolean(url && typeof url === 'string' && this.domainRegex.test(url));
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'NYK3001',
        title: `Nykaa Beauty: ${query}`,
        brand: 'Nykaa Cosmetics',
        image: 'https://images-static.nykaa.com/sample.jpg',
        productUrl: 'https://www.nykaa.com/p/nyk3001',
        affiliateUrl: 'https://www.nykaa.com/p/nyk3001?aff=crazyloots',
        currentPrice: 499,
        originalPrice: 899,
        discountPercentage: 44,
        rating: 4.5,
        reviewCount: 2200,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Beauty & Personal Care',
      }),
    ];
  }

  async getProduct(productId) {
    return ProductDTO.from({
      merchant: this.name,
      productId: productId || 'NYK3001',
      title: 'Nykaa Matte to Last Liquid Lipstick',
      brand: 'Nykaa Cosmetics',
      image: 'https://images-static.nykaa.com/lipstick.jpg',
      productUrl: `https://www.nykaa.com/p/${productId || 'NYK3001'}`,
      affiliateUrl: `https://www.nykaa.com/p/${productId || 'NYK3001'}?aff=crazyloots`,
      currentPrice: 549,
      originalPrice: 999,
      discountPercentage: 45,
      rating: 4.6,
      reviewCount: 3400,
      availability: 'IN_STOCK',
      currency: 'INR',
      category: 'Makeup',
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
        couponCode: 'NYKAA10',
        description: '10% OFF on Orders Above ₹999',
        discount: '10%',
        minimumOrder: 999,
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
      responseTime: 14,
      lastChecked: new Date(),
    });
  }
}

module.exports = NykaaAdapter;
