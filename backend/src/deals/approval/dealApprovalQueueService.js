const { dealRepository, dealHistoryRepository } = require('../../repositories');
const { DealStatus } = require('../../constants/enums');
const logger = require('../../utils/logger');

class DealApprovalQueueService {
  /**
   * Enqueue a newly detected deal into approval queue as PENDING
   * @param {Object} dealData
   * @returns {Promise<Object>} Persisted Deal document
   */
  async enqueueDeal(dealData) {
    logger.info(`[DealApprovalQueueService] Enqueuing deal for product '${dealData.product}' as PENDING`);
    const dealDoc = await dealRepository.create({
      product: dealData.product,
      dealPrice: dealData.dealPrice,
      originalPrice: dealData.originalPrice,
      discountPercentage: dealData.discountPercentage,
      couponDiscount: dealData.couponDiscount || 0,
      bankOffer: dealData.bankOffer || '',
      shippingCharge: dealData.shippingCharge || 0,
      dealScore: dealData.dealScore || 0,
      dealType: dealData.dealType || 'PRICE_DROP',
      status: DealStatus.PENDING,
    });

    // Record initial history snippet via DealHistoryRepository
    await dealHistoryRepository.create({
      deal: dealDoc._id,
      action: 'ENQUEUED',
      actor: 'DealDetectionEngine',
      previousStatus: null,
      newStatus: DealStatus.PENDING,
      comment: 'Automatically detected deal enqueued for manual review',
      timestamp: new Date(),
    });

    return dealDoc;
  }

  async approveDeal(dealId, actor = 'admin') {
    logger.info(`[DealApprovalQueueService] Approving deal '${dealId}' by '${actor}'`);
    const updated = await dealRepository.update(dealId, { status: DealStatus.APPROVED });
    await dealHistoryRepository.create({
      deal: dealId,
      action: 'APPROVED',
      actor,
      previousStatus: DealStatus.PENDING,
      newStatus: DealStatus.APPROVED,
      comment: 'Deal manually approved',
      timestamp: new Date(),
    });
    return updated;
  }

  async rejectDeal(dealId, actor = 'admin', reason = 'Manual rejection') {
    logger.info(`[DealApprovalQueueService] Rejecting deal '${dealId}' by '${actor}': ${reason}`);
    const updated = await dealRepository.update(dealId, { status: DealStatus.REJECTED });
    await dealHistoryRepository.create({
      deal: dealId,
      action: 'REJECTED',
      actor,
      previousStatus: DealStatus.PENDING,
      newStatus: DealStatus.REJECTED,
      comment: reason,
      timestamp: new Date(),
    });
    return updated;
  }

  async expireDeal(dealId) {
    logger.info(`[DealApprovalQueueService] Expiring deal '${dealId}'`);
    return dealRepository.update(dealId, { status: DealStatus.EXPIRED });
  }
}

module.exports = new DealApprovalQueueService();
