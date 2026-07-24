const amazonAsinExtractor = require('./amazonAsinExtractor');

class AmazonUrlNormalizer {
  /**
   * Normalize any raw Amazon URL to a canonical product URL
   * @param {string} rawUrl
   * @returns {string} Canonical URL e.g. https://www.amazon.in/dp/B08N5WRWNW
   */
  normalize(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
      throw new Error('AmazonUrlNormalizer requires a valid URL string.');
    }
    const asin = amazonAsinExtractor.extract(rawUrl);
    if (!asin) {
      throw new Error(`Could not extract valid ASIN from URL '${rawUrl}'`);
    }
    return `https://www.amazon.in/dp/${asin}`;
  }
}

module.exports = new AmazonUrlNormalizer();
