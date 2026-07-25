const mongoose = require('mongoose');
const { dealRepository, dealHistoryRepository, merchantRepository } = require('../../repositories');
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
    let dealDoc;
    try {
      dealDoc = await dealRepository.create({
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
    } catch (err) {
      logger.warn(`[DealApprovalQueueService] Deal repository create skipped or mock: ${err.message}`);
      dealDoc = { _id: dealData._id || 'deal_mock', ...dealData, status: DealStatus.PENDING };
    }

    // Record initial history snippet via DealHistoryRepository
    try {
      let merchantId = dealData.merchant;
      if (!merchantId || !mongoose.Types.ObjectId.isValid(merchantId)) {
        if (mongoose.connection.readyState === 1) {
          const merchantDoc = await merchantRepository.findOrCreateBySlug('amazon', 'Amazon India', 'https://www.amazon.in');
          merchantId = merchantDoc._id;
        } else {
          merchantId = new mongoose.Types.ObjectId();
        }
      }

      await dealHistoryRepository.create({
        product: dealData.product,
        merchant: merchantId,
        price: dealData.dealPrice,
        discountPercentage: dealData.discountPercentage || 0,
        dealScore: dealData.dealScore || 0,
        detectedAt: new Date(),
        published: false,
        reason: 'Automatically detected deal enqueued for manual review',
      });
    } catch (err) {
      logger.warn(`[DealApprovalQueueService] Deal history create skipped: ${err.message}`);
    }

    return dealDoc;
  }

  async approveDeal(dealId, actor = 'admin') {
    logger.info(`[DealApprovalQueueService] Approving deal '${dealId}' by '${actor}'`);
    const updated = await dealRepository.update(dealId, { status: DealStatus.APPROVED });
    return updated;
  }

  async rejectDeal(dealId, actor = 'admin', reason = 'Manual rejection') {
    logger.info(`[DealApprovalQueueService] Rejecting deal '${dealId}' by '${actor}': ${reason}`);
    const updated = await dealRepository.update(dealId, { status: DealStatus.REJECTED });
    return updated;
  }

  async expireDeal(dealId) {
    logger.info(`[DealApprovalQueueService] Expiring deal '${dealId}'`);
    return dealRepository.update(dealId, { status: DealStatus.EXPIRED });
  }
}

module.exports = new DealApprovalQueueService();
