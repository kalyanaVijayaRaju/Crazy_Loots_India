const endToEndPipeline = require('../integration/e2e/endToEndPipeline');
const ApiError = require('../middleware/apiError');

/**
 * Pipeline Application Service
 * Coordinates end-to-end deal detection and publishing workflow runs
 */
class PipelineAppService {
  /**
   * Run full E2E pipeline for a product URL
   * @param {string} url - Amazon product URL
   * @returns {Promise<Object>} Execution result summary
   */
  async runPipeline(url, options = {}) {
    if (!url) {
      throw ApiError.badRequest('Product URL is required');
    }

    const report = await endToEndPipeline.executePipeline(url, options);

    return {
      executionId: report.executionId || null,
      traceId: report.traceId || null,
      correlationId: report.correlationId || null,
      durationMs: report.totalDurationMs || 0,
      publishingMode: report.mode || 'DRY_RUN',
      stages: report.stages || [],
      telegramPreview: report.telegramPayloadPreview || '',
      executionReport: report,
    };
  }
}

module.exports = new PipelineAppService();
