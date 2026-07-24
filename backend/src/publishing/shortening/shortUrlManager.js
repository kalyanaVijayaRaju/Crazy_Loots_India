const InternalShortenerProvider = require('./internalShortenerProvider');
const BitlyProvider = require('./bitlyProvider');
const TinyUrlProvider = require('./tinyUrlProvider');
const logger = require('../../utils/logger');

class ShortUrlManager {
  constructor() {
    this.providers = new Map();
    this.providers.set('internal', new InternalShortenerProvider());
    this.providers.set('bitly', new BitlyProvider());
    this.providers.set('tinyurl', new TinyUrlProvider());
    this.defaultProviderKey = 'internal';
  }

  async shorten(url, providerKey = 'internal') {
    const provider = this.providers.get(providerKey) || this.providers.get(this.defaultProviderKey);
    logger.debug(`[ShortUrlManager] Shortening URL via provider '${provider.getProviderName()}'`);
    return provider.shortenUrl(url);
  }
}

module.exports = new ShortUrlManager();
