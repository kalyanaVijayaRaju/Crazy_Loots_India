const browserRegistry = require('../registry/browserRegistry');
const clockProvider = require('../../core/pipeline/providers/clockProvider');

class BrowserMetrics {
  constructor() {
    this.navigationDurations = [];
    this.startTime = Date.now();
  }

  recordNavigation(durationMs) {
    this.navigationDurations.push(durationMs);
    if (this.navigationDurations.length > 50) {
      this.navigationDurations.shift();
    }
  }

  getMetrics() {
    const regStats = browserRegistry.getStats();
    const sum = this.navigationDurations.reduce((a, b) => a + b, 0);
    const avgNav = this.navigationDurations.length ? Math.round(sum / this.navigationDurations.length) : 0;

    return {
      activeBrowsers: regStats.activeBrowsers,
      activeContexts: regStats.activeContexts,
      activePages: regStats.activePages,
      averageNavigationMs: avgNav,
      uptimeSeconds: Math.round(clockProvider.uptime()),
    };
  }
}

module.exports = new BrowserMetrics();
