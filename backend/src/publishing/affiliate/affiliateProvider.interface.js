class AffiliateProviderInterface {
  constructor(name) {
    if (new.target === AffiliateProviderInterface) {
      throw new Error('Cannot instantiate abstract class AffiliateProviderInterface directly.');
    }
    this.name = name;
  }

  async generateAffiliateLink(_productUrl, _merchant) {
    throw new Error(`Method 'generateAffiliateLink()' must be implemented by ${this.constructor.name}`);
  }

  async validateAffiliateLink(_affiliateUrl) {
    throw new Error(`Method 'validateAffiliateLink()' must be implemented by ${this.constructor.name}`);
  }

  async healthCheck() {
    throw new Error(`Method 'healthCheck()' must be implemented by ${this.constructor.name}`);
  }

  getProviderName() {
    return this.name;
  }

  supportsMerchant(_merchant) {
    throw new Error(`Method 'supportsMerchant()' must be implemented by ${this.constructor.name}`);
  }
}

module.exports = AffiliateProviderInterface;
