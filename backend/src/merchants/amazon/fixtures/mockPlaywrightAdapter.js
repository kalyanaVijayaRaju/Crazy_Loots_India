const fixtureManager = require('./fixtureManager');
const logger = require('../../../utils/logger');

class MockPlaywrightAdapter {
  constructor() {
    this.fixtureManager = fixtureManager;
  }

  async createPageFromFixture(fixtureName = 'normal-product') {
    const htmlContent = this.fixtureManager.loadFixture(fixtureName);
    logger.debug(`[MockPlaywrightAdapter] Created mock page from fixture '${fixtureName}'`);

    return {
      _isMockFixture: true,
      html: htmlContent,
      url: () => 'https://www.amazon.in/dp/B08N5WRWNW',
      content: async () => htmlContent,
      $: async (selector) => {
        if (htmlContent.includes(selector.replace('#', 'id="').replace('.', 'class="'))) {
          return { textContent: async () => 'mock-text' };
        }
        return null;
      },
      screenshot: async () => Buffer.from('mock-fixture-screenshot'),
      close: async () => true,
    };
  }
}

module.exports = new MockPlaywrightAdapter();
