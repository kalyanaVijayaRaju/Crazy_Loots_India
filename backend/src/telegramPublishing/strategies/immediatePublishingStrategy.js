const PublishingStrategyInterface = require('./publishingStrategy.interface');
const telegramClientFactory = require('../client/telegramClientFactory');
const featureFlags = require('../mode/featureFlags');
const logger = require('../../utils/logger');

class ImmediatePublishingStrategy extends PublishingStrategyInterface {
  constructor() {
    super('immediate');
  }

  async execute(publishingTask, context = {}) {
    const client = telegramClientFactory.getClient();
    const { targetChannel, renderedMessage, images } = context;

    const photoEnabled = featureFlags.isEnabled('ENABLE_PHOTO_PUBLISHING');
    const hasPhoto = Boolean(images && images.socialPreview);

    logger.info(
      `[ImmediatePublishingStrategy] Executing immediate publish for task '${publishingTask.taskId}' ` +
      `to channel '${targetChannel.channelId}' [Client: '${client.constructor.name}', PhotoEnabled: ${photoEnabled}]`
    );

    if (photoEnabled && hasPhoto && !context.forceTextMessage) {
      try {
        logger.info(`[ImmediatePublishingStrategy] Dispatching via sendPhoto for task '${publishingTask.taskId}'`);
        return await client.sendPhoto(targetChannel.channelId, images.socialPreview, renderedMessage, { parse_mode: 'Markdown' });
      } catch (photoErr) {
        logger.warn(
          `[ImmediatePublishingStrategy] sendPhoto failed for task '${publishingTask.taskId}': ${photoErr.message}. ` +
          `Falling back to sendMessage.`
        );
      }
    }

    logger.info(`[ImmediatePublishingStrategy] Dispatching via sendMessage for task '${publishingTask.taskId}'`);
    return client.sendMessage(targetChannel.channelId, renderedMessage, { parse_mode: 'Markdown' });
  }
}

module.exports = ImmediatePublishingStrategy;
