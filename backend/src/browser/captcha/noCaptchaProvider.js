const CaptchaProviderInterface = require('./captchaProvider.interface');

class NoCaptchaProvider extends CaptchaProviderInterface {
  constructor() {
    super('NoCaptchaProvider');
  }

  async solve(_page, _context = {}) {
    return { solved: false, reason: 'Captcha solving disabled' };
  }
}

module.exports = new NoCaptchaProvider();
