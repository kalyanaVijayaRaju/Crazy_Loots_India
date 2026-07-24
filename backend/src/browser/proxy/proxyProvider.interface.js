/**
 * Abstract ProxyProvider Interface
 */
class ProxyProviderInterface {
  constructor(name = 'AbstractProxyProvider') {
    if (this.constructor === ProxyProviderInterface) {
      throw new Error('ProxyProviderInterface is an abstract class.');
    }
    this._name = name;
  }

  name() {
    return this._name;
  }

  async getProxy(_context) {
    throw new Error(`Method 'getProxy()' must be implemented by ${this.name()}`);
  }
}

module.exports = ProxyProviderInterface;
