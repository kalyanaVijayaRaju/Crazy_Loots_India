const BaseRepository = require('./base.repository');
const Product = require('../models/product.model');
const { ProductStatus } = require('../constants/enums');

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async findByMerchantAndProductId(merchantId, productId) {
    return this.findOne({ merchant: merchantId, productId });
  }

  async findTrackableProducts(limit = 100) {
    return this.findMany(
      { trackingEnabled: true, status: ProductStatus.ACTIVE },
      { sort: { lastCheckedAt: 1 }, limit }
    );
  }

  async updatePriceAndDiscount(productId, currentPrice, originalPrice, discountPercentage) {
    return this.update(productId, {
      currentPrice,
      originalPrice,
      discountPercentage,
      lastCheckedAt: new Date(),
    });
  }
}

module.exports = new ProductRepository();
