const logger = require('../../utils/logger');

class PublishingQueue {
  constructor() {
    this.queue = [];
    this.paused = false;
  }

  enqueue(publishingTask, priority = 50) {
    publishingTask.priority = priority;
    publishingTask.enqueuedAt = new Date().toISOString();
    this.queue.push(publishingTask);
    this.queue.sort((a, b) => b.priority - a.priority);
    logger.debug(`[PublishingQueue] Enqueued task '${publishingTask.taskId || publishingTask.id}' with priority ${priority}. Queue size: ${this.queue.length}`);
    return publishingTask;
  }

  dequeue() {
    if (this.paused || this.queue.length === 0) {
      return null;
    }
    return this.queue.shift();
  }

  pause() {
    this.paused = true;
    logger.info('[PublishingQueue] Publishing queue paused.');
  }

  resume() {
    this.paused = false;
    logger.info('[PublishingQueue] Publishing queue resumed.');
  }

  cancel(taskId) {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter((item) => (item.taskId || item.id) !== taskId);
    const removed = initialLength > this.queue.length;
    if (removed) {
      logger.info(`[PublishingQueue] Cancelled publishing task '${taskId}'`);
    }
    return removed;
  }

  clear() {
    this.queue = [];
    logger.info('[PublishingQueue] Cleared publishing queue.');
  }

  size() {
    return this.queue.length;
  }

  isPaused() {
    return this.paused;
  }
}

module.exports = new PublishingQueue();
