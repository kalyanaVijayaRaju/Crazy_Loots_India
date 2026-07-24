const browserRegistry = require('../registry/browserRegistry');
const browserManager = require('../browserManager/browserManager');

class BrowserHealthMonitor {
  async healthCheck() {
    const stats = browserRegistry.getStats();
    const isConnected = browserManager.currentBrowser
      ? Boolean(browserManager.currentBrowser.isConnected ? browserManager.currentBrowser.isConnected() : true)
      : true;

    return {
      status: isConnected ? 'HEALTHY' : 'DEGRADED',
      browserConnected: isConnected,
      activeBrowsers: stats.activeBrowsers,
      activeContexts: stats.activeContexts,
      activePages: stats.activePages,
      restartCount: browserManager.restartCount,
    };
  }
}

module.exports = new BrowserHealthMonitor();
