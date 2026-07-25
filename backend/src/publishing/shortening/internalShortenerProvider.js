const ShortUrlProviderInterface = require('./shortUrlProvider.interface');

class InternalShortenerProvider extends ShortUrlProviderInterface {
  constructor() {
    super('internal');
  }

  async shortenUrl(url) {
    if (url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    const idProvider = require('../../core/pipeline/providers/idProvider');
    const slug = idProvider.generateTaskId().substring(0, 8);
    return `https://www.amazon.in/dp/${slug}`;
  }
}

module.exports = InternalShortenerProvider;
