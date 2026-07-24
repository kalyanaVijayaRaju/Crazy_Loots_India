const QueueInterface = require('./queue.interface');
const { PriorityLevels } = require('../priority/priority.constants');
const logger = require('../../utils/logger');

class PriorityQueue extends QueueInterface {
  constructor(name = 'priority-queue') {
    super(name);
    this.items = [];
  }

  /**
   * Helper to normalize priority name string or number
   */
  resolvePriority(priority) {
    if (typeof priority === 'number') {
      return priority;
    }
    if (typeof priority === 'string' && PriorityLevels[priority.toUpperCase()]) {
      return PriorityLevels[priority.toUpperCase()];
    }
    return PriorityLevels.NORMAL;
  }

  async enqueue(item, options = {}) {
    if (item === undefined || item === null) {
      throw new Error('Cannot enqueue null or undefined item.');
    }
    const priorityVal = this.resolvePriority(options.priority || item.priority);
    const entry = {
      id: options.id || item.id || item.productId || item.correlationId || String(Date.now()),
      data: item,
      priority: priorityVal,
      enqueuedAt: new Date().toISOString(),
    };

    this.items.push(entry);
    // Sort descending by priority (higher priority value at front)
    this.items.sort((a, b) => b.priority - a.priority);

    logger.debug(
      `[PriorityQueue:${this.name}] Enqueued item '${entry.id}' with priority ${entry.priority} (Size: ${this.items.length})`
    );
    return entry;
  }

  async dequeue() {
    if (this.items.length === 0) {
      return null;
    }
    const entry = this.items.shift();
    logger.debug(`[PriorityQueue:${this.name}] Dequeued top priority item '${entry.id}' (Priority: ${entry.priority})`);
    return entry.data;
  }

  async peek() {
    return this.items.length > 0 ? this.items[0].data : null;
  }

  async remove(itemIdOrPredicate) {
    const initialSize = this.items.length;
    if (typeof itemIdOrPredicate === 'function') {
      this.items = this.items.filter((entry) => !itemIdOrPredicate(entry.data));
    } else {
      this.items = this.items.filter((entry) => entry.id !== itemIdOrPredicate && entry.data !== itemIdOrPredicate);
    }
    return this.items.length < initialSize;
  }

  async clear() {
    this.items = [];
    logger.debug(`[PriorityQueue:${this.name}] Priority queue cleared.`);
  }

  async contains(itemIdOrPredicate) {
    if (typeof itemIdOrPredicate === 'function') {
      return this.items.some((entry) => itemIdOrPredicate(entry.data));
    }
    return this.items.some((entry) => entry.id === itemIdOrPredicate || entry.data === itemIdOrPredicate);
  }

  async size() {
    return this.items.length;
  }

  async isEmpty() {
    return this.items.length === 0;
  }
}

module.exports = PriorityQueue;
