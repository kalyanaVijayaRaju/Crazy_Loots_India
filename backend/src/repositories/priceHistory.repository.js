const BaseRepository = require('./base.repository');
const PriceHistory = require('../models/priceHistory.model');

class PriceHistoryRepository extends BaseRepository {
  constructor() {
    super(PriceHistory);
  }

  async recordPrice(productId, price, originalPrice, discountPercentage, currency = 'INR') {
    return this.create({
      product: productId,
      price,
      originalPrice,
      discountPercentage,
      currency,
      recordedAt: new Date(),
    });
  }

  async findHistoryByProduct(productId, limit = 30) {
    return this.findMany({ product: productId }, { sort: { recordedAt: -1 }, limit });
  }

  async findLowestPriceForProduct(productId) {
    const result = await this.findMany(
      { product: productId },
      { sort: { price: 1 }, limit: 1 }
    );
    return result.length > 0 ? result[0].price : null;
  }
}

module.exports = new PriceHistoryRepository();
