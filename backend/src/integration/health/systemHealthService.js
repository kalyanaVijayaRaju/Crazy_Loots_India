const readinessService = require('../readiness/readinessService');
const telegramHealthService = require('../../telegramPublishing/health/telegramHealthService');
const publishingModeManager = require('../../telegramPublishing/mode/publishingModeManager');

class SystemHealthService {
  async getFullHealthReport() {
    const readiness = await readinessService.checkReadiness();
    const telegramHealth = await telegramHealthService.getHealthStatus();

    return {
      status: readiness.ready ? 'HEALTHY' : 'DEGRADED',
      readiness,
      telegramHealth,
      publishingMode: publishingModeManager.getMode(),
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new SystemHealthService();
