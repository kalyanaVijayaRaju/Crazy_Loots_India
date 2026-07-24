const AmazonAssociatesProvider = require('../providers/amazonAssociatesProvider');
const AdmitadProvider = require('../providers/admitadProvider');
const CuelinksProvider = require('../providers/cuelinksProvider');
const EarnKaroProvider = require('../providers/earnKaroProvider');
const ImpactProvider = require('../providers/impactProvider');
const logger = require('../../utils/logger');

class AffiliateManager {
  constructor() {
    this.providers = new Map();

    const amazonProv = new AmazonAssociatesProvider();
    const admitadProv = new AdmitadProvider();
    const cuelinksProv = new CuelinksProvider();
    const earnKaroProv = new EarnKaroProvider();
    const impactProv = new ImpactProvider();

    this.providers.set('amazon_associates', amazonProv);
    this.providers.set('admitad', admitadProv);
    this.providers.set('cuelinks', cuelinksProv);
    this.providers.set('earnkaro', earnKaroProv);
    this.providers.set('impact', impactProv);
  }

  getProviderForMerchant(merchant) {
    const key = String(merchant).toLowerCase();
    if (key === 'amazon') {
      return this.providers.get('amazon_associates');
    }
    return this.providers.get('cuelinks') || this.providers.get('admitad');
  }

  async generateLink(productUrl, merchant) {
    const provider = this.getProviderForMerchant(merchant);
    if (!provider) {
      logger.warn(`[AffiliateManager] No suitable affiliate provider found for merchant '${merchant}'. Returning original URL.`);
      return productUrl;
    }
    logger.debug(`[AffiliateManager] Generating affiliate link via provider '${provider.getProviderName()}'`);
    return provider.generateAffiliateLink(productUrl, merchant);
  }
}

module.exports = new AffiliateManager();
