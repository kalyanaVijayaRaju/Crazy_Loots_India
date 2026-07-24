class RecommendationService {
  /**
   * Determine recommendation label for deal review queue
   * @param {number} dealScore
   * @param {number} confidence
   * @returns {string} HIGH_PRIORITY | MANUAL_REVIEW | IGNORE | FUTURE_AI_REVIEW
   */
  recommend(dealScore, confidence) {
    if (dealScore >= 80 && confidence >= 75) {
      return 'HIGH_PRIORITY';
    }
    if (dealScore >= 60 && confidence >= 60) {
      return 'MANUAL_REVIEW';
    }
    if (dealScore < 40 || confidence < 40) {
      return 'IGNORE';
    }
    return 'FUTURE_AI_REVIEW';
  }
}

module.exports = new RecommendationService();
