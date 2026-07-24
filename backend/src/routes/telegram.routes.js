const express = require('express');
const { sendTelegramMessage } = require('../controllers/telegram.controller');

const router = express.Router();

/**
 * @route   POST /api/v1/telegram/send
 * @desc    Send custom message to Telegram channel
 */
router.post('/send', sendTelegramMessage);

module.exports = router;
