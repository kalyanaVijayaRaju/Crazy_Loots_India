class DealConfidenceEngine {
  /**
   * Calculate confidence score (0-100%) for deal authenticity
   * @param {Object} product
   * @param {Object} historySummary
   * @param {number} dealScore
   * @returns {Object} { confidence: number, reasoning: Array<string> }
   */
  calculateConfidence(product, historySummary = {}, dealScore = 0) {
    let confidence = 50;
    const reasoning = [];

    // History volume boosts confidence
    if (historySummary.recordCount >= 30) {
      confidence += 25;
      reasoning.push('Extensive historical price data available (>30 price points)');
    } else if (historySummary.recordCount >= 10) {
      confidence += 15;
      reasoning.push('Moderate historical price data available (10–30 price points)');
    } else {
      confidence += 5;
      reasoning.push('Limited historical price data available (<10 price points)');
    }

    // High rating boosts confidence
    if (product.rating >= 4.0 && product.reviewCount >= 100) {
      confidence += 15;
      reasoning.push(`High user rating (${product.rating}★) with ${product.reviewCount} reviews`);
    }

    // High deal score boosts confidence
    if (dealScore >= 70) {
      confidence += 10;
      reasoning.push(`Strong algorithmic deal score (${dealScore}/100)`);
    }

    const finalConfidence = Math.min(99, Math.max(10, Math.round(confidence)));
    return {
      confidence: finalConfidence,
      reasoning,
    };
  }
}

module.exports = new DealConfidenceEngine();
