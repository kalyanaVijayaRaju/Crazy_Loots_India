/**
 * Base ProviderInterface Contract
 */
class ProviderInterface {
  constructor(name) {
    if (this.constructor === ProviderInterface) {
      throw new Error('ProviderInterface is an abstract class.');
    }
    this._name = name || this.constructor.name;
  }

  name() {
    return this._name;
  }
}

module.exports = ProviderInterface;
