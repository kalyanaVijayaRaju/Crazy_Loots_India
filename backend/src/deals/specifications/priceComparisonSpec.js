class PriceComparisonSpec {
  evaluate(product, historySummary, trend) {
    const currentPrice = product.currentPrice || 0;
    const originalPrice = product.originalPrice || currentPrice;
    const discountPercentage = originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    const averageDeviation = historySummary.averagePrice > 0
      ? parseFloat((((currentPrice - historySummary.averagePrice) / historySummary.averagePrice) * 100).toFixed(2))
      : 0;

    return {
      discountPercentage,
      averageDeviation,
      isLowest180d: historySummary.low180d > 0 && currentPrice <= historySummary.low180d,
      isLowest90d: historySummary.low90d > 0 && currentPrice <= historySummary.low90d,
      isLowest30d: historySummary.low30d > 0 && currentPrice <= historySummary.low30d,
      isAllTimeLow: historySummary.allTimeLow > 0 && currentPrice <= historySummary.allTimeLow,
      movingTrend: trend,
    };
  }
}

module.exports = new PriceComparisonSpec();
