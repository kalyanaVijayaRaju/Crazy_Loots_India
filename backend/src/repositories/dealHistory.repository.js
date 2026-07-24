const BaseRepository = require('./base.repository');
const DealHistory = require('../models/dealHistory.model');

class DealHistoryRepository extends BaseRepository {
  constructor() {
    super(DealHistory);
  }

  async recordDetectedDeal(dealHistoryData) {
    return this.create({
      ...dealHistoryData,
      detectedAt: new Date(),
    });
  }

  async findHistoryByProduct(productId, limit = 20) {
    return this.findMany({ product: productId }, { sort: { detectedAt: -1 }, limit });
  }
}

module.exports = new DealHistoryRepository();
