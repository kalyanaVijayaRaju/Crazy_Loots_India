const PublishingStrategyInterface = require('./publishingStrategy.interface');
const telegramClientFactory = require('../client/telegramClientFactory');
const logger = require('../../utils/logger');

class ImmediatePublishingStrategy extends PublishingStrategyInterface {
  constructor() {
    super('immediate');
  }

  async execute(publishingTask, context = {}) {
    const client = telegramClientFactory.getClient();
    const { targetChannel, renderedMessage, images } = context;

    logger.info(`[ImmediatePublishingStrategy] Executing immediate publish for task '${publishingTask.taskId}' to channel '${targetChannel.channelId}'`);

    if (images && images.socialPreview) {
      return client.sendPhoto(targetChannel.channelId, images.socialPreview, renderedMessage, { parse_mode: 'Markdown' });
    }
    return client.sendMessage(targetChannel.channelId, renderedMessage, { parse_mode: 'Markdown' });
  }
}

module.exports = ImmediatePublishingStrategy;
