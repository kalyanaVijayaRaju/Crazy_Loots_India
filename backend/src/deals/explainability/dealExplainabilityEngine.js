class DealExplainabilityEngine {
  /**
   * Generate human-readable explanation bullet points
   * @param {Object} product
   * @param {Object} comparisonSpec
   * @param {Object} _historySummary
   * @param {number} dealScore
   * @returns {Array<string>} Array of bullet points e.g. ["✓ Lowest price in 180 days", "✓ 44% discount"]
   */
  explain(product, comparisonSpec = {}, _historySummary = {}, dealScore = 0) {
    const reasons = [];

    if (comparisonSpec.isAllTimeLow) {
      reasons.push('✓ All-time lowest price recorded');
    } else if (comparisonSpec.isLowest180d) {
      reasons.push('✓ Lowest price in 180 days');
    } else if (comparisonSpec.isLowest90d) {
      reasons.push('✓ Lowest price in 90 days');
    } else if (comparisonSpec.isLowest30d) {
      reasons.push('✓ Lowest price in 30 days');
    }

    if (comparisonSpec.discountPercentage > 0) {
      reasons.push(`✓ ${comparisonSpec.discountPercentage}% discount off list price`);
    }

    if (product.rating > 0) {
      reasons.push(`✓ Highly rated product (${product.rating}★ out of 5)`);
    }

    if (product.reviewCount > 0) {
      reasons.push(`✓ Verified by ${product.reviewCount} customer reviews`);
    }

    const meta = product.metadata || {};
    if (meta.coupon) {
      reasons.push(`✓ Additional coupon offer available: ${meta.coupon}`);
    }

    if (dealScore >= 80) {
      reasons.push('✓ Exceptional deal score rating');
    }

    return reasons;
  }
}

module.exports = new DealExplainabilityEngine();
