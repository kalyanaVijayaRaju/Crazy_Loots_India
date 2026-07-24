const crypto = require('crypto');
const ProviderInterface = require('../interfaces/provider.interface');

class RandomProvider extends ProviderInterface {
  constructor() {
    super('RandomProvider');
  }

  randomFloat() {
    return Math.random();
  }

  randomInt(min, max) {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
  }

  randomBytes(size = 16) {
    return crypto.randomBytes(size).toString('hex');
  }
}

module.exports = new RandomProvider();
