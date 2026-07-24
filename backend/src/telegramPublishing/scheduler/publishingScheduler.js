const publishingQueue = require('../queue/publishingQueue');
const logger = require('../../utils/logger');

class PublishingScheduler {
  scheduleTask(publishingTask, publishAtDate) {
    const delayMs = new Date(publishAtDate).getTime() - Date.now();
    if (delayMs <= 0) {
      publishingQueue.enqueue(publishingTask, publishingTask.priority || 50);
      return { scheduled: false, immediate: true };
    }

    setTimeout(() => {
      logger.info(`[PublishingScheduler] Triggering scheduled task '${publishingTask.taskId}'`);
      publishingQueue.enqueue(publishingTask, publishingTask.priority || 50);
    }, delayMs);

    logger.info(`[PublishingScheduler] Scheduled task '${publishingTask.taskId}' for execution in ${Math.round(delayMs / 1000)}s`);
    return { scheduled: true, publishAt: publishAtDate };
  }
}

module.exports = new PublishingScheduler();
