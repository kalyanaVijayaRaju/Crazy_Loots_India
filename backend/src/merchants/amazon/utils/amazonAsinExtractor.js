class AmazonAsinExtractor {
  constructor() {
    this.asinRegex = /(?:dp|gp\/product|ASIN)\/([A-Z0-9]{10})/i;
    this.standaloneAsinRegex = /\b([B0-9][A-Z0-9]{9})\b/i;
  }

  /**
   * Extract 10-character ASIN from URL or raw text
   * @param {string} input
   * @returns {string|null}
   */
  extract(input) {
    if (!input || typeof input !== 'string') {
      return null;
    }

    const match = input.match(this.asinRegex);
    if (match && match[1]) {
      return match[1].toUpperCase();
    }

    const standaloneMatch = input.match(this.standaloneAsinRegex);
    if (standaloneMatch && standaloneMatch[1] && standaloneMatch[1].length === 10) {
      return standaloneMatch[1].toUpperCase();
    }

    return null;
  }

  validate(asin) {
    if (!asin || typeof asin !== 'string') {
      return false;
    }
    return /^[A-Z0-9]{10}$/.test(asin.trim().toUpperCase());
  }
}

module.exports = new AmazonAsinExtractor();
