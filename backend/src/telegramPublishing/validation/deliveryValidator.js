class DeliveryValidator {
  /**
   * Validate a publishing task before dispatch
   * @param {Object} publishingPackage
   * @param {Object} channelConfig
   * @returns {Object} { valid: boolean, errors: [], warnings: [] }
   */
  validate(publishingPackage, channelConfig) {
    const errors = [];
    const warnings = [];

    if (!publishingPackage) {
      return { valid: false, errors: ['PublishingPackage is missing.'], warnings: [] };
    }

    if (!publishingPackage.deal || (publishingPackage.deal.status !== 'APPROVED' && publishingPackage.deal.status !== 'PENDING')) {
      errors.push('Deal must be in APPROVED or PENDING status to publish.');
    }

    if (!publishingPackage.affiliateUrl || !publishingPackage.affiliateUrl.startsWith('http')) {
      errors.push('Affiliate URL is missing or invalid.');
    }

    if (!publishingPackage.renderedMessages || !publishingPackage.renderedMessages.telegram) {
      errors.push('Rendered Telegram message is missing.');
    }

    if (!channelConfig || !channelConfig.channelId) {
      errors.push('Target Telegram channel configuration is missing.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

module.exports = new DeliveryValidator();
