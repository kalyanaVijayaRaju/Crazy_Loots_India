class ProductChangeDetector {
  /**
   * Compare old Product structure with newly extracted ProductDTO
   * @param {Object} oldProduct
   * @param {Object} newProductDTO
   * @returns {Array<Object>} List of detected change objects
   */
  detectChanges(oldProduct = {}, newProductDTO = {}) {
    const changes = [];

    const checkField = (field, oldVal, newVal) => {
      if (oldVal !== undefined && newVal !== undefined && oldVal !== newVal) {
        changes.push({
          field,
          oldValue: oldVal,
          newValue: newVal,
          timestamp: new Date().toISOString(),
        });
      }
    };

    checkField('title', oldProduct.title, newProductDTO.title);
    checkField('currentPrice', oldProduct.currentPrice, newProductDTO.currentPrice);
    checkField('originalPrice', oldProduct.originalPrice, newProductDTO.originalPrice);
    checkField('rating', oldProduct.rating, newProductDTO.rating);
    checkField('reviewCount', oldProduct.reviewCount, newProductDTO.reviewCount);
    checkField('availability', oldProduct.availability, newProductDTO.availability);
    checkField('image', oldProduct.image, newProductDTO.image);

    // Check metadata fields (seller, coupon, delivery)
    const oldMeta = oldProduct.metadata || {};
    const newMeta = newProductDTO.metadata || {};

    checkField('seller', oldMeta.seller, newMeta.seller);
    checkField('coupon', oldMeta.coupon, newMeta.coupon);
    checkField('delivery', oldMeta.delivery, newMeta.delivery);

    return changes;
  }
}

module.exports = new ProductChangeDetector();
