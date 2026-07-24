/**
 * Standardized Merchant Health DTO Contract
 */
class MerchantHealthDTO {
  constructor({ merchant, status = 'HEALTHY', responseTime = 0, lastChecked = null }) {
    if (!merchant || typeof merchant !== 'string') {
      throw new Error('MerchantHealthDTO requires a valid merchant identifier string.');
    }

    this.merchant = merchant.toLowerCase().trim();
    this.status = status;
    this.responseTime = Number(responseTime) || 0; // Duration in milliseconds
    this.lastChecked = lastChecked ? new Date(lastChecked).toISOString() : new Date().toISOString();
  }

  static from(data) {
    return new MerchantHealthDTO(data);
  }
}

module.exports = MerchantHealthDTO;
