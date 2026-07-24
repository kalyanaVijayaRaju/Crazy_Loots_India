class HistoricalPriceAnalyzer {
  /**
   * Analyze price history records to calculate metrics
   * @param {Array<Object>} priceHistoryRecords - Array of { price, timestamp }
   * @returns {Object} Historical price analysis summary
   */
  analyze(priceHistoryRecords = []) {
    if (!Array.isArray(priceHistoryRecords) || priceHistoryRecords.length === 0) {
      return {
        allTimeLow: 0,
        allTimeHigh: 0,
        low30d: 0,
        low90d: 0,
        low180d: 0,
        averagePrice: 0,
        medianPrice: 0,
        volatility: 0,
        recordCount: 0,
      };
    }

    const now = Date.now();
    const ms30d = 30 * 24 * 3600 * 1000;
    const ms90d = 90 * 24 * 3600 * 1000;
    const ms180d = 180 * 24 * 3600 * 1000;

    const prices = [];
    const prices30d = [];
    const prices90d = [];
    const prices180d = [];

    for (const rec of priceHistoryRecords) {
      const p = typeof rec.price === 'number' ? rec.price : 0;
      if (p > 0) {
        prices.push(p);
        const t = rec.timestamp ? new Date(rec.timestamp).getTime() : now;
        const diff = now - t;

        if (diff <= ms30d) {
          prices30d.push(p);
        }
        if (diff <= ms90d) {
          prices90d.push(p);
        }
        if (diff <= ms180d) {
          prices180d.push(p);
        }
      }
    }

    if (prices.length === 0) {
      return {
        allTimeLow: 0,
        allTimeHigh: 0,
        low30d: 0,
        low90d: 0,
        low180d: 0,
        averagePrice: 0,
        medianPrice: 0,
        volatility: 0,
        recordCount: 0,
      };
    }

    const min = (arr) => (arr.length ? Math.min(...arr) : Math.min(...prices));
    const max = (arr) => (arr.length ? Math.max(...arr) : Math.max(...prices));

    const sum = prices.reduce((a, b) => a + b, 0);
    const avg = sum / prices.length;

    // Median
    const sorted = [...prices].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Volatility (Standard Deviation / Average)
    const variance = prices.reduce((acc, p) => acc + Math.pow(p - avg, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    const volatility = avg > 0 ? parseFloat((stdDev / avg).toFixed(4)) : 0;

    return {
      allTimeLow: min(prices),
      allTimeHigh: max(prices),
      low30d: min(prices30d),
      low90d: min(prices90d),
      low180d: min(prices180d),
      averagePrice: Math.round(avg),
      medianPrice: Math.round(median),
      volatility,
      recordCount: prices.length,
    };
  }
}

module.exports = new HistoricalPriceAnalyzer();
