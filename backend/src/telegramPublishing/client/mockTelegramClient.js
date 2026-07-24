const TelegramClientInterface = require('./telegramClient.interface');
const logger = require('../../utils/logger');

class MockTelegramClient extends TelegramClientInterface {
  constructor() {
    super('mock_telegram_client');
    this.messageIdCounter = 1000;
    this.sentMessages = [];
    this.editedMessages = [];
    this.deletedMessages = [];
  }

  async sendMessage(channelId, text, _options = {}) {
    this.messageIdCounter += 1;
    const msgId = this.messageIdCounter;
    const record = { channelId, text, messageId: msgId, timestamp: new Date() };
    this.sentMessages.push(record);
    logger.debug(`[MockTelegramClient] [DRY_RUN/SANDBOX] Sent message to '${channelId}' (Message ID: ${msgId})`);
    return { ok: true, result: { message_id: msgId, chat: { id: channelId }, text } };
  }

  async editMessage(channelId, messageId, text, _options = {}) {
    const record = { channelId, messageId, text, timestamp: new Date() };
    this.editedMessages.push(record);
    logger.debug(`[MockTelegramClient] [DRY_RUN/SANDBOX] Edited message ${messageId} on channel '${channelId}'`);
    return { ok: true, result: { message_id: messageId, chat: { id: channelId }, text, edit_date: Math.floor(Date.now() / 1000) } };
  }

  async deleteMessage(channelId, messageId) {
    const record = { channelId, messageId, timestamp: new Date() };
    this.deletedMessages.push(record);
    logger.debug(`[MockTelegramClient] [DRY_RUN/SANDBOX] Deleted message ${messageId} on channel '${channelId}'`);
    return { ok: true, result: true };
  }

  async sendPhoto(channelId, photoUrl, caption = '', _options = {}) {
    this.messageIdCounter += 1;
    const msgId = this.messageIdCounter;
    logger.debug(`[MockTelegramClient] [DRY_RUN/SANDBOX] Sent photo to '${channelId}' (Message ID: ${msgId})`);
    return { ok: true, result: { message_id: msgId, chat: { id: channelId }, caption } };
  }

  async sendMediaGroup(channelId, mediaArray = [], _options = {}) {
    this.messageIdCounter += 1;
    const msgId = this.messageIdCounter;
    logger.debug(`[MockTelegramClient] [DRY_RUN/SANDBOX] Sent media group (${mediaArray.length} items) to '${channelId}'`);
    return { ok: true, result: [{ message_id: msgId, chat: { id: channelId } }] };
  }

  async healthCheck() {
    return { status: 'HEALTHY', client: this.name, dryRun: true };
  }
}

module.exports = MockTelegramClient;
