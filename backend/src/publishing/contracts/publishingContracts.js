class PublishingContracts {
  /**
   * Verify contract compliance for a PublishingPackage instance
   * @param {Object} pkg - PublishingPackage object
   * @returns {boolean} true if compliant
   */
  verifyPackageContract(pkg) {
    if (!pkg) {
      return false;
    }
    const requiredProps = [
      'packageId',
      'product',
      'deal',
      'affiliateUrl',
      'shortUrl',
      'images',
      'renderedMessages',
      'seoMetadata',
      'analyticsMetadata',
      'validationResults',
    ];
    for (const prop of requiredProps) {
      if (pkg[prop] === undefined) {
        return false;
      }
    }
    return true;
  }

  /**
   * Verify contract compliance for an AffiliateProvider instance
   * @param {Object} provider
   * @returns {boolean} true if compliant
   */
  verifyAffiliateProviderContract(provider) {
    if (!provider) {
      return false;
    }
    const methods = ['generateAffiliateLink', 'validateAffiliateLink', 'healthCheck', 'getProviderName', 'supportsMerchant'];
    for (const method of methods) {
      if (typeof provider[method] !== 'function') {
        return false;
      }
    }
    return true;
  }
}

module.exports = new PublishingContracts();
