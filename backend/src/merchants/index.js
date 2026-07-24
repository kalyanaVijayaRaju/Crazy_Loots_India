const merchantFactory = require('./factory/merchant.factory');
const merchantRegistry = require('./registry/merchant.registry');
const MerchantAdapter = require('./interfaces/merchantAdapter.interface');

const ProductDTO = require('./dto/product.dto');
const CouponDTO = require('./dto/coupon.dto');
const MerchantHealthDTO = require('./dto/merchantHealth.dto');

const merchantErrors = require('./errors/merchant.errors');
const merchantValidators = require('./validators/merchant.validator');

module.exports = {
  merchantFactory,
  merchantRegistry,
  MerchantAdapter,
  ProductDTO,
  CouponDTO,
  MerchantHealthDTO,
  ...merchantErrors,
  ...merchantValidators,
};
