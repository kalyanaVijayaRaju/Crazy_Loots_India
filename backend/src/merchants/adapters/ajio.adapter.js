const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class AjioAdapter extends MerchantAdapter {
  constructor() {
    super('ajio');
    this.domainRegex = /(?:ajio\.com)/i;
  }

  validateProductUrl(url) {
    return Boolean(url && typeof url === 'string' && this.domainRegex.test(url));
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'AJIO101',
        title: `Ajio Style: ${query}`,
        brand: 'Netplay',
        image: 'https://assets.ajio.com/sample.jpg',
        productUrl: 'https://www.ajio.com/p/ajio101',
        affiliateUrl: 'https://www.ajio.com/p/ajio101?aff=crazyloots',
        currentPrice: 699,
        originalPrice: 1499,
        discountPercentage: 53,
        rating: 4.0,
        reviewCount: 450,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Fashion',
      }),
    ];
  }

  async getProduct(productId) {
    return ProductDTO.from({
      merchant: this.name,
      productId: productId || 'AJIO101',
      title: 'Netplay Men Slim Fit Polo T-Shirt',
      brand: 'Netplay',
      image: 'https://assets.ajio.com/polo.jpg',
      productUrl: `https://www.ajio.com/p/${productId || 'AJIO101'}`,
      affiliateUrl: `https://www.ajio.com/p/${productId || 'AJIO101'}?aff=crazyloots`,
      currentPrice: 799,
      originalPrice: 1799,
      discountPercentage: 56,
      rating: 4.2,
      reviewCount: 920,
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
        couponCode: 'AJIOFIRST',
        description: 'Extra ₹300 OFF on First Order',
        discount: '₹300',
        minimumOrder: 1299,
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
      responseTime: 22,
      lastChecked: new Date(),
    });
  }
}

module.exports = AjioAdapter;
