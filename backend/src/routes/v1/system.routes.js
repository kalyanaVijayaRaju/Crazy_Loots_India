const express = require('express');
const systemController = require('../../controllers/system.controller');

const router = express.Router();

router.get('/status', (req, res, next) => systemController.getStatus(req, res, next));
router.get('/version', (req, res, next) => systemController.getVersion(req, res, next));
router.get('/configuration', (req, res, next) => systemController.getConfiguration(req, res, next));
router.get('/feature-flags', (req, res, next) => systemController.getFeatureFlags(req, res, next));

module.exports = router;
