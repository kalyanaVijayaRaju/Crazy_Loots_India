const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const ProductDTO = require('../dto/product.dto');
const CouponDTO = require('../dto/coupon.dto');
const MerchantHealthDTO = require('../dto/merchantHealth.dto');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class FlipkartAdapter extends MerchantAdapter {
  constructor() {
    super('flipkart');
    this.domainRegex = /(?:flipkart\.com|fkrt\.it)/i;
  }

  validateProductUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }
    return this.domainRegex.test(url);
  }

  async searchProducts(query) {
    return [
      ProductDTO.from({
        merchant: this.name,
        productId: 'ITM1234567890',
        title: `Flipkart Sample: ${query}`,
        brand: 'Flipkart SmartBuy',
        image: 'https://rukminim1.flixcart.com/image/sample.jpg',
        productUrl: 'https://www.flipkart.com/p/itm1234567890',
        affiliateUrl: 'https://www.flipkart.com/p/itm1234567890?affid=crazyloots',
        currentPrice: 999,
        originalPrice: 1999,
        discountPercentage: 50,
        rating: 4.2,
        reviewCount: 3400,
        availability: 'IN_STOCK',
        currency: 'INR',
        category: 'Fashion',
        metadata: { fAssured: true },
      }),
    ];
  }

  async getProduct(productId) {
    const cleanId = productId || 'ITM1234567890';
    return ProductDTO.from({
      merchant: this.name,
      productId: cleanId,
      title: 'Flipkart SmartBuy Wireless Earbuds',
      brand: 'Flipkart SmartBuy',
      image: 'https://rukminim1.flixcart.com/image/832/832/earbuds-sample.jpg',
      productUrl: `https://www.flipkart.com/p/${cleanId}`,
      affiliateUrl: `https://www.flipkart.com/p/${cleanId}?affid=crazyloots`,
      currentPrice: 1299,
      originalPrice: 2999,
      discountPercentage: 56,
      rating: 4.3,
      reviewCount: 4120,
      availability: 'IN_STOCK',
      currency: 'INR',
      category: 'Audio',
      metadata: { fAssured: true, pid: cleanId },
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
        couponCode: 'FKLOOT100',
        description: 'Instant ₹100 Off on Flipkart Axis Bank Credit Card',
        discount: '₹100',
        minimumOrder: 1000,
        expiryDate: new Date(Date.now() + 86400000 * 5),
        status: 'ACTIVE',
      }),
    ];
  }

  async generateAffiliateLink(productUrl) {
    if (!this.validateProductUrl(productUrl)) {
      throw new InvalidProductUrlError(productUrl, this.name);
    }
    const affid = 'crazyloots';
    const separator = productUrl.includes('?') ? '&' : '?';
    return `${productUrl}${separator}affid=${affid}`;
  }

  async healthCheck() {
    return MerchantHealthDTO.from({
      merchant: this.name,
      status: 'HEALTHY',
      responseTime: 18,
      lastChecked: new Date(),
    });
  }
}

module.exports = FlipkartAdapter;
