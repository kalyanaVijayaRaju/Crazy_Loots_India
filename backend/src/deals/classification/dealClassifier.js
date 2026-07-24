const { DealType } = require('../../constants/enums');

class DealClassifier {
  /**
   * Classify deal into primary deal type category
   * @param {Object} product
   * @param {Object} comparisonSpec
   * @returns {string} DealType enum
   */
  classify(product, comparisonSpec = {}) {
    const meta = product.metadata || {};

    if (meta.coupon) {
      return DealType.COUPON;
    }
    if (meta.bankOffer) {
      return DealType.BANK_OFFER;
    }
    if (comparisonSpec.discountPercentage >= 60) {
      return DealType.CLEARANCE;
    }
    if (comparisonSpec.isAllTimeLow || comparisonSpec.isLowest180d) {
      return DealType.LIGHTNING;
    }
    return DealType.PRICE_DROP;
  }
}

module.exports = new DealClassifier();
