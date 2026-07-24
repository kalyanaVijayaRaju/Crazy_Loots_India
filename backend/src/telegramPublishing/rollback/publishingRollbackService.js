const telegramClientFactory = require('../client/telegramClientFactory');
const logger = require('../../utils/logger');

class PublishingRollbackService {
  /**
   * Delete or edit a published Telegram message for rollback
   * @param {string} channelId
   * @param {number} messageId
   * @param {string} mode - 'DELETE' | 'EDIT'
   * @param {string} fallbackText
   * @returns {Promise<Object>} Rollback result
   */
  async rollbackMessage(channelId, messageId, mode = 'DELETE', fallbackText = '<s>[DEAL EXPIRED]</s>') {
    const client = telegramClientFactory.getClient();
    logger.info(`[PublishingRollbackService] Executing ${mode} rollback for message ${messageId} on channel '${channelId}'`);

    if (mode === 'DELETE') {
      return client.deleteMessage(channelId, messageId);
    }
    return client.editMessage(channelId, messageId, fallbackText, { parse_mode: 'HTML' });
  }
}

module.exports = new PublishingRollbackService();
