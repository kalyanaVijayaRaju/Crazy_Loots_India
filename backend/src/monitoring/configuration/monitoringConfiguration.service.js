const { monitoringConfigurationRepository } = require('../../repositories');
const logger = require('../../utils/logger');

class MonitoringConfigurationService {
  async getDueConfigurations(limit = 50) {
    return monitoringConfigurationRepository.findDueConfigurations(limit);
  }

  async getByProduct(productId) {
    return monitoringConfigurationRepository.findByProduct(productId);
  }

  async scheduleNextRun(configId, intervalSeconds = 3600) {
    const nextRun = new Date(Date.now() + intervalSeconds * 1000);
    logger.debug(`[MonitoringConfigurationService] Scheduling next run for '${configId}' at ${nextRun.toISOString()}`);
    return monitoringConfigurationRepository.update(configId, {
      lastRun: new Date(),
      nextRun,
    });
  }

  async pause(configId) {
    logger.info(`[MonitoringConfigurationService] Pausing configuration '${configId}'`);
    return monitoringConfigurationRepository.update(configId, { enabled: false });
  }

  async resume(configId) {
    logger.info(`[MonitoringConfigurationService] Resuming configuration '${configId}'`);
    return monitoringConfigurationRepository.update(configId, { enabled: true, nextRun: new Date() });
  }
}

module.exports = new MonitoringConfigurationService();
