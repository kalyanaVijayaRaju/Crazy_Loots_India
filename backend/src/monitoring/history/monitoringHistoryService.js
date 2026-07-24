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
    return monitoringRunRepository.create({
      product: runData.product,
      merchant: runData.merchant,
      status: runData.status || 'COMPLETED',
      startedAt: runData.startedAt,
      completedAt: runData.completedAt || new Date(),
      duration: runData.duration || 0,
      priceChanged: runData.priceChanged || false,
      changes: runData.changes || [],
      error: runData.error || null,
      metrics: runData.metrics || {},
    });
  }

  async getRecentRuns(productId, limit = 10) {
    return monitoringRunRepository.findRecentRunsForProduct(productId, limit);
  }
}

module.exports = new MonitoringHistoryService();
