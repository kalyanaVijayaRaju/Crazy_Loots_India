const startupManager = require('../startup/startupManager');
const readinessService = require('../readiness/readinessService');
const { merchantFactory } = require('../../merchants');
const publishingModeManager = require('../../telegramPublishing/mode/publishingModeManager');
const logger = require('../../utils/logger');

class SmokeTester {
  async runSmokeTests() {
    logger.info('[SmokeTester] Starting platform smoke tests...');
    const results = [];

    // 1. Startup Test
    const startRes = await startupManager.initialize();
    results.push({ name: 'Startup Sequence', passed: startRes.initialized });

    // 2. Readiness Check
    const readiness = await readinessService.checkReadiness();
    results.push({ name: 'Subsystem Readiness', passed: readiness.ready });

    // 3. Merchant Adapter Test
    let hasAmazon = false;
    try {
      hasAmazon = Boolean(merchantFactory.getAdapter('amazon'));
    } catch (_e) {
      hasAmazon = false;
    }
    results.push({ name: 'Amazon Merchant Registration', passed: hasAmazon });

    // 4. Publishing Mode Test
    const isDryRun = publishingModeManager.isDryRun();
    results.push({ name: 'Default DRY_RUN Mode', passed: isDryRun });

    const allPassed = results.every((r) => r.passed);
    logger.info(`[SmokeTester] Smoke tests completed. All passed: ${allPassed}`);

    return {
      allPassed,
      results,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new SmokeTester();
