class DealDetectionReportGenerator {
  generate({
    product,
    dealScore,
    confidence,
    trend,
    classification,
    historySummary,
    explanations = [],
    recommendation,
    warnings = [],
    errors = [],
    executionMs = 0,
  }) {
    return {
      productId: product._id || product.productId,
      merchant: product.merchant || 'amazon',
      dealScore,
      confidence: confidence.confidence,
      confidenceReasoning: confidence.reasoning,
      trend,
      classification,
      historicalAnalysis: historySummary,
      reasons: explanations,
      recommendation,
      warnings,
      errors,
      executionMs,
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new DealDetectionReportGenerator();
