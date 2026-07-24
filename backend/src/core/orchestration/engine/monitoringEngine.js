const MonitoringCoordinator = require('../coordinator/monitoringCoordinator');
const MonitoringTask = require('../../pipeline/tasks/monitoringTask');
const logger = require('../../../utils/logger');
const memoryMetrics = require('../../metrics/memoryMetrics');

class MonitoringEngine {
  constructor() {
    this.coordinator = new MonitoringCoordinator('engine-coordinator');
  }

  /**
   * Process monitoring task
   * @param {MonitoringTask|Object} rawTask
   * @returns {Promise<MonitoringResult>}
   */
  async processTask(rawTask) {
    let task = rawTask;
    if (!(rawTask instanceof MonitoringTask)) {
      task = new MonitoringTask.Builder()
        .setMerchant(rawTask.merchant)
        .setProductId(rawTask.productId)
        .setPriority(rawTask.priority)
        .setStrategy(rawTask.strategy)
        .setMetadata(rawTask.metadata)
        .build();
    }

    logger.info(`[MonitoringEngine] Processing monitoring task '${task.taskId}' (${task.merchant} / ${task.productId})`);
    memoryMetrics.increment('tasksEnqueued');

    const result = await this.coordinator.orchestrate(task);
    return result;
  }
}

module.exports = new MonitoringEngine();
