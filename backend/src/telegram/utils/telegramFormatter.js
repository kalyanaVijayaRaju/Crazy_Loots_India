/**
 * Telegram Formatting & Escaping Utility
 */
class TelegramFormatter {
  /**
   * Escape legacy Telegram Markdown control characters in dynamic user/scraped text
   * @param {string} text
   * @returns {string}
   */
  escapeMarkdown(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }
    // In legacy Telegram Markdown, special formatting characters are *, _, `, [
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\*/g, '\\*')
      .replace(/_/g, '\\_')
      .replace(/`/g, '\\`')
      .replace(/\[/g, '\\[');
  }

  /**
   * Truncate long titles safely while preserving word boundaries
   * @param {string} title
   * @param {number} maxLen
   * @returns {string}
   */
  truncateTitle(title, maxLen = 120) {
    if (!title || typeof title !== 'string') {
      return 'Loot Deal Product';
    }
    const clean = title.trim();
    if (clean.length <= maxLen) {
      return clean;
    }
    return `${clean.slice(0, maxLen - 3).trim()}...`;
  }
}

module.exports = new TelegramFormatter();
