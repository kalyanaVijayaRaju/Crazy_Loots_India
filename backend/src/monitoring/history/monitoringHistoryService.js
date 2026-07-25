const { monitoringRunRepository } = require('../../repositories');
const logger = require('../../utils/logger');

class MonitoringHistoryService {
  /**
   * Record a completed monitoring run
   * @param {Object} runData
   * @returns {Promise<Object>} Persisted MonitoringRun document
   */
  async recordRun(runData) {
    logger.debug(`[MonitoringHistoryService] Recording monitoring run for product '${runData.product}'`);
    const mongoose = require('mongoose');

    if (mongoose.connection.readyState === 1) {
      let productObjId = runData.product;
      if (!productObjId || !mongoose.Types.ObjectId.isValid(productObjId)) {
        productObjId = new mongoose.Types.ObjectId();
      }

      return monitoringRunRepository.create({
        product: productObjId,
        merchant: runData.merchant || 'amazon',
        status: runData.status || 'COMPLETED',
        startedAt: runData.startedAt || new Date(),
        completedAt: runData.completedAt || new Date(),
        duration: runData.duration || 0,
        priceChanged: runData.priceChanged || false,
        changes: runData.changes || [],
        error: runData.error || null,
        metrics: runData.metrics || {},
      }).catch((err) => logger.warn(`[MonitoringHistoryService] Record run warning: ${err.message}`));
    }

    return { product: runData.product, status: runData.status || 'COMPLETED' };
  }

  async getRecentRuns(productId, limit = 10) {
    return monitoringRunRepository.findRecentRunsForProduct(productId, limit);
  }
}

module.exports = new MonitoringHistoryService();
