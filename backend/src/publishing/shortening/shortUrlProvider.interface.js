class ShortUrlProviderInterface {
  constructor(name) {
    if (new.target === ShortUrlProviderInterface) {
      throw new Error('Cannot instantiate abstract class ShortUrlProviderInterface directly.');
    }
    this.name = name;
  }

  async shortenUrl(_url) {
    throw new Error(`Method 'shortenUrl()' must be implemented by ${this.constructor.name}`);
  }

  getProviderName() {
    return this.name;
  }
}

module.exports = ShortUrlProviderInterface;
