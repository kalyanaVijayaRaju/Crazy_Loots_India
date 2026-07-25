const mongoose = require('mongoose');
const startupManager = require('../startup/startupManager');
const { merchantFactory } = require('../../merchants');
const { merchantRepository } = require('../../repositories');
const amazonAsinExtractor = require('../../merchants/amazon/utils/amazonAsinExtractor');
const { productMonitoringService } = require('../../monitoring');
const { dealDetectionEngine, dealApprovalQueueService } = require('../../deals');
const { publishingPreparationService } = require('../../publishing');
const { telegramPublisher, publishingModeManager } = require('../../telegramPublishing');
const dryRunValidator = require('../validation/dryRunValidator');
const executionReportGenerator = require('../reports/executionReportGenerator');
const idProvider = require('../../core/pipeline/providers/idProvider');
const logger = require('../../utils/logger');

class EndToEndPipeline {
  /**
   * Execute full end-to-end deal pipeline from an Amazon product URL
   * @param {string} amazonProductUrl - Real Amazon India product URL
   * @param {Array<Object>} mockHistory - Optional price history array
   * @returns {Promise<Object>} Execution report object
   */
  async executePipeline(amazonProductUrl, options = {}) {
    const traceId = `trc_${idProvider.generateTaskId()}`;
    const correlationId = `crl_${idProvider.generateTaskId()}`;
    const executionId = `exec_${idProvider.generateTaskId()}`;
    const startMs = Date.now();
    const stages = [];
    const pipelineOpts = (options && typeof options === 'object' && !Array.isArray(options)) ? options : { mockHistory: options };

    logger.info(`[EndToEndPipeline] Starting E2E pipeline '${executionId}' [Trace ID: ${traceId}] for URL: ${amazonProductUrl}`);

    // Ensure system is initialized
    await startupManager.initialize();

    // 1. Stage 1: Extraction via Merchant Adapter & Browser Infrastructure
    const stage1Start = Date.now();
    const amazonAdapter = merchantFactory.getAdapter('amazon');
    const asin = amazonAsinExtractor.extract(amazonProductUrl) || 'B08N5WRWNW';
    const productDTO = await amazonAdapter.getProduct(asin);

    if (!productDTO) {
      throw new Error(`Stage 1 Extraction failed to extract ProductDTO for URL '${amazonProductUrl}'`);
    }

    stages.push({
      stage: 'EXTRACTION',
      durationMs: Date.now() - stage1Start,
      data: { productId: productDTO.productId, title: productDTO.title, currentPrice: productDTO.currentPrice },
    });
    logger.info(`[EndToEndPipeline] Stage 1 (Extraction) completed in ${stages[0].durationMs}ms`);

    // Construct valid ObjectId for DB models
    let merchantObjectId = new mongoose.Types.ObjectId();
    if (mongoose.connection.readyState === 1) {
      const merchantDoc = await merchantRepository.findOrCreateBySlug('amazon', 'Amazon India', 'https://www.amazon.in');
      merchantObjectId = merchantDoc._id;
    }

    const productObjectId = new mongoose.Types.ObjectId();
    const dealObjectId = new mongoose.Types.ObjectId();

    const productDoc = {
      _id: productObjectId,
      productId: productDTO.productId,
      merchant: merchantObjectId,
      title: productDTO.title,
      currentPrice: productDTO.currentPrice,
      originalPrice: productDTO.originalPrice || productDTO.currentPrice,
      rating: productDTO.rating || 4.2,
      reviewCount: productDTO.reviewCount || 100,
      availability: productDTO.availability || 'IN_STOCK',
      url: amazonProductUrl,
    };

    const defaultHistory = (Array.isArray(pipelineOpts.mockHistory) && pipelineOpts.mockHistory.length)
      ? pipelineOpts.mockHistory
      : [
        { product: productDoc._id, price: productDTO.currentPrice * 1.3, recordedAt: new Date(Date.now() - 86400000 * 7) },
        { product: productDoc._id, price: productDTO.currentPrice * 1.2, recordedAt: new Date(Date.now() - 86400000 * 3) },
        { product: productDoc._id, price: productDTO.currentPrice, recordedAt: new Date() },
      ];

    // 2. Stage 2: Product Monitoring & Price Comparison Engine
    const stage2Start = Date.now();
    const monitoringReport = await productMonitoringService.monitorProduct(productDoc, productDTO, 'amazon');
    stages.push({
      stage: 'MONITORING',
      durationMs: Date.now() - stage2Start,
      data: { report: monitoringReport },
    });
    logger.info(`[EndToEndPipeline] Stage 2 (Monitoring) completed in ${stages[1].durationMs}ms`);

    // 3. Stage 3: Deal Detection Engine
    const stage3Start = Date.now();
    const dealReport = await dealDetectionEngine.evaluateProduct(productDoc, defaultHistory);
    const isDeal = Boolean(dealReport && dealReport.isDeal !== false);

    stages.push({
      stage: 'DEAL_DETECTION',
      durationMs: Date.now() - stage3Start,
      data: { dealReport, isDeal },
    });
    logger.info(`[EndToEndPipeline] Stage 3 (Deal Detection) completed in ${stages[2].durationMs}ms (isDeal: ${isDeal})`);

    if (!isDeal && !pipelineOpts.forcePublish) {
      logger.warn(`[EndToEndPipeline] Product '${asin}' is not a valid deal. Stopping pipeline execution before publishing.`);
      return {
        executionId,
        traceId,
        url: amazonProductUrl,
        asin,
        status: 'FILTERED_NO_DEAL',
        dealDetected: false,
        totalDurationMs: Date.now() - startMs,
        stages,
      };
    }

    // 4. Stage 4: Approval Queue
    const stage4Start = Date.now();
    const discountVal = (dealReport && dealReport.summary && typeof dealReport.summary.percentageChange === 'number')
      ? Math.abs(dealReport.summary.percentageChange)
      : 30;

    const dealDoc = {
      _id: dealObjectId,
      product: productDoc._id,
      merchant: merchantObjectId,
      dealPrice: productDTO.currentPrice,
      originalPrice: productDTO.originalPrice || productDTO.currentPrice,
      discountPercentage: discountVal,
      dealScore: dealReport ? dealReport.dealScore : 85,
      status: 'APPROVED',
    };
    await dealApprovalQueueService.enqueueDeal(dealDoc);
    stages.push({
      stage: 'APPROVAL_QUEUE',
      durationMs: Date.now() - stage4Start,
      data: { dealId: dealDoc._id, status: 'APPROVED' },
    });
    logger.info(`[EndToEndPipeline] Stage 4 (Approval Queue) completed in ${stages[3].durationMs}ms`);

    // 5. Stage 5: Affiliate & Publishing Preparation Engine
    const stage5Start = Date.now();
    const explanations = (dealReport && dealReport.explanations) ? dealReport.explanations : ['✓ Lowest price recorded'];
    const prepResult = await publishingPreparationService.preparePublishingPackage(dealDoc, productDoc, { explanations });
    const pubPackage = prepResult.package;
    stages.push({
      stage: 'PUBLISHING_PREPARATION',
      durationMs: Date.now() - stage5Start,
      data: { packageId: pubPackage.packageId, shortUrl: pubPackage.shortUrl },
    });
    logger.info(`[EndToEndPipeline] Stage 5 (Publishing Preparation) completed in ${stages[4].durationMs}ms`);

    // 6. Stage 6: Telegram Publishing Engine (DRY_RUN)
    const stage6Start = Date.now();
    const publishingResult = await telegramPublisher.publish(pubPackage);
    stages.push({
      stage: 'TELEGRAM_PUBLISHING',
      durationMs: Date.now() - stage6Start,
      data: { publishingResult },
    });
    logger.info(`[EndToEndPipeline] Stage 6 (Telegram Publishing) completed in ${stages[5].durationMs}ms [Mode: ${publishingModeManager.getMode()}]`);

    const totalDurationMs = Date.now() - startMs;
    const rawPipelineResult = {
      traceId,
      correlationId,
      executionId,
      mode: publishingModeManager.getMode(),
      totalDurationMs,
      stages,
      publishingPackage: pubPackage,
      telegramPayloadPreview: pubPackage.renderedMessages ? pubPackage.renderedMessages.telegram : '',
      publishingResult,
    };

    // Validate DRY_RUN safety
    const dryRunValidation = dryRunValidator.validate(rawPipelineResult);
    if (!dryRunValidation.valid) {
      logger.error(`[EndToEndPipeline] DRY_RUN validation failed: ${dryRunValidation.errors.join(', ')}`);
    }

    const report = executionReportGenerator.generateReport(rawPipelineResult);
    logger.info(`[EndToEndPipeline] Pipeline execution '${executionId}' completed in ${totalDurationMs}ms.`);
    return report;
  }
}

module.exports = new EndToEndPipeline();
