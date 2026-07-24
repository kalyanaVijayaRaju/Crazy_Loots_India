class LinkResolver {
  /**
   * Resolve link hierarchy properties into a single mapping object
   * @param {string} originalUrl
   * @param {string} affiliateUrl
   * @param {string} shortUrl
   * @returns {Object} { originalUrl, affiliateUrl, shortUrl, resolvedUrl, canonicalUrl }
   */
  resolve(originalUrl, affiliateUrl = null, shortUrl = null) {
    const orig = originalUrl ? originalUrl.trim() : '';
    const cleanCanonical = orig.split('?')[0];
    const aff = affiliateUrl || orig;
    const short = shortUrl || aff;

    return {
      originalUrl: orig,
      affiliateUrl: aff,
      shortUrl: short,
      resolvedUrl: aff,
      canonicalUrl: cleanCanonical,
    };
  }
}

module.exports = new LinkResolver();
