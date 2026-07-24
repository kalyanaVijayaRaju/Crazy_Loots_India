const historicalPriceAnalyzer = require('../analyzer/historicalPriceAnalyzer');
const trendAnalyzer = require('../trends/trendAnalyzer');
const priceComparisonSpec = require('../specifications/priceComparisonSpec');
const ruleEngine = require('../rules/ruleEngine');
const dealDuplicateChecker = require('../duplicate/dealDuplicateChecker');
const dealCooldownManager = require('../cooldown/dealCooldownManager');
const dealClassifier = require('../classification/dealClassifier');
const dealScoreEngine = require('../scoring/dealScoreEngine');
const dealConfidenceEngine = require('../confidence/dealConfidenceEngine');
const dealExplainabilityEngine = require('../explainability/dealExplainabilityEngine');
const dealApprovalQueueService = require('../approval/dealApprovalQueueService');
const recommendationService = require('../recommendations/recommendationService');
const falsePositiveTracker = require('../metrics/falsePositiveTracker');
const dealMetrics = require('../metrics/dealMetrics');
const dealDetectionReportGenerator = require('../reports/dealDetectionReportGenerator');
const DealEventTypes = require('../events/dealEventTypes');
const eventBus = require('../../core/events/eventBus');
const logger = require('../../utils/logger');

class DealDetectionEngine {
  /**
   * Analyze product and price history to evaluate, score, and enqueue deals
   * @param {Object} product - Product document or DTO
   * @param {Array<Object>} priceHistory - Array of price history records
   * @returns {Promise<Object|null>} DealDetectionReport or null if blocked/not a deal
   */
  async evaluateProduct(product, priceHistory = []) {
    const startMs = Date.now();
    const productId = product._id || product.productId;
    logger.info(`[DealDetectionEngine] Starting deal evaluation for product '${productId}'`);

    // 1. Duplicate check
    if (await dealDuplicateChecker.isDuplicate(productId)) {
      dealMetrics.recordDuplicateBlock();
      await eventBus.emit(DealEventTypes.DUPLICATE_DEAL_BLOCKED, { productId });
      logger.info(`[DealDetectionEngine] Blocked duplicate deal for '${productId}'`);
      return null;
    }

    // 2. Cooldown check
    if (dealCooldownManager.isCoolingDown(productId)) {
      dealMetrics.recordCooldownBlock();
      await eventBus.emit(DealEventTypes.COOLDOWN_APPLIED, { productId });
      logger.info(`[DealDetectionEngine] Product '${productId}' is in deal cooldown.`);
      return null;
    }

    // 3. Historical analysis
    const historySummary = historicalPriceAnalyzer.analyze(priceHistory);

    // 4. Trend analysis
    const trend = trendAnalyzer.analyzeTrend(product.currentPrice, product.previousPrice || 0, historySummary);

    // 5. Price comparison spec
    const comparisonSpec = priceComparisonSpec.evaluate(product, historySummary, trend);

    // 6. Rule Engine evaluation
    const ruleContext = { product, historySummary, trend, comparisonSpec };
    const ruleResult = ruleEngine.evaluate(ruleContext);
    await eventBus.emit(DealEventTypes.RULE_EVALUATED, { productId, passed: ruleResult.passed });

    if (!ruleResult.passed) {
      falsePositiveTracker.trackRejection(productId, 0, ruleResult.failedRules.map((f) => f.reason).join('; '));
      await eventBus.emit(DealEventTypes.DEAL_REJECTED, { productId, reason: 'Failed rule evaluation' });
      logger.info(`[DealDetectionEngine] Product '${productId}' failed rule evaluation.`);
      return null;
    }

    // 7. Deal score calculation
    const dealScore = dealScoreEngine.calculateScore(product, comparisonSpec, historySummary);
    await eventBus.emit(DealEventTypes.SCORE_CALCULATED, { productId, dealScore });

    // Filter low score deals (< 40 score threshold)
    if (dealScore < 40) {
      falsePositiveTracker.trackRejection(productId, dealScore, 'Deal score below threshold (<40)');
      await eventBus.emit(DealEventTypes.DEAL_REJECTED, { productId, reason: 'Score below threshold' });
      logger.info(`[DealDetectionEngine] Product '${productId}' score (${dealScore}) below threshold.`);
      return null;
    }

    // 8. Confidence calculation
    const confidence = dealConfidenceEngine.calculateConfidence(product, historySummary, dealScore);

    // 9. Deal classification
    const classification = dealClassifier.classify(product, comparisonSpec);

    // 10. Explainability
    const explanations = dealExplainabilityEngine.explain(product, comparisonSpec, historySummary, dealScore);

    // 11. Recommendation
    const recommendation = recommendationService.recommend(dealScore, confidence.confidence);

    // 12. Enqueue into Approval Queue (PENDING)
    const dealDoc = await dealApprovalQueueService.enqueueDeal({
      product: productId,
      dealPrice: product.currentPrice,
      originalPrice: product.originalPrice || product.currentPrice,
      discountPercentage: comparisonSpec.discountPercentage,
      couponDiscount: (product.metadata && product.metadata.coupon) ? 50 : 0,
      bankOffer: (product.metadata && product.metadata.bankOffer) || '',
      dealScore,
      dealType: classification,
    });

    // 13. Apply cooldown
    dealCooldownManager.applyCooldown(productId);

    const executionMs = Date.now() - startMs;
    dealMetrics.recordDetection(dealScore, confidence.confidence);

    // 14. Emit DealDetected event
    await eventBus.emit(DealEventTypes.DEAL_DETECTED, {
      dealId: dealDoc._id,
      productId,
      dealScore,
      confidence: confidence.confidence,
      classification,
    });

    // 15. Generate report
    const report = dealDetectionReportGenerator.generate({
      product,
      dealScore,
      confidence,
      trend,
      classification,
      historySummary,
      explanations,
      recommendation,
      warnings: [],
      errors: [],
      executionMs,
    });

    logger.info(`[DealDetectionEngine] Deal detected & enqueued for '${productId}' (Score: ${dealScore}, Confidence: ${confidence.confidence}%, Type: ${classification})`);
    return report;
  }
}

module.exports = new DealDetectionEngine();
