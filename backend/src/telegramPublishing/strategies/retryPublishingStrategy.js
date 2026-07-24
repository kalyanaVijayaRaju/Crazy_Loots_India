const PublishingStrategyInterface = require('./publishingStrategy.interface');
const telegramClientFactory = require('../client/telegramClientFactory');
const logger = require('../../utils/logger');

class RetryPublishingStrategy extends PublishingStrategyInterface {
  constructor() {
    super('retry');
  }

  async execute(publishingTask, context = {}) {
    const client = telegramClientFactory.getClient();
    const { targetChannel, renderedMessage } = context;

    logger.info(`[RetryPublishingStrategy] Executing retry publish attempt #${publishingTask.retryCount || 1} for task '${publishingTask.taskId}'`);
    return client.sendMessage(targetChannel.channelId, renderedMessage, { parse_mode: 'Markdown' });
  }
}

module.exports = RetryPublishingStrategy;
