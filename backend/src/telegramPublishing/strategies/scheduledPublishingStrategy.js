const PublishingStrategyInterface = require('./publishingStrategy.interface');
const telegramClientFactory = require('../client/telegramClientFactory');
const logger = require('../../utils/logger');

class ScheduledPublishingStrategy extends PublishingStrategyInterface {
  constructor() {
    super('scheduled');
  }

  async execute(publishingTask, context = {}) {
    const client = telegramClientFactory.getClient();
    const { targetChannel, renderedMessage } = context;

    logger.info(`[ScheduledPublishingStrategy] Executing scheduled publish for task '${publishingTask.taskId}'`);
    return client.sendMessage(targetChannel.channelId, renderedMessage, { parse_mode: 'Markdown' });
  }
}

module.exports = ScheduledPublishingStrategy;
