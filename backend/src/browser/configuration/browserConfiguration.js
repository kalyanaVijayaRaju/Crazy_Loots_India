const environmentProvider = require('../../core/pipeline/providers/environmentProvider');

class BrowserConfiguration {
  constructor(overrides = {}) {
    this.headless = overrides.headless !== undefined ? Boolean(overrides.headless) : environmentProvider.get('BROWSER_HEADLESS', true);
    this.viewport = overrides.viewport || { width: 1280, height: 800 };
    this.locale = overrides.locale || 'en-IN';
    this.timezone = overrides.timezone || 'Asia/Kolkata';
    this.userAgent =
      overrides.userAgent ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    this.timeout = overrides.timeout || 30000;
    this.navigationTimeout = overrides.navigationTimeout || 30000;
    this.maxBrowsers = overrides.maxBrowsers || 2;
    this.maxContexts = overrides.maxContexts || 5;
    this.maxPages = overrides.maxPages || 10;
    this.retryCount = overrides.retryCount || 3;
    this.slowMo = overrides.slowMo || 0;
    this.proxyEnabled = overrides.proxyEnabled || false;
    this.screenshotOnFailure = overrides.screenshotOnFailure !== undefined ? Boolean(overrides.screenshotOnFailure) : true;

    Object.freeze(this);
  }

  static defaultConfig() {
    return new BrowserConfiguration();
  }
}

module.exports = BrowserConfiguration;
