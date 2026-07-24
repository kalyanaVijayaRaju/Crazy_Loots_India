const ShortUrlProviderInterface = require('./shortUrlProvider.interface');

class TinyUrlProvider extends ShortUrlProviderInterface {
  constructor() {
    super('tinyurl');
  }

  async shortenUrl(url) {
    const hash = Buffer.from(url).toString('hex').substring(0, 6);
    return `https://tinyurl.com/${hash}`;
  }
}

module.exports = TinyUrlProvider;
