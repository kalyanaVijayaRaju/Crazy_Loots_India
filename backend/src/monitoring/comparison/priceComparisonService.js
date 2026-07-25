class PriceComparisonService {
  /**
   * Compare new price against previous price & historical records
   * @param {number} newPrice - Newly scraped current price
   * @param {number} oldPrice - Previous current price
   * @param {Object} historySummary - { lowestEver: number, highestEver: number }
   * @returns {Object} Comparison details and trend enum
   */
  compare(newPrice, oldPrice = 0, historySummary = {}) {
    const currentNew = typeof newPrice === 'number' ? newPrice : 0;
    const currentOld = typeof oldPrice === 'number' ? oldPrice : 0;
    const lowestEver = historySummary.lowestEver || currentOld || currentNew;
    const highestEver = historySummary.highestEver || currentOld || currentNew;

    let trend = 'UNCHANGED';
    let percentageChange = 0;

    if (currentOld > 0 && currentNew !== currentOld) {
      percentageChange = parseFloat((((currentNew - currentOld) / currentOld) * 100).toFixed(2));
      if (currentNew < currentOld) {
        trend = currentNew < lowestEver ? 'NEW_LOW' : 'DOWN';
      } else {
        trend = currentNew > highestEver ? 'NEW_HIGH' : 'UP';
      }
    } else if (currentOld === 0 && currentNew > 0) {
      trend = 'DOWN';
    }

    return {
      trend,
      oldPrice: currentOld,
      newPrice: currentNew,
      difference: currentNew - currentOld,
      percentageChange,
      isPriceIncrease: trend === 'UP' || trend === 'NEW_HIGH',
      isPriceDecrease: trend === 'DOWN' || trend === 'NEW_LOW',
      isLowestEver: currentNew > 0 && currentNew <= lowestEver,
      isHighestEver: currentNew >= highestEver,
    };
  }

  calculateHistoricalStats(history = []) {
    if (!Array.isArray(history) || history.length === 0) {
      return { lowest: 0, highest: 0, average: 0, median: 0, volatility: 0 };
    }
    const prices = history
      .map((item) => (typeof item === 'number' ? item : (item.price || item.currentPrice)))
      .filter((p) => typeof p === 'number' && p > 0);

    if (prices.length === 0) {
      return { lowest: 0, highest: 0, average: 0, median: 0, volatility: 0 };
    }
    const sorted = [...prices].sort((a, b) => a - b);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const average = parseFloat((sum / sorted.length).toFixed(2));
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : parseFloat(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
    const volatility = highest > 0 ? parseFloat((((highest - lowest) / highest) * 100).toFixed(2)) : 0;

    return { lowest, highest, average, median, volatility };
  }
}

module.exports = new PriceComparisonService();
