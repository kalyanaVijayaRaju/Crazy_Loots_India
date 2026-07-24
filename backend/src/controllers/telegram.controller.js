const { telegramService } = require('../telegram');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Send message to Telegram Channel
 * @route   POST /api/v1/telegram/send
 * @access  Public (or protected in production)
 */
const sendTelegramMessage = asyncHandler(async (req, res) => {
  const { message, parseMode } = req.body;

  if (message === undefined || message === null) {
    throw ApiError.badRequest('Message is required');
  }

  if (typeof message !== 'string') {
    throw ApiError.badRequest('Message must be a string');
  }

  if (message.trim() === '') {
    throw ApiError.badRequest('Message cannot be empty');
  }

  const result = await telegramService.sendMessage(message.trim(), parseMode || null);

  return ApiResponse.success(res, 'Telegram message sent successfully', {
    messageId: result?.message_id,
    chatId: result?.chat?.id,
  });
});

module.exports = {
  sendTelegramMessage,
};
