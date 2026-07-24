const { merchantFactory } = require('../../merchants');
const publishingModeManager = require('../../telegramPublishing/mode/publishingModeManager');

class ReadinessService {
  async checkReadiness() {
    let hasAmazon = false;
    try {
      hasAmazon = Boolean(merchantFactory.getAdapter('amazon'));
    } catch (_e) {
      hasAmazon = false;
    }

    const checks = {
      merchantRegistry: hasAmazon,
      publishingMode: Boolean(publishingModeManager.getMode()),
      environment: Boolean(process.env.NODE_ENV || 'development'),
    };

    const isReady = Object.values(checks).every(Boolean);
    return {
      ready: isReady,
      checks,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new ReadinessService();
