const BaseRepository = require('./base.repository');
const Merchant = require('../models/merchant.model');
const { MerchantStatus } = require('../constants/enums');

class MerchantRepository extends BaseRepository {
  constructor() {
    super(Merchant);
  }

  async findBySlug(slug) {
    return this.findOne({ slug: slug.toLowerCase().trim() });
  }

  async findOrCreateBySlug(slug = 'amazon', name = 'Amazon India', website = 'https://www.amazon.in') {
    const cleanSlug = slug.toLowerCase().trim();
    let merchant = await this.findBySlug(cleanSlug);
    if (!merchant) {
      merchant = await this.create({
        name,
        slug: cleanSlug,
        website,
        affiliateSupported: true,
        priority: 100,
        status: MerchantStatus.ACTIVE,
      });
    }
    return merchant;
  }

  async findActiveMerchants() {
    return this.findMany({ status: MerchantStatus.ACTIVE }, { sort: { priority: -1 } });
  }
}

module.exports = new MerchantRepository();
