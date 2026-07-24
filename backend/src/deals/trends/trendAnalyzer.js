class TrendAnalyzer {
  /**
   * Determine price movement trend
   * @param {number} currentPrice
   * @param {number} previousPrice
   * @param {Object} historySummary - Result from HistoricalPriceAnalyzer
   * @returns {string} Trend enum: RISING | FALLING | STABLE | VOLATILE | NEW_LOW | NEW_HIGH
   */
  analyzeTrend(currentPrice, previousPrice, historySummary = {}) {
    if (!currentPrice || currentPrice <= 0) {
      return 'STABLE';
    }

    if (historySummary.allTimeLow > 0 && currentPrice < historySummary.allTimeLow) {
      return 'NEW_LOW';
    }

    if (historySummary.allTimeHigh > 0 && currentPrice > historySummary.allTimeHigh) {
      return 'NEW_HIGH';
    }

    if (historySummary.volatility > 0.3) {
      return 'VOLATILE';
    }

    if (!previousPrice || previousPrice === currentPrice) {
      return 'STABLE';
    }

    const diffPct = ((currentPrice - previousPrice) / previousPrice) * 100;
    if (diffPct <= -2) {
      return 'FALLING';
    }
    if (diffPct >= 2) {
      return 'RISING';
    }

    return 'STABLE';
  }
}

module.exports = new TrendAnalyzer();
