const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class TataCliqAdapter extends MerchantAdapter {
  constructor() {
    super('tatacliq');
    this.domainRegex = /(?:tatacliq\.com)/i;
  }

  validateProductUrl(url) {
    return Boolean(url && typeof url === 'string' && this.domainRegex.test(url));
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'TATA4001',
        title: `Tata CLiQ Luxury: ${query}`,
        brand: 'Westside',
        image: 'https://assets.tatacliq.com/sample.jpg',
        productUrl: 'https://www.tatacliq.com/p/tata4001',
        affiliateUrl: 'https://www.tatacliq.com/p/tata4001?aff=crazyloots',
        currentPrice: 1299,
        originalPrice: 2599,
        discountPercentage: 50,
        rating: 4.3,
        reviewCount: 780,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Fashion',
      }),
    ];
  }

  async getProduct(productId) {
    return ProductDTO.from({
      merchant: this.name,
      productId: productId || 'TATA4001',
      title: 'Westside Men Casual Printed Shirt',
      brand: 'Westside',
      image: 'https://assets.tatacliq.com/shirt.jpg',
      productUrl: `https://www.tatacliq.com/p/${productId || 'TATA4001'}`,
      affiliateUrl: `https://www.tatacliq.com/p/${productId || 'TATA4001'}?aff=crazyloots`,
      currentPrice: 1499,
      originalPrice: 2999,
      discountPercentage: 50,
      rating: 4.4,
      reviewCount: 1120,
      availability: 'IN_STOCK',
      currency: 'INR',
      category: 'Clothing',
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
        couponCode: 'CLIQLUXE15',
        description: '15% OFF on Luxury Fashion Collection',
        discount: '15%',
        minimumOrder: 2999,
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
      responseTime: 19,
      lastChecked: new Date(),
    });
  }
}

module.exports = TataCliqAdapter;
