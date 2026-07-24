const ShortUrlProviderInterface = require('./shortUrlProvider.interface');

class InternalShortenerProvider extends ShortUrlProviderInterface {
  constructor() {
    super('internal');
  }

  async shortenUrl(_url) {
    const idProvider = require('../../core/pipeline/providers/idProvider');
    const slug = idProvider.generateTaskId().substring(0, 8);
    return `https://loots.in/${slug}`;
  }
}

module.exports = InternalShortenerProvider;
