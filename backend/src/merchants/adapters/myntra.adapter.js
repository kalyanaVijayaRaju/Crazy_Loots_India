const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class MyntraAdapter extends MerchantAdapter {
  constructor() {
    super('myntra');
    this.domainRegex = /(?:myntra\.com)/i;
  }

  validateProductUrl(url) {
    return Boolean(url && typeof url === 'string' && this.domainRegex.test(url));
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'MYN10001',
        title: `Myntra Fashion: ${query}`,
        brand: 'Roadster',
        image: 'https://assets.myntassets.com/sample.jpg',
        productUrl: 'https://www.myntra.com/p/myn10001',
        affiliateUrl: 'https://www.myntra.com/p/myn10001?aff=crazyloots',
        currentPrice: 799,
        originalPrice: 1599,
        discountPercentage: 50,
        rating: 4.1,
        reviewCount: 1100,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Fashion',
      }),
    ];
  }

  async getProduct(productId) {
    return ProductDTO.from({
      merchant: this.name,
      productId: productId || 'MYN10001',
      title: 'Roadster Men Cotton Casual Shirt',
      brand: 'Roadster',
      image: 'https://assets.myntassets.com/shirt.jpg',
      productUrl: `https://www.myntra.com/p/${productId || 'MYN10001'}`,
      affiliateUrl: `https://www.myntra.com/p/${productId || 'MYN10001'}?aff=crazyloots`,
      currentPrice: 899,
      originalPrice: 1999,
      discountPercentage: 55,
      rating: 4.3,
      reviewCount: 1900,
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
        couponCode: 'MYNTRA15',
        description: 'Extra 15% OFF on Myntra Fashion Products',
        discount: '15%',
        minimumOrder: 1499,
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
      responseTime: 15,
      lastChecked: new Date(),
    });
  }
}

module.exports = MyntraAdapter;
