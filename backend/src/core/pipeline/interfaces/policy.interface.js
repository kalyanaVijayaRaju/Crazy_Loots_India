/**
 * PolicyInterface
 */
class PolicyInterface {
  constructor(name) {
    if (this.constructor === PolicyInterface) {
      throw new Error('PolicyInterface is an abstract class.');
    }
    this._name = name || this.constructor.name;
  }

  name() {
    return this._name;
  }

  /**
   * Evaluate policy against context/data
   * @param {Object} _context
   * @returns {Promise<Object>} Policy evaluation result
   */
  async evaluate(_context) {
    throw new Error(`Method 'evaluate()' must be implemented by ${this.name()}`);
  }
}

module.exports = PolicyInterface;
