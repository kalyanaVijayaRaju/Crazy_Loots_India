class PublishingStrategyInterface {
  constructor(name) {
    if (new.target === PublishingStrategyInterface) {
      throw new Error('Cannot instantiate abstract class PublishingStrategyInterface directly.');
    }
    this.name = name;
  }

  async execute(_publishingTask, _context = {}) {
    throw new Error(`Method 'execute()' must be implemented by ${this.constructor.name}`);
  }

  getStrategyName() {
    return this.name;
  }
}

module.exports = PublishingStrategyInterface;
