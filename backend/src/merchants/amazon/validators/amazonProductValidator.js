const logger = require('../../../utils/logger');

class AmazonProductValidator {
  /**
   * Validate extracted ProductDTO or Product object for completeness and consistency
   * @param {Object} product - Extracted product object
   * @returns {Object} { valid: boolean, errors: Array<string> }
   */
  validate(product) {
    const errors = [];

    if (!product) {
      return { valid: false, errors: ['Product object is null or undefined'] };
    }

    if (!product.productId || typeof product.productId !== 'string' || product.productId.trim().length === 0) {
      errors.push('Missing or invalid ASIN / productId');
    }

    if (!product.title || typeof product.title !== 'string' || product.title.trim().length < 3) {
      errors.push('Missing or invalid product title');
    }

    if (typeof product.currentPrice !== 'number' || isNaN(product.currentPrice) || product.currentPrice <= 0) {
      errors.push(`Invalid selling price: ${product.currentPrice}`);
    }

    if (product.originalPrice && (typeof product.originalPrice !== 'number' || product.originalPrice < product.currentPrice)) {
      // Auto-correct originalPrice if smaller than currentPrice
      product.originalPrice = product.currentPrice;
    }

    if (product.rating && (typeof product.rating !== 'number' || product.rating < 0 || product.rating > 5)) {
      errors.push(`Invalid rating value: ${product.rating}`);
    }

    if (!product.image || typeof product.image !== 'string' || !product.image.startsWith('http')) {
      errors.push('Missing or invalid product image URL');
    }

    const isValid = errors.length === 0;
    if (!isValid) {
      logger.warn(`[AmazonProductValidator] Product validation failed for '${product.productId || 'UNKNOWN'}': ${errors.join(', ')}`);
    }

    return {
      valid: isValid,
      errors,
    };
  }
}

module.exports = new AmazonProductValidator();
