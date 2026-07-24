class ContentValidator {
  /**
   * Validate deal and rendered message before publishing package creation
   * @param {Object} deal
   * @param {Object} product
   * @param {string} affiliateUrl
   * @param {Object} renderedMessages
   * @returns {Object} { valid: boolean, errors: [], warnings: [] }
   */
  validate(deal, product, affiliateUrl, renderedMessages) {
    const errors = [];
    const warnings = [];

    // 1. Approval status check
    if (deal.status !== 'APPROVED' && deal.status !== 'PENDING') {
      errors.push(`Deal status must be APPROVED or PENDING, got '${deal.status}'`);
    }

    // 2. Title check
    if (!product.title || product.title.trim().length === 0) {
      errors.push('Product title is missing.');
    }

    // 3. Price check
    const price = deal.dealPrice || product.currentPrice;
    if (typeof price !== 'number' || price <= 0) {
      errors.push(`Invalid deal price: ${price}`);
    }

    // 4. Affiliate URL check
    if (!affiliateUrl || typeof affiliateUrl !== 'string' || !affiliateUrl.startsWith('http')) {
      errors.push('Affiliate URL is missing or invalid.');
    }

    // 5. Rendered Telegram message check
    if (!renderedMessages || !renderedMessages.telegram) {
      errors.push('Rendered Telegram message payload is missing.');
    } else if (renderedMessages.telegram.length > 4096) {
      errors.push('Telegram message exceeds maximum character limit (4096).');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

module.exports = new ContentValidator();
