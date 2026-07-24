const BaseRepository = require('./base.repository');
const MonitoringRun = require('../models/monitoringRun.model');

class MonitoringRunRepository extends BaseRepository {
  constructor() {
    super(MonitoringRun);
  }

  async findRecentRunsForProduct(productId, limit = 10) {
    return this.model
      .find({ product: productId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = new MonitoringRunRepository();
