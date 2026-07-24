const QueueInterface = require('./queue.interface');
const logger = require('../../utils/logger');

class MemoryQueue extends QueueInterface {
  constructor(name = 'memory-queue') {
    super(name);
    this.items = [];
  }

  async enqueue(item, options = {}) {
    if (item === undefined || item === null) {
      throw new Error('Cannot enqueue null or undefined item.');
    }
    const entry = {
      id: options.id || item.id || item.productId || item.correlationId || String(Date.now()),
      data: item,
      enqueuedAt: new Date().toISOString(),
      priority: options.priority || 40,
    };

    this.items.push(entry);
    logger.debug(`[MemoryQueue:${this.name}] Enqueued item '${entry.id}' (Total size: ${this.items.length})`);
    return entry;
  }

  async dequeue() {
    if (this.items.length === 0) {
      return null;
    }
    const entry = this.items.shift();
    logger.debug(`[MemoryQueue:${this.name}] Dequeued item '${entry.id}' (Remaining: ${this.items.length})`);
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
    const removedCount = initialSize - this.items.length;
    return removedCount > 0;
  }

  async clear() {
    this.items = [];
    logger.debug(`[MemoryQueue:${this.name}] Queue cleared.`);
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

module.exports = MemoryQueue;
