const priceComparisonService = require('../comparison/priceComparisonService');
const productChangeDetector = require('../detector/productChangeDetector');
const monitoringLockManager = require('../locks/monitoringLockManager');
const monitoringHistoryService = require('../history/monitoringHistoryService');
const monitoringReportGenerator = require('../reports/monitoringReportGenerator');
const monitoringMetrics = require('../metrics/monitoringMetrics');
const MonitoringEventTypes = require('../events/monitoringEventTypes');
const eventBus = require('../../core/events/eventBus');
const { productRepository, priceHistoryRepository } = require('../../repositories');
const logger = require('../../utils/logger');

class ProductMonitoringService {
  /**
   * Execute a full monitoring cycle for a product
   * @param {Object} productDoc - Existing product document from DB
   * @param {Object} newProductDTO - Freshly extracted ProductDTO
   * @param {string} merchant - Merchant key e.g. 'amazon'
   * @returns {Promise<Object>} MonitoringReport
   */
  async monitorProduct(productDoc, newProductDTO, merchant = 'amazon') {
    const productId = productDoc._id || productDoc.productId;
    const startedAt = new Date();
    const startMs = Date.now();

    // Acquire lock
    if (!monitoringLockManager.acquireLock(productId)) {
      logger.warn(`[ProductMonitoringService] Monitoring skipped. Product '${productId}' already locked.`);
      return null;
    }

    try {
      // Emit started event
      await eventBus.emit(MonitoringEventTypes.MONITORING_STARTED, { productId, merchant });
      logger.info(`[ProductMonitoringService] Monitoring started for product '${productId}'`);

      // 1. Price comparison
      const priceComparison = priceComparisonService.compare(
        newProductDTO.currentPrice,
        productDoc.currentPrice || 0,
        {
          lowestEver: productDoc.lowestEver || productDoc.currentPrice || newProductDTO.currentPrice,
          highestEver: productDoc.highestEver || productDoc.currentPrice || newProductDTO.currentPrice,
        }
      );

      // 2. Change detection
      const changes = productChangeDetector.detectChanges(productDoc, newProductDTO);

      // 3. Persist updated product
      const updateData = {
        title: newProductDTO.title,
        brand: newProductDTO.brand,
        image: newProductDTO.image,
        currentPrice: newProductDTO.currentPrice,
        originalPrice: newProductDTO.originalPrice || newProductDTO.currentPrice,
        rating: newProductDTO.rating,
        reviewCount: newProductDTO.reviewCount,
        availability: newProductDTO.availability,
        metadata: newProductDTO.metadata,
        updatedAt: new Date(),
      };

      if (priceComparison.isLowestEver) {
        updateData.lowestEver = newProductDTO.currentPrice;
      }
      if (priceComparison.isHighestEver) {
        updateData.highestEver = newProductDTO.currentPrice;
      }

      try {
        await productRepository.update(productId, updateData);
      } catch (err) {
        logger.warn(`[ProductMonitoringService] Product update in DB skipped: ${err.message}`);
      }

      // 4. Persist price history
      try {
        await priceHistoryRepository.create({
          product: productId,
          price: newProductDTO.currentPrice,
          originalPrice: newProductDTO.originalPrice || newProductDTO.currentPrice,
          discountPercentage: newProductDTO.discountPercentage || 0,
          recordedAt: new Date(),
        });
      } catch (err) {
        logger.warn(`[ProductMonitoringService] Price history create skipped: ${err.message}`);
      }

      const durationMs = Date.now() - startMs;

      // 5. Emit relevant events
      if (priceComparison.trend !== 'UNCHANGED') {
        await eventBus.emit(MonitoringEventTypes.PRICE_CHANGED, {
          productId,
          merchant,
          ...priceComparison,
        });
      } else {
        await eventBus.emit(MonitoringEventTypes.PRICE_UNCHANGED, { productId, merchant });
      }

      if (priceComparison.isLowestEver) {
        await eventBus.emit(MonitoringEventTypes.LOWEST_PRICE_REACHED, {
          productId,
          merchant,
          price: newProductDTO.currentPrice,
        });
      }

      // 6. Record monitoring run history
      await monitoringHistoryService.recordRun({
        product: productId,
        merchant,
        status: 'COMPLETED',
        startedAt,
        completedAt: new Date(),
        duration: durationMs,
        priceChanged: priceComparison.trend !== 'UNCHANGED',
        changes,
      });

      // 7. Update metrics
      monitoringMetrics.recordExecution(productId, durationMs, priceComparison.trend !== 'UNCHANGED');

      // 8. Emit completed event
      await eventBus.emit(MonitoringEventTypes.MONITORING_COMPLETED, { productId, merchant, durationMs });

      // 9. Generate report
      const report = monitoringReportGenerator.generate({
        productId,
        merchant,
        priceComparison,
        changes,
        metrics: { totalDurationMs: durationMs },
        errors: [],
        status: 'COMPLETED',
      });

      logger.info(`[ProductMonitoringService] Monitoring completed for '${productId}' in ${durationMs}ms (Trend: ${priceComparison.trend})`);
      return report;
    } catch (err) {
      const durationMs = Date.now() - startMs;
      monitoringMetrics.recordFailure();

      await eventBus.emit(MonitoringEventTypes.MONITORING_FAILED, {
        productId,
        merchant,
        error: err.message,
      });

      await monitoringHistoryService.recordRun({
        product: productId,
        merchant,
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: durationMs,
        error: err.message,
      });

      logger.error(`[ProductMonitoringService] Monitoring failed for '${productId}': ${err.message}`);
      throw err;
    } finally {
      monitoringLockManager.releaseLock(productId);
    }
  }
}

module.exports = new ProductMonitoringService();
