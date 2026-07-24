const ProxyProviderInterface = require('./proxyProvider.interface');

class NoProxyProvider extends ProxyProviderInterface {
  constructor() {
    super('NoProxyProvider');
  }

  async getProxy(_context) {
    return null;
  }
}

module.exports = new NoProxyProvider();
