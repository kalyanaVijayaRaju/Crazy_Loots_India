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

  /**
   * Truncate caption for sendPhoto (Telegram limit: 1024 chars)
   * @param {string} caption
   * @param {number} maxLen
   * @returns {string}
   */
  truncateCaption(caption, maxLen = 1024) {
    if (!caption || typeof caption !== 'string') {
      return '';
    }
    if (caption.length <= maxLen) {
      return caption;
    }
    return `${caption.slice(0, maxLen - 4).trim()}...`;
  }

  /**
   * Truncate message text for sendMessage (Telegram limit: 4096 chars)
   * @param {string} text
   * @param {number} maxLen
   * @returns {string}
   */
  truncateMessage(text, maxLen = 4096) {
    if (!text || typeof text !== 'string') {
      return '';
    }
    if (text.length <= maxLen) {
      return text;
    }
    return `${text.slice(0, maxLen - 4).trim()}...`;
  }
}

module.exports = new TelegramFormatter();
