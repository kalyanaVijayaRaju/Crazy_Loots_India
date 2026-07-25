const PublishingStrategyInterface = require('./publishingStrategy.interface');
const telegramClientFactory = require('../client/telegramClientFactory');
const featureFlags = require('../mode/featureFlags');
const telegramFormatter = require('../../telegram/utils/telegramFormatter');
const dealCardBannerGenerator = require('../../publishing/images/dealCardBannerGenerator');
const logger = require('../../utils/logger');

class ImmediatePublishingStrategy extends PublishingStrategyInterface {
  constructor() {
    super('immediate');
  }

  async execute(publishingTask, context = {}) {
    const client = telegramClientFactory.getClient();
    const { targetChannel, renderedMessage, images, product } = context;

    const photoEnabled = featureFlags.isEnabled('ENABLE_PHOTO_PUBLISHING');
    const hasPhoto = Boolean((images && images.socialPreview) || product);

    logger.info(
      `[ImmediatePublishingStrategy] Executing immediate publish for task '${publishingTask.taskId}' ` +
      `to channel '${targetChannel.channelId}' [Client: '${client.constructor.name}', PhotoEnabled: ${photoEnabled}]`
    );

    if (photoEnabled && hasPhoto && !context.forceTextMessage) {
      try {
        const safeCaption = telegramFormatter.truncateCaption(renderedMessage, 1024);
        let photoPayload = images ? images.socialPreview : null;

        if (product) {
          try {
            const cardBanner = await dealCardBannerGenerator.generateCardBanner(product);
            if (cardBanner) {
              photoPayload = cardBanner;
            }
          } catch (bannerErr) {
            logger.warn(`[ImmediatePublishingStrategy] Custom card banner generation fallback: ${bannerErr.message}`);
          }
        }

        logger.info(`[ImmediatePublishingStrategy] Dispatching via sendPhoto for task '${publishingTask.taskId}'`);
        return await client.sendPhoto(targetChannel.channelId, photoPayload, safeCaption, { parse_mode: 'Markdown' });
      } catch (photoErr) {
        logger.warn(
          `[ImmediatePublishingStrategy] sendPhoto failed for task '${publishingTask.taskId}': ${photoErr.message}. ` +
          `Falling back to sendMessage.`
        );
      }
    }

    const safeText = telegramFormatter.truncateMessage(renderedMessage, 4096);
    logger.info(`[ImmediatePublishingStrategy] Dispatching via sendMessage for task '${publishingTask.taskId}'`);
    return client.sendMessage(targetChannel.channelId, safeText, { parse_mode: 'Markdown' });
  }
}

module.exports = ImmediatePublishingStrategy;
