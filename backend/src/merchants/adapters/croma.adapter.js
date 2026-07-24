const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class CromaAdapter extends MerchantAdapter {
  constructor() {
    super('croma');
    this.domainRegex = /(?:croma\.com)/i;
  }

  validateProductUrl(url) {
    return Boolean(url && typeof url === 'string' && this.domainRegex.test(url));
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'CROMA2001',
        title: `Croma Electronics: ${query}`,
        brand: 'Croma',
        image: 'https://media.croma.com/sample.jpg',
        productUrl: 'https://www.croma.com/p/croma2001',
        affiliateUrl: 'https://www.croma.com/p/croma2001?aff=crazyloots',
        currentPrice: 1999,
        originalPrice: 3999,
        discountPercentage: 50,
        rating: 4.2,
        reviewCount: 650,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Electronics',
      }),
    ];
  }

  async getProduct(productId) {
    return ProductDTO.from({
      merchant: this.name,
      productId: productId || 'CROMA2001',
      title: 'Croma 10000mAh Power Bank with Fast Charging',
      brand: 'Croma',
      image: 'https://media.croma.com/powerbank.jpg',
      productUrl: `https://www.croma.com/p/${productId || 'CROMA2001'}`,
      affiliateUrl: `https://www.croma.com/p/${productId || 'CROMA2001'}?aff=crazyloots`,
      currentPrice: 999,
      originalPrice: 1999,
      discountPercentage: 50,
      rating: 4.4,
      reviewCount: 1400,
      availability: 'IN_STOCK',
      currency: 'INR',
      category: 'Mobile Accessories',
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
        couponCode: 'CROMA5P',
        description: '5% Instant Discount on Tata Neu HDFC Cards',
        discount: '5%',
        minimumOrder: 2000,
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
      responseTime: 16,
      lastChecked: new Date(),
    });
  }
}

module.exports = CromaAdapter;
