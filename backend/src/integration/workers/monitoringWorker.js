const { productMonitoringService, monitoringLockManager } = require('../../monitoring');
const logger = require('../../utils/logger');

class MonitoringWorker {
  /**
   * Process a single monitoring job task
   * @param {Object} productDoc - Product document
   * @param {Object} newProductDTO - Fresh ProductDTO
   * @param {string} merchant - Merchant key
   * @returns {Promise<Object>} Execution result
   */
  async processJob(productDoc, newProductDTO, merchant = 'amazon') {
    const productId = productDoc._id || productDoc.productId;
    logger.info(`[MonitoringWorker] Processing monitoring job for product '${productId}'`);

    if (monitoringLockManager.isLocked(productId)) {
      logger.warn(`[MonitoringWorker] Product '${productId}' is locked. Skipping job.`);
      return { skipped: true, reason: 'LOCKED' };
    }

    try {
      const report = await productMonitoringService.monitorProduct(productDoc, newProductDTO, merchant);
      return { success: true, report };
    } catch (err) {
      logger.error(`[MonitoringWorker] Error processing monitoring job for '${productId}': ${err.message}`);
      return { success: false, error: err.message };
    }
  }
}

module.exports = new MonitoringWorker();
