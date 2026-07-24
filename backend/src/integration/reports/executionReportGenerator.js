class ExecutionReportGenerator {
  generateReport(pipelineResult) {
    return {
      traceId: pipelineResult.traceId,
      correlationId: pipelineResult.correlationId,
      executionId: pipelineResult.executionId,
      mode: pipelineResult.mode,
      totalDurationMs: pipelineResult.totalDurationMs,
      stages: pipelineResult.stages || [],
      publishingPackageSummary: pipelineResult.publishingPackage
        ? {
            packageId: pipelineResult.publishingPackage.packageId,
            affiliateUrl: pipelineResult.publishingPackage.affiliateUrl,
            shortUrl: pipelineResult.publishingPackage.shortUrl,
          }
        : null,
      telegramPayloadPreview: pipelineResult.telegramPayloadPreview || null,
      publishingResult: pipelineResult.publishingResult || null,
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new ExecutionReportGenerator();
