const amazonAsinExtractor = require('./amazonAsinExtractor');

class AmazonUrlValidator {
  constructor() {
    this.domainRegex = /(?:amazon\.in|amzn\.to|amazon\.com)/i;
  }

  validate(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, reason: 'URL must be a non-empty string.' };
    }

    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      return { valid: false, reason: 'URL must start with HTTP/HTTPS protocol.' };
    }

    if (!this.domainRegex.test(url)) {
      return { valid: false, reason: 'URL is not a recognized Amazon domain.' };
    }

    const asin = amazonAsinExtractor.extract(url);
    if (!asin || !amazonAsinExtractor.validate(asin)) {
      return { valid: false, reason: 'URL does not contain a valid 10-character ASIN.' };
    }

    return { valid: true, asin };
  }
}

module.exports = new AmazonUrlValidator();
