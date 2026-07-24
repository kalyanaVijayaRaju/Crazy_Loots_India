/**
 * Telegram Publishing Engine Event Type Constants
 */
module.exports = Object.freeze({
  PUBLISHING_QUEUED: 'telegram_publishing:queued',
  PUBLISHING_STARTED: 'telegram_publishing:started',
  PUBLISHING_SUCCEEDED: 'telegram_publishing:succeeded',
  PUBLISHING_FAILED: 'telegram_publishing:failed',
  PUBLISHING_RETRIED: 'telegram_publishing:retried',
  PUBLISHING_CANCELLED: 'telegram_publishing:cancelled',
  PUBLISHING_EXPIRED: 'telegram_publishing:expired',
  PUBLISHING_ROLLED_BACK: 'telegram_publishing:rolled_back',
});
