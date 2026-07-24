class AmazonProductValidator {
  validate(productDTO) {
    const errors = [];
    const warnings = [];

    if (!productDTO.title || productDTO.title.trim().length === 0) {
      errors.push('Product title is missing or empty.');
    }

    if (typeof productDTO.currentPrice !== 'number' || productDTO.currentPrice < 0) {
      errors.push('Invalid current price: must be a non-negative number.');
    }

    if (!productDTO.image || productDTO.image.trim().length === 0) {
      warnings.push('Product image URL is missing.');
    }

    if (!productDTO.productId || productDTO.productId.length !== 10) {
      errors.push(`Invalid ASIN: expected 10 characters, got '${productDTO.productId}'`);
    }

    if (productDTO.currentPrice === 0) {
      warnings.push('Current price evaluated to 0.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

module.exports = new AmazonProductValidator();
