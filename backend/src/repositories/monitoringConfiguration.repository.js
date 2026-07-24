const BaseRepository = require('./base.repository');
const MonitoringConfiguration = require('../models/monitoringConfiguration.model');

class MonitoringConfigurationRepository extends BaseRepository {
  constructor() {
    super(MonitoringConfiguration);
  }

  async findDueConfigurations(limit = 50) {
    const now = new Date();
    return this.model
      .find({ enabled: true, nextRun: { $lte: now } })
      .sort({ priority: -1, nextRun: 1 })
      .limit(limit);
  }

  async findByProduct(productId) {
    return this.findOne({ product: productId });
  }
}

module.exports = new MonitoringConfigurationRepository();
