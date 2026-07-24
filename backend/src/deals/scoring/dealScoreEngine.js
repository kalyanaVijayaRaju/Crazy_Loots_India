const defaultWeights = {
  discount: 35, // Max 35 points for high discount
  historicalLow: 25, // Max 25 points for historical low
  rating: 15, // Max 15 points for rating >= 4.0
  reviewCount: 10, // Max 10 points for review volume
  availability: 5, // Max 5 points for in stock
  coupon: 5, // Max 5 points for active coupon
  sellerQuality: 5, // Max 5 points for reputable seller
};

class DealScoreEngine {
  constructor(weights = defaultWeights) {
    this.weights = weights;
  }

  /**
   * Calculate 0–100 weighted deal score
   * @param {Object} product
   * @param {Object} comparisonSpec
   * @param {Object} historySummary
   * @returns {number} Score bounded between 0 and 100
   */
  calculateScore(product, comparisonSpec = {}, _historySummary = {}) {
    let score = 0;

    // 1. Discount score (up to 35 pts)
    const discountPct = comparisonSpec.discountPercentage || 0;
    const discountScore = Math.min(this.weights.discount, (discountPct / 70) * this.weights.discount);
    score += discountScore;

    // 2. Historical low score (up to 25 pts)
    if (comparisonSpec.isAllTimeLow) {
      score += this.weights.historicalLow;
    } else if (comparisonSpec.isLowest180d) {
      score += this.weights.historicalLow * 0.8;
    } else if (comparisonSpec.isLowest90d) {
      score += this.weights.historicalLow * 0.6;
    } else if (comparisonSpec.isLowest30d) {
      score += this.weights.historicalLow * 0.4;
    }

    // 3. Rating score (up to 15 pts)
    const rating = product.rating || 0;
    if (rating >= 4.5) {
      score += this.weights.rating;
    } else if (rating >= 4.0) {
      score += this.weights.rating * 0.8;
    } else if (rating >= 3.5) {
      score += this.weights.rating * 0.5;
    }

    // 4. Review count score (up to 10 pts)
    const reviews = product.reviewCount || 0;
    if (reviews >= 5000) {
      score += this.weights.reviewCount;
    } else if (reviews >= 1000) {
      score += this.weights.reviewCount * 0.8;
    } else if (reviews >= 100) {
      score += this.weights.reviewCount * 0.5;
    }

    // 5. Availability score (up to 5 pts)
    if (product.availability === 'IN_STOCK' || product.availability === 'In stock.') {
      score += this.weights.availability;
    }

    // 6. Coupon score (up to 5 pts)
    const meta = product.metadata || {};
    if (meta.coupon) {
      score += this.weights.coupon;
    }

    // 7. Seller quality score (up to 5 pts)
    if (meta.seller && (meta.seller.includes('Appario') || meta.seller.includes('Amazon'))) {
      score += this.weights.sellerQuality;
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }
}

module.exports = new DealScoreEngine();
