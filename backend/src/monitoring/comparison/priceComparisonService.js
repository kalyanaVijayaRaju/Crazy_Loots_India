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
}

module.exports = new PriceComparisonService();
