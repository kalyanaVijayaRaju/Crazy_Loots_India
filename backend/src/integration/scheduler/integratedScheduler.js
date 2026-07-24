const logger = require('../../utils/logger');

class IntegratedScheduler {
  constructor() {
    this.activeJobs = new Map();
    this.paused = false;
  }

  scheduleTask(taskId, intervalSeconds, jobFn) {
    if (this.activeJobs.has(taskId)) {
      this.cancelTask(taskId);
    }

    const timer = setInterval(() => {
      if (!this.paused) {
        logger.debug(`[IntegratedScheduler] Executing scheduled task '${taskId}'`);
        jobFn().catch((err) => logger.error(`[IntegratedScheduler] Task '${taskId}' failed: ${err.message}`));
      }
    }, intervalSeconds * 1000);

    this.activeJobs.set(taskId, timer);
    logger.info(`[IntegratedScheduler] Scheduled task '${taskId}' every ${intervalSeconds}s`);
  }

  cancelTask(taskId) {
    const timer = this.activeJobs.get(taskId);
    if (timer) {
      clearInterval(timer);
      this.activeJobs.delete(taskId);
      logger.info(`[IntegratedScheduler] Cancelled scheduled task '${taskId}'`);
    }
  }

  pause() {
    this.paused = true;
    logger.info('[IntegratedScheduler] Scheduler paused.');
  }

  resume() {
    this.paused = false;
    logger.info('[IntegratedScheduler] Scheduler resumed.');
  }

  shutdown() {
    for (const taskId of this.activeJobs.keys()) {
      this.cancelTask(taskId);
    }
    logger.info('[IntegratedScheduler] Scheduler shutdown completed.');
  }
}

module.exports = new IntegratedScheduler();
