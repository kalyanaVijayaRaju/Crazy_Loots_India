const MerchantAdapter = require('../interfaces/merchantAdapter.interface');
const { MerchantNotSupportedError, InvalidMerchantError } = require('../errors/merchant.errors');

class MerchantRegistry {
  constructor() {
    this.adapters = new Map();
  }

  /**
   * Register a merchant adapter instance
   * @param {MerchantAdapter} adapter
   */
  register(adapter) {
    if (!(adapter instanceof MerchantAdapter)) {
      throw new InvalidMerchantError('Registered object must be an instance of MerchantAdapter interface.');
    }
    const name = adapter.getMerchantName();
    this.adapters.set(name, adapter);
  }

  /**
   * Fetch registered adapter by merchant name
   * @param {string} merchantName
   * @returns {MerchantAdapter}
   */
  get(merchantName) {
    if (!merchantName || typeof merchantName !== 'string') {
      throw new InvalidMerchantError('Merchant name must be a non-empty string.');
    }
    const key = merchantName.toLowerCase().trim();
    const adapter = this.adapters.get(key);
    if (!adapter) {
      throw new MerchantNotSupportedError(merchantName);
    }
    return adapter;
  }

  /**
   * Check if merchant adapter is registered
   * @param {string} merchantName
   * @returns {boolean}
   */
  has(merchantName) {
    if (!merchantName || typeof merchantName !== 'string') {
      return false;
    }
    return this.adapters.has(merchantName.toLowerCase().trim());
  }

  /**
   * List names of all supported registered merchants
   * @returns {Array<string>}
   */
  listSupported() {
    return Array.from(this.adapters.keys());
  }

  /**
   * Validate if merchant is registered or throw error
   * @param {string} merchantName
   */
  validate(merchantName) {
    if (!this.has(merchantName)) {
      throw new MerchantNotSupportedError(merchantName);
    }
    return true;
  }
}

module.exports = new MerchantRegistry();
