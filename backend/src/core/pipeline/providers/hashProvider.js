const crypto = require('crypto');
const ProviderInterface = require('../interfaces/provider.interface');

class HashProvider extends ProviderInterface {
  constructor() {
    super('HashProvider');
  }

  md5(input) {
    return crypto.createHash('md5').update(String(input)).digest('hex');
  }

  sha256(input) {
    return crypto.createHash('sha256').update(String(input)).digest('hex');
  }
}

module.exports = new HashProvider();
