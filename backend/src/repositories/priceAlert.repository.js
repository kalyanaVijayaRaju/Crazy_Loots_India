const BaseRepository = require('./base.repository');
const PriceAlert = require('../models/priceAlert.model');
const { PriceAlertStatus } = require('../constants/enums');

class PriceAlertRepository extends BaseRepository {
  constructor() {
    super(PriceAlert);
  }

  async findTriggerableAlerts(productId, currentPrice) {
    return this.findMany({
      product: productId,
      status: PriceAlertStatus.ACTIVE,
      targetPrice: { $gte: currentPrice },
    });
  }

  async findActiveAlertByProduct(productId) {
    return this.findOne({ product: productId, status: PriceAlertStatus.ACTIVE });
  }
}

module.exports = new PriceAlertRepository();
