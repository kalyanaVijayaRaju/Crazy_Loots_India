const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class MeeshoAdapter extends MerchantAdapter {
  constructor() {
    super('meesho');
    this.domainRegex = /(?:meesho\.com)/i;
  }

  validateProductUrl(url) {
    return Boolean(url && typeof url === 'string' && this.domainRegex.test(url));
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'MEESH001',
        title: `Meesho Deal: ${query}`,
        brand: 'Meesho Choice',
        image: 'https://images.meesho.com/sample.jpg',
        productUrl: 'https://www.meesho.com/s/p/meesh001',
        affiliateUrl: 'https://www.meesho.com/s/p/meesh001?aff=crazyloots',
        currentPrice: 299,
        originalPrice: 799,
        discountPercentage: 62,
        rating: 3.9,
        reviewCount: 520,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Home & Kitchen',
      }),
    ];
  }

  async getProduct(productId) {
    return ProductDTO.from({
      merchant: this.name,
      productId: productId || 'MEESH001',
      title: 'Meesho Smart Kitchen Gadget Set',
      brand: 'Meesho Choice',
      image: 'https://images.meesho.com/kitchen.jpg',
      productUrl: `https://www.meesho.com/s/p/${productId || 'MEESH001'}`,
      affiliateUrl: `https://www.meesho.com/s/p/${productId || 'MEESH001'}?aff=crazyloots`,
      currentPrice: 349,
      originalPrice: 899,
      discountPercentage: 61,
      rating: 4.0,
      reviewCount: 880,
      availability: 'IN_STOCK',
      currency: 'INR',
      category: 'Home & Kitchen',
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
        couponCode: 'MEESHO50',
        description: 'Flat ₹50 OFF on orders above ₹200',
        discount: '₹50',
        minimumOrder: 200,
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
      responseTime: 25,
      lastChecked: new Date(),
    });
  }
}

module.exports = MeeshoAdapter;
