/**
 * Abstract CaptchaProvider Interface
 */
class CaptchaProviderInterface {
  constructor(name = 'AbstractCaptchaProvider') {
    if (this.constructor === CaptchaProviderInterface) {
      throw new Error('CaptchaProviderInterface is an abstract class.');
    }
    this._name = name;
  }

  name() {
    return this._name;
  }

  async solve(_page, _context = {}) {
    throw new Error(`Method 'solve()' must be implemented by ${this.name()}`);
  }
}

module.exports = CaptchaProviderInterface;
