class HtmlSanitizer {
  sanitize(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }

    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove inline style blocks
      .replace(/csrf[a-z0-9_-]*=["'][^"']*["']/gi, '') // Remove CSRF tokens
      .replace(/session-id=["'][^"']*["']/gi, '') // Remove session IDs
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .trim();
  }
}

module.exports = new HtmlSanitizer();
