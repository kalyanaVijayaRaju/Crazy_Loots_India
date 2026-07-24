const startupManager = require('../startup/startupManager');
const lifecycleManager = require('../lifecycle/lifecycleManager');
const logger = require('../../utils/logger');

class SystemOrchestrator {
  async start() {
    logger.info('[SystemOrchestrator] Starting System Orchestrator...');
    const initRes = await startupManager.initialize();
    return {
      status: 'ONLINE',
      initialized: initRes.initialized,
      startedAt: new Date().toISOString(),
    };
  }

  async stop() {
    logger.info('[SystemOrchestrator] Stopping System Orchestrator...');
    return lifecycleManager.shutdown();
  }
}

module.exports = new SystemOrchestrator();
