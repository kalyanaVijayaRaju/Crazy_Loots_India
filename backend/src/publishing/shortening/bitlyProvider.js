const ShortUrlProviderInterface = require('./shortUrlProvider.interface');

class BitlyProvider extends ShortUrlProviderInterface {
  constructor() {
    super('bitly');
  }

  async shortenUrl(url) {
    const hash = Buffer.from(url).toString('base64').substring(0, 7);
    return `https://bit.ly/${hash}`;
  }
}

module.exports = BitlyProvider;
