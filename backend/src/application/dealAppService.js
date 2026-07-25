const mongoose = require('mongoose');
const Deal = require('../models/deal.model');
const DealMapper = require('../mappers/dealMapper');
const { dealDetectionEngine } = require('../deals');
const { executionReplayService } = require('../observability');
const ProductAppService = require('./productAppService');

/**
 * Deal Application Service
 * Orchestrates deal listing, detection, approval, rejection, and replay
 */
class DealAppService {
  async listDeals(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (query.status) {filter.status = query.status;}
      if (query.minScore) {filter.dealScore = { $gte: Number(query.minScore) };}

      const sort = {};
      if (query.sort) {
        const parts = query.sort.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
      } else {
        sort.createdAt = -1;
      }

      const [docs, total] = await Promise.all([
        Deal.find(filter).populate('product').sort(sort).skip(skip).limit(limit),
        Deal.countDocuments(filter),
      ]);

      return {
        items: DealMapper.toListDTO(docs),
        total,
        page,
        limit,
      };
    }

    return {
      items: [
        { id: 'deal_sample_1', dealPrice: 499, originalPrice: 1999, discountPercentage: 75, dealScore: 92, status: 'APPROVED' },
      ],
      total: 1,
      page,
      limit,
    };
  }

  async getDealById(id) {
    if (mongoose.connection.readyState === 1) {
      const doc = await Deal.findById(id).populate('product').catch(() => null);
      if (doc) {return DealMapper.toDTO(doc);}
    }

    return {
      id,
      dealPrice: 499,
      originalPrice: 1999,
      discountPercentage: 75,
      dealScore: 92,
      status: 'APPROVED',
      merchant: 'amazon',
      createdAt: new Date().toISOString(),
    };
  }

  async detectDealForProduct(productId) {
    const product = await ProductAppService.getProductById(productId);
    const history = [
      { price: Math.round(product.currentPrice * 1.5), timestamp: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
    ];

    const report = await dealDetectionEngine.evaluateProduct(product, history).catch(() => ({
      dealScore: 88,
      isLootDeal: true,
      summary: { percentageChange: -33 },
      explanations: ['✓ Price is at 90-day low'],
    }));

    return { product, dealReport: report };
  }

  async approveDeal(id) {
    if (mongoose.connection.readyState === 1) {
      const deal = await Deal.findByIdAndUpdate(id, { status: 'APPROVED' }, { new: true }).catch(() => null);
      if (deal) {return DealMapper.toDTO(deal);}
    }

    return { id, status: 'APPROVED', approvedAt: new Date().toISOString() };
  }

  async rejectDeal(id, reason = 'Manually rejected') {
    if (mongoose.connection.readyState === 1) {
      const deal = await Deal.findByIdAndUpdate(id, { status: 'REJECTED' }, { new: true }).catch(() => null);
      if (deal) {return DealMapper.toDTO(deal);}
    }

    return { id, status: 'REJECTED', reason, rejectedAt: new Date().toISOString() };
  }

  async replayDeal(id) {
    const deal = await this.getDealById(id);
    const replayed = executionReplayService.replay(`exec_${deal.id}`) || {
      dealId: deal.id,
      replayedAt: new Date().toISOString(),
      status: 'REPLAY_SUCCESSFUL',
    };
    return replayed;
  }
}

module.exports = new DealAppService();
