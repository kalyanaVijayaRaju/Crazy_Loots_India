const PriorityQueue = require('./priorityQueue');
const logger = require('../../utils/logger');

class QueueManager {
  constructor() {
    this.queues = new Map();
    // Default main monitoring priority queue
    this.registerQueue('monitoring', new PriorityQueue('monitoring'));
  }

  /**
   * Register a new queue instance
   * @param {string} name
   * @param {QueueInterface} queue
   */
  registerQueue(name, queue) {
    if (!name || typeof name !== 'string') {
      throw new Error('QueueManager requires a valid queue name.');
    }
    this.queues.set(name.toLowerCase().trim(), queue);
    logger.debug(`[QueueManager] Registered queue '${name}' (${queue.constructor.name})`);
  }

  /**
   * Get queue instance by name
   * @param {string} [name='monitoring']
   * @returns {QueueInterface}
   */
  getQueue(name = 'monitoring') {
    const key = name.toLowerCase().trim();
    const queue = this.queues.get(key);
    if (!queue) {
      // Auto-create PriorityQueue if not found
      const newQueue = new PriorityQueue(key);
      this.registerQueue(key, newQueue);
      return newQueue;
    }
    return queue;
  }

  /**
   * Enqueue item into named queue with duplicate prevention check
   * @param {Object} item
   * @param {Object} [options]
   * @param {string} [options.queueName='monitoring']
   * @param {boolean} [options.preventDuplicate=true]
   */
  async enqueue(item, options = {}) {
    const queueName = options.queueName || 'monitoring';
    const queue = this.getQueue(queueName);
    const itemId = options.id || item.id || item.productId || item.correlationId;

    if (options.preventDuplicate !== false && itemId) {
      const exists = await queue.contains(itemId);
      if (exists) {
        logger.warn(`[QueueManager:${queueName}] Duplicate item '${itemId}' rejected from enqueuing.`);
        return null;
      }
    }

    return queue.enqueue(item, options);
  }

  /**
   * Dequeue item from named queue
   * @param {string} [queueName='monitoring']
   */
  async dequeue(queueName = 'monitoring') {
    const queue = this.getQueue(queueName);
    return queue.dequeue();
  }

  /**
   * Get combined statistics across all registered queues
   * @returns {Promise<Object>}
   */
  async getStats() {
    const stats = {};
    for (const [name, queue] of this.queues.entries()) {
      stats[name] = {
        type: queue.constructor.name,
        size: await queue.size(),
        isEmpty: await queue.isEmpty(),
      };
    }
    return stats;
  }

  /**
   * Clear all queues
   */
  async clearAll() {
    for (const queue of this.queues.values()) {
      await queue.clear();
    }
    logger.debug('[QueueManager] All queues cleared.');
  }
}

module.exports = new QueueManager();
