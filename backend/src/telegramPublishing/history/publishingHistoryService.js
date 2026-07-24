const { telegramPostRepository } = require('../../repositories');
const logger = require('../../utils/logger');

class PublishingHistoryService {
  /**
   * Persist a completed publishing record into DB via TelegramPostRepository
   * @param {Object} record
   * @returns {Promise<Object>} Persisted document or log
   */
  async recordPublishing(record) {
    logger.info(`[PublishingHistoryService] Persisting publishing history for package '${record.packageId}'`);
    if (record.dealId && record.telegramMessageId) {
      try {
        return await telegramPostRepository.create({
          telegramMessageId: record.telegramMessageId,
          channelId: record.channelId,
          deal: record.dealId,
          postedAt: record.postedAt || new Date(),
        });
      } catch (err) {
        logger.warn(`[PublishingHistoryService] Repository write skipped or warning: ${err.message}`);
      }
    }
    return { id: `hist_${Date.now()}`, ...record };
  }
}

module.exports = new PublishingHistoryService();
