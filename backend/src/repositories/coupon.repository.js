const BaseRepository = require('./base.repository');
const Coupon = require('../models/coupon.model');
const { CouponStatus } = require('../constants/enums');

class CouponRepository extends BaseRepository {
  constructor() {
    super(Coupon);
  }

  async findByMerchant(merchantId) {
    return this.findMany({ merchant: merchantId, status: CouponStatus.ACTIVE });
  }

  async findActiveCoupons() {
    return this.findMany({ status: CouponStatus.ACTIVE }, { sort: { expiryDate: 1 } });
  }
}

module.exports = new CouponRepository();
