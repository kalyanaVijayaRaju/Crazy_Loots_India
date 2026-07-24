class TelegramClientInterface {
  constructor(name) {
    if (new.target === TelegramClientInterface) {
      throw new Error('Cannot instantiate abstract class TelegramClientInterface directly.');
    }
    this.name = name;
  }

  async sendMessage(_channelId, _text, _options = {}) {
    throw new Error(`Method 'sendMessage()' must be implemented by ${this.constructor.name}`);
  }

  async editMessage(_channelId, _messageId, _text, _options = {}) {
    throw new Error(`Method 'editMessage()' must be implemented by ${this.constructor.name}`);
  }

  async deleteMessage(_channelId, _messageId) {
    throw new Error(`Method 'deleteMessage()' must be implemented by ${this.constructor.name}`);
  }

  async sendPhoto(_channelId, _photoUrl, _caption = '', _options = {}) {
    throw new Error(`Method 'sendPhoto()' must be implemented by ${this.constructor.name}`);
  }

  async sendMediaGroup(_channelId, _mediaArray = [], _options = {}) {
    throw new Error(`Method 'sendMediaGroup()' must be implemented by ${this.constructor.name}`);
  }

  async healthCheck() {
    throw new Error(`Method 'healthCheck()' must be implemented by ${this.constructor.name}`);
  }
}

module.exports = TelegramClientInterface;
