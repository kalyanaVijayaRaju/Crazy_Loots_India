const featureFlags = require('../../telegramPublishing/mode/featureFlags');
const publishingModeManager = require('../../telegramPublishing/mode/publishingModeManager');
const systemHealthService = require('../health/systemHealthService');

class DiagnosticsService {
  async generateDiagnostics() {
    const health = await systemHealthService.getFullHealthReport();

    return {
      version: '1.0.0',
      nodeEnv: process.env.NODE_ENV || 'development',
      publishingMode: publishingModeManager.getMode(),
      featureFlags: featureFlags.getFlags(),
      health,
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new DiagnosticsService();
