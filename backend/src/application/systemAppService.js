const { systemHealthService, diagnosticsService } = require('../integration');
const featureFlags = require('../telegramPublishing/mode/featureFlags');
const publishingModeManager = require('../telegramPublishing/mode/publishingModeManager');

/**
 * System Application Service
 * Exposes system status, version, configuration, and feature flags
 */
class SystemAppService {
  async getStatus() {
    const health = await systemHealthService.getFullHealthReport();
    return {
      appName: 'Crazy Loots India',
      status: health.status,
      health,
      timestamp: new Date().toISOString(),
    };
  }

  async getVersion() {
    return {
      appName: 'Crazy Loots India',
      version: '1.0.0',
      phase: 16,
      phaseName: 'Application Layer & REST API Platform',
      nodeVersion: process.version,
      gitCommit: process.env.GIT_COMMIT || 'latest',
      environment: process.env.NODE_ENV || 'development',
      buildDate: new Date().toISOString(),
    };
  }

  async getConfiguration() {
    const diagnostics = await diagnosticsService.generateDiagnostics();
    return {
      environment: diagnostics.nodeEnv,
      publishingMode: diagnostics.publishingMode,
      logLevel: process.env.LOG_LEVEL || 'info',
      apiPrefix: process.env.API_PREFIX || '/api/v1',
      port: process.env.PORT || 5000,
    };
  }

  async getFeatureFlags() {
    return {
      publishingMode: publishingModeManager.getMode(),
      flags: featureFlags.getFlags(),
    };
  }
}

module.exports = new SystemAppService();
