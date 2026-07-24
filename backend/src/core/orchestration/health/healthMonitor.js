const executorRegistry = require('../registry/executorRegistry');
const memoryScheduler = require('../scheduler/memoryScheduler');
const queueManager = require('../../queue/queueManager');
const eventBus = require('../../events/eventBus');
const lifecycleManager = require('../../lifecycle/lifecycleManager');
const { merchantRegistry } = require('../../../merchants');

class HealthMonitor {
  async healthCheck() {
    const checks = {};

    try {
      const stats = await queueManager.getStats();
      checks.queue = { status: 'HEALTHY', stats };
    } catch (err) {
      checks.queue = { status: 'UNHEALTHY', error: err.message };
    }

    try {
      checks.executors = await executorRegistry.healthCheck();
    } catch (err) {
      checks.executors = { status: 'UNHEALTHY', error: err.message };
    }

    try {
      checks.scheduler = await memoryScheduler.healthCheck();
    } catch (err) {
      checks.scheduler = { status: 'UNHEALTHY', error: err.message };
    }

    try {
      checks.merchantRegistry = {
        status: 'HEALTHY',
        registeredCount: merchantRegistry.listSupported().length,
      };
    } catch (err) {
      checks.merchantRegistry = { status: 'UNHEALTHY', error: err.message };
    }

    try {
      checks.eventBus = {
        status: 'HEALTHY',
        registeredEventTypes: eventBus.getRegisteredEvents().length,
      };
    } catch (err) {
      checks.eventBus = { status: 'UNHEALTHY', error: err.message };
    }

    try {
      checks.lifecycle = {
        status: 'HEALTHY',
        isInitialized: lifecycleManager.isInitialized,
      };
    } catch (err) {
      checks.lifecycle = { status: 'UNHEALTHY', error: err.message };
    }

    const allHealthy = Object.values(checks).every((c) => c.status === 'HEALTHY');

    return {
      status: allHealthy ? 'HEALTHY' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      components: checks,
    };
  }
}

module.exports = new HealthMonitor();
