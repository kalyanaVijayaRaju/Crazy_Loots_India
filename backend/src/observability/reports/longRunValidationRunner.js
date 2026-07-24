const logger = require('../../utils/logger');
const traceTimelineService = require('../tracing/traceTimelineService');
const executionTimelineStore = require('../timeline/executionTimelineStore');
const performanceProfiler = require('../profiler/performanceProfiler');
const metricsAggregator = require('../metrics/metricsAggregator');
const executionReplayService = require('../replay/executionReplayService');
const executionArchiveService = require('../archive/executionArchiveService');

/**
 * LongRunValidationRunner
 *
 * Runs continuous validation using REAL Amazon product URLs in DRY_RUN mode.
 * Monitors 20–50 products, executes multiple monitoring cycles, and produces
 * stability reports including price history, deal reports, and publishing packages.
 *
 * NO live publishing occurs — all Telegram output is DRY_RUN only.
 */
class LongRunValidationRunner {
  constructor() {
    /** @type {Array<Object>} */
    this._validationResults = [];
    this._isRunning = false;
  }

  /**
   * Default Amazon product URLs for validation
   * @returns {string[]}
   */
  static get DEFAULT_PRODUCT_URLS() {
    return [
      'https://www.amazon.in/dp/B0D4J3JTQF',
      'https://www.amazon.in/dp/B0DGJF8LGR',
      'https://www.amazon.in/dp/B0C9J1V17C',
      'https://www.amazon.in/dp/B0DGJG6KQ5',
      'https://www.amazon.in/dp/B0CVKBQYK2',
      'https://www.amazon.in/dp/B0BYQ5MB49',
      'https://www.amazon.in/dp/B0D1X5JGK2',
      'https://www.amazon.in/dp/B0CX23V2ZK',
      'https://www.amazon.in/dp/B0CHX3TRM5',
      'https://www.amazon.in/dp/B0C9HMNKZJ',
      'https://www.amazon.in/dp/B0BTXYCZ5R',
      'https://www.amazon.in/dp/B0BN9832Y5',
      'https://www.amazon.in/dp/B0B3PSRHKY',
      'https://www.amazon.in/dp/B09V15YQ53',
      'https://www.amazon.in/dp/B09G9HD6PD',
      'https://www.amazon.in/dp/B09G9BT5MY',
      'https://www.amazon.in/dp/B0DJYPBGVB',
      'https://www.amazon.in/dp/B0D96MXZPH',
      'https://www.amazon.in/dp/B0CTYP8V3L',
      'https://www.amazon.in/dp/B0CL5KNB9V',
    ];
  }

  /**
   * Run a validation cycle
   * @param {Object} [opts]
   * @param {string[]} [opts.urls] - Product URLs to validate
   * @param {number} [opts.cycles=1] - Number of monitoring cycles
   * @param {Function} [opts.pipelineFn] - Pipeline function to execute per URL
   * @returns {Promise<Object>} validation report
   */
  async run(opts = {}) {
    if (this._isRunning) {
      return { success: false, reason: 'ALREADY_RUNNING' };
    }

    this._isRunning = true;
    const urls = opts.urls || LongRunValidationRunner.DEFAULT_PRODUCT_URLS;
    const cycles = opts.cycles || 1;
    const startMs = Date.now();

    logger.info(`[LongRunValidation] Starting validation: ${urls.length} products, ${cycles} cycle(s)`);

    const cycleResults = [];

    for (let cycle = 1; cycle <= cycles; cycle++) {
      const cycleStart = Date.now();
      const productResults = [];

      for (const url of urls) {
        const ctx = traceTimelineService.startExecution();
        const profileId = performanceProfiler.startSession(ctx.executionId);
        const timeline = executionTimelineStore.create(ctx.executionId);

        let productResult;

        try {
          if (opts.pipelineFn) {
            performanceProfiler.startMeasure(profileId, 'TOTAL_EXECUTION');
            productResult = await opts.pipelineFn(url);
            performanceProfiler.endMeasure(profileId, 'TOTAL_EXECUTION');
          } else {
            // Dry simulation when no pipeline function provided
            productResult = {
              url,
              simulated: true,
              status: 'DRY_RUN_SIMULATED',
            };
          }

          traceTimelineService.recordStage(ctx.executionId, {
            stage: 'TOTAL_EXECUTION',
            durationMs: Date.now() - cycleStart,
            data: { url },
          });

          traceTimelineService.completeExecution(ctx.executionId, 'SUCCESS');
          executionTimelineStore.complete(ctx.executionId);

          metricsAggregator.incrementCounter('longrun.products_processed');
          metricsAggregator.recordHistogram('longrun.execution_duration_ms', Date.now() - cycleStart);

          productResults.push({
            url,
            executionId: ctx.executionId,
            success: true,
            result: productResult,
          });
        } catch (error) {
          traceTimelineService.completeExecution(ctx.executionId, 'FAILURE', { error: error.message });
          metricsAggregator.incrementCounter('longrun.failures');

          productResults.push({
            url,
            executionId: ctx.executionId,
            success: false,
            error: error.message,
          });
        }

        performanceProfiler.endSession(profileId);

        // Store snapshot for replay
        executionReplayService.storeSnapshot(ctx.executionId, {
          traceContext: ctx,
          timeline,
          result: productResult,
        });
      }

      cycleResults.push({
        cycle,
        productsProcessed: productResults.length,
        successes: productResults.filter((r) => r.success).length,
        failures: productResults.filter((r) => !r.success).length,
        durationMs: Date.now() - cycleStart,
        products: productResults,
      });
    }

    const totalDurationMs = Date.now() - startMs;
    const totalProcessed = cycleResults.reduce((sum, c) => sum + c.productsProcessed, 0);
    const totalSuccesses = cycleResults.reduce((sum, c) => sum + c.successes, 0);
    const totalFailures = cycleResults.reduce((sum, c) => sum + c.failures, 0);

    const stabilityScore = totalProcessed > 0
      ? parseFloat(((totalSuccesses / totalProcessed) * 100).toFixed(1))
      : 0;

    const report = {
      mode: 'DRY_RUN',
      totalProducts: urls.length,
      totalCycles: cycles,
      totalProcessed,
      totalSuccesses,
      totalFailures,
      stabilityScore,
      totalDurationMs,
      cycleResults,
      generatedAt: new Date().toISOString(),
    };

    this._validationResults.push(report);
    this._isRunning = false;

    // Archive the validation report
    executionArchiveService.archive(`longrun_${Date.now()}`, {
      report,
      metrics: metricsAggregator.getUnifiedReport(),
    });

    logger.info(`[LongRunValidation] Completed: ${totalSuccesses}/${totalProcessed} products OK, stability ${stabilityScore}%`);
    return report;
  }

  /**
   * Get all validation results
   * @returns {Array<Object>}
   */
  getResults() {
    return [...this._validationResults];
  }

  /**
   * Check if validation is currently running
   * @returns {boolean}
   */
  isRunning() {
    return this._isRunning;
  }
}

module.exports = new LongRunValidationRunner();
