class MonitoringReportGenerator {
  /**
   * Generate a structured monitoring report from execution results
   * @param {Object} params
   * @returns {Object} MonitoringReport
   */
  generate({
    productId,
    merchant,
    priceComparison = {},
    changes = [],
    metrics = {},
    errors = [],
    status = 'COMPLETED',
  }) {
    return {
      productId,
      merchant,
      status,
      summary: {
        totalChanges: changes.length,
        priceChanged: priceComparison.trend !== 'UNCHANGED',
        trend: priceComparison.trend || 'UNCHANGED',
        percentageChange: priceComparison.percentageChange || 0,
        isLowestEver: priceComparison.isLowestEver || false,
        isHighestEver: priceComparison.isHighestEver || false,
      },
      changes,
      performance: {
        durationMs: metrics.totalDurationMs || 0,
        navigationMs: metrics.navigationMs || 0,
        extractionMs: metrics.extractionMs || 0,
        comparisonMs: metrics.comparisonMs || 0,
        persistenceMs: metrics.persistenceMs || 0,
      },
      errors,
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new MonitoringReportGenerator();
