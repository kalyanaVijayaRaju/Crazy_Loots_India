/**
 * Abstract Queue Interface Contract
 * Enforces uniform interface for Memory, Priority, or future Redis Queue implementations.
 */
class QueueInterface {
  constructor(name = 'default') {
    if (this.constructor === QueueInterface) {
      throw new Error('QueueInterface is an abstract interface and cannot be instantiated directly.');
    }
    this.name = name;
  }

  getName() {
    return this.name;
  }

  async enqueue(_item, _options = {}) {
    throw new Error(`Method 'enqueue()' must be implemented by ${this.constructor.name}.`);
  }

  async dequeue() {
    throw new Error(`Method 'dequeue()' must be implemented by ${this.constructor.name}.`);
  }

  async peek() {
    throw new Error(`Method 'peek()' must be implemented by ${this.constructor.name}.`);
  }

  async remove(_itemIdOrPredicate) {
    throw new Error(`Method 'remove()' must be implemented by ${this.constructor.name}.`);
  }

  async clear() {
    throw new Error(`Method 'clear()' must be implemented by ${this.constructor.name}.`);
  }

  async contains(_itemIdOrPredicate) {
    throw new Error(`Method 'contains()' must be implemented by ${this.constructor.name}.`);
  }

  async size() {
    throw new Error(`Method 'size()' must be implemented by ${this.constructor.name}.`);
  }

  async isEmpty() {
    throw new Error(`Method 'isEmpty()' must be implemented by ${this.constructor.name}.`);
  }
}

module.exports = QueueInterface;
