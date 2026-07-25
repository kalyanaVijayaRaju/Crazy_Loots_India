const express = require('express');
const telegramController = require('../../controllers/telegram.controller');

const router = express.Router();

router.post('/test', (req, res, next) => telegramController.sendTestMessage(req, res, next));
router.post('/dry-run', (req, res, next) => telegramController.runDryRun(req, res, next));
router.get('/channels', (req, res, next) => telegramController.getChannels(req, res, next));
router.get('/history', (req, res, next) => telegramController.getHistory(req, res, next));
router.post('/send', (req, res, next) => telegramController.sendTelegramMessage(req, res, next));

module.exports = router;
