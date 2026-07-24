const memoryMetrics = require('../../metrics/memoryMetrics');
const queueManager = require('../../queue/queueManager');
const executorRegistry = require('../registry/executorRegistry');
const { merchantRegistry } = require('../../../merchants');

class StatisticsService {
  async getStatistics() {
    const rawMetrics = memoryMetrics.getMetrics();
    const queueStats = await queueManager.getStats();

    return {
      timestamp: new Date().toISOString(),
      queue: queueStats,
      pipeline: {
        executions: rawMetrics.counters.pipelineExecutions || 0,
        successes: rawMetrics.counters.pipelineSuccesses || 0,
        failures: rawMetrics.counters.pipelineFailures || 0,
        latency: rawMetrics.durations.pipelineDuration || { avgMs: 0 },
      },
      executors: {
        supported: executorRegistry.listSupported(),
        activeCount: executorRegistry.listSupported().length,
      },
      merchant: {
        count: merchantRegistry.listSupported().length,
        supportedMerchants: merchantRegistry.listSupported(),
      },
      task: {
        totalEnqueued: rawMetrics.counters.tasksEnqueued || 0,
        totalProcessed: rawMetrics.counters.tasksProcessed || 0,
      },
      events: {
        emitted: rawMetrics.counters.eventsEmitted || 0,
      },
      retries: {
        totalRetries: rawMetrics.counters.totalRetries || 0,
      },
      execution: {
        metrics: rawMetrics,
      },
    };
  }
}

module.exports = new StatisticsService();
