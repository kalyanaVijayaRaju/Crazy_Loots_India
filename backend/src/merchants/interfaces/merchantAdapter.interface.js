const MerchantHealthDTO = require('../dto/merchantHealth.dto');

/**
 * Base MerchantAdapter Interface / Abstract Class
 * Every e-commerce platform adapter MUST extend this class and implement its contracts.
 */
class MerchantAdapter {
  constructor(name) {
    if (this.constructor === MerchantAdapter) {
      throw new Error('MerchantAdapter is an abstract interface and cannot be instantiated directly.');
    }
    this.name = name ? name.toLowerCase().trim() : 'unknown';
  }

  /**
   * Return merchant canonical identifier name (e.g., 'amazon', 'flipkart')
   * @returns {string}
   */
  getMerchantName() {
    return this.name;
  }

  /**
   * Search products on the merchant platform
   * @param {string} _query - Search term
   * @returns {Promise<Array<ProductDTO>>}
   */
  async searchProducts(_query) {
    throw new Error(`Method 'searchProducts()' must be implemented by ${this.constructor.name}.`);
  }

  /**
   * Fetch full product details by Product ID
   * @param {string} _productId
   * @returns {Promise<ProductDTO>}
   */
  async getProduct(_productId) {
    throw new Error(`Method 'getProduct()' must be implemented by ${this.constructor.name}.`);
  }

  /**
   * Fetch live product price
   * @param {string} _productId
   * @returns {Promise<{ currentPrice: number, originalPrice: number, discountPercentage: number }>}
   */
  async getProductPrice(_productId) {
    throw new Error(`Method 'getProductPrice()' must be implemented by ${this.constructor.name}.`);
  }

  /**
   * Fetch product stock availability
   * @param {string} _productId
   * @returns {Promise<string>} 'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER'
   */
  async getProductAvailability(_productId) {
    throw new Error(`Method 'getProductAvailability()' must be implemented by ${this.constructor.name}.`);
  }

  /**
   * Fetch coupons for product or merchant
   * @param {string} [_productId]
   * @returns {Promise<Array<CouponDTO>>}
   */
  async getCoupons(_productId) {
    throw new Error(`Method 'getCoupons()' must be implemented by ${this.constructor.name}.`);
  }

  /**
   * Transform raw product URL into affiliate tracking link
   * @param {string} _productUrl
   * @returns {Promise<string>}
   */
  async generateAffiliateLink(_productUrl) {
    throw new Error(`Method 'generateAffiliateLink()' must be implemented by ${this.constructor.name}.`);
  }

  /**
   * Validate if a URL belongs to this merchant
   * @param {string} _url
   * @returns {boolean}
   */
  validateProductUrl(_url) {
    throw new Error(`Method 'validateProductUrl()' must be implemented by ${this.constructor.name}.`);
  }

  /**
   * Perform health check on merchant connection/scraper endpoint
   * @returns {Promise<MerchantHealthDTO>}
   */
  async healthCheck() {
    return MerchantHealthDTO.from({
      merchant: this.name,
      status: 'HEALTHY',
      responseTime: 0,
      lastChecked: new Date(),
    });
  }
}

module.exports = MerchantAdapter;
