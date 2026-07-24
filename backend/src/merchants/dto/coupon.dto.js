/**
 * Standardized Coupon DTO Contract
 */
class CouponDTO {
  constructor({
    merchant,
    couponCode,
    description,
    discount = '',
    minimumOrder = 0,
    expiryDate = null,
    status = 'ACTIVE',
  }) {
    if (!merchant || typeof merchant !== 'string') {
      throw new Error('CouponDTO requires a valid merchant identifier string.');
    }
    if (!couponCode || typeof couponCode !== 'string') {
      throw new Error('CouponDTO requires a valid couponCode string.');
    }
    if (!description || typeof description !== 'string') {
      throw new Error('CouponDTO requires a valid description string.');
    }

    this.merchant = merchant.toLowerCase().trim();
    this.couponCode = couponCode.toUpperCase().trim();
    this.description = description.trim();
    this.discount = discount;
    this.minimumOrder = Number(minimumOrder) || 0;
    this.expiryDate = expiryDate ? new Date(expiryDate).toISOString() : null;
    this.status = status;
    this.timestamp = new Date().toISOString();
  }

  static from(data) {
    return new CouponDTO(data);
  }
}

module.exports = CouponDTO;
