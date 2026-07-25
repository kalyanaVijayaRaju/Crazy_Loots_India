const express = require('express');
const publishingController = require('../../controllers/publishing.controller');
const validateRequest = require('../../middleware/validateRequest');
const PublishingDTO = require('../../dto/publishing.dto');

const router = express.Router();

router.post('/prepare', validateRequest(PublishingDTO.validatePrepare), (req, res, next) => publishingController.preparePackage(req, res, next));
router.post('/preview', (req, res, next) => publishingController.previewMessage(req, res, next));
router.post('/publish', validateRequest(PublishingDTO.validatePublish), (req, res, next) => publishingController.publishPackage(req, res, next));
router.post('/retry', (req, res, next) => publishingController.retryPublishing(req, res, next));
router.post('/rollback', (req, res, next) => publishingController.rollbackPublishing(req, res, next));
router.get('/history', (req, res, next) => publishingController.getHistory(req, res, next));

module.exports = router;
