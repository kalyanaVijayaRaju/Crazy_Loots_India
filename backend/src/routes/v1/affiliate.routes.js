const express = require('express');
const affiliateController = require('../../controllers/affiliate.controller');

const router = express.Router();

router.post('/generate', (req, res, next) => affiliateController.generateLink(req, res, next));
router.get('/providers', (req, res, next) => affiliateController.getProviders(req, res, next));
router.get('/status', (req, res, next) => affiliateController.getStatus(req, res, next));

module.exports = router;
