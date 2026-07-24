const SchedulerInterface = require('./scheduler.interface');
const timeProvider = require('../../pipeline/providers/timeProvider');
const logger = require('../../../utils/logger');

class MemoryScheduler extends SchedulerInterface {
  constructor() {
    super('MemoryScheduler');
    this.scheduledTasks = new Map();
    this.paused = false;
  }

  async schedule(task, options = {}) {
    if (!task || !task.taskId) {
      throw new Error('MemoryScheduler requires a valid task with taskId.');
    }
    if (this.paused) {
      logger.warn(`[MemoryScheduler] Scheduler paused. Task '${task.taskId}' enqueued in paused state.`);
    }

    const entry = {
      task,
      options,
      scheduledAt: timeProvider.iso(),
      status: this.paused ? 'PAUSED' : 'SCHEDULED',
    };

    this.scheduledTasks.set(task.taskId, entry);
    logger.debug(`[MemoryScheduler] Scheduled task '${task.taskId}' (Total scheduled: ${this.scheduledTasks.size})`);
    return entry;
  }

  async cancel(taskId) {
    const deleted = this.scheduledTasks.delete(taskId);
    if (deleted) {
      logger.debug(`[MemoryScheduler] Cancelled task '${taskId}'`);
    }
    return deleted;
  }

  async pause() {
    this.paused = true;
    for (const entry of this.scheduledTasks.values()) {
      if (entry.status === 'SCHEDULED') {
        entry.status = 'PAUSED';
      }
    }
    logger.info('[MemoryScheduler] Scheduler paused.');
  }

  async resume() {
    this.paused = false;
    for (const entry of this.scheduledTasks.values()) {
      if (entry.status === 'PAUSED') {
        entry.status = 'SCHEDULED';
      }
    }
    logger.info('[MemoryScheduler] Scheduler resumed.');
  }

  async shutdown() {
    this.scheduledTasks.clear();
    this.paused = false;
    logger.info('[MemoryScheduler] Scheduler shutdown completed.');
  }

  async healthCheck() {
    return {
      status: 'HEALTHY',
      scheduler: this.name(),
      paused: this.paused,
      scheduledTasksCount: this.scheduledTasks.size,
    };
  }
}

module.exports = new MemoryScheduler();
