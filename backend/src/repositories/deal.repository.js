const BaseRepository = require('./base.repository');
const Deal = require('../models/deal.model');
const { DealStatus } = require('../constants/enums');

class DealRepository extends BaseRepository {
  constructor() {
    super(Deal);
  }

  async findPendingDeals(limit = 50) {
    return this.findMany(
      { status: DealStatus.PENDING },
      { sort: { dealScore: -1, createdAt: 1 }, limit }
    );
  }

  async findApprovedDeals(limit = 20) {
    return this.findMany(
      { status: DealStatus.APPROVED },
      { sort: { dealScore: -1 }, limit }
    );
  }

  async updateStatus(dealId, status) {
    return this.update(dealId, { status });
  }

  async markPublished(dealId, telegramPostId) {
    return this.update(dealId, {
      status: DealStatus.PUBLISHED,
      publishedAt: new Date(),
      telegramPostId,
    });
  }
}

module.exports = new DealRepository();
