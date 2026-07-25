const express = require('express');
const dealController = require('../../controllers/deal.controller');
const validateRequest = require('../../middleware/validateRequest');
const DealDTO = require('../../dto/deal.dto');

const router = express.Router();

router.get('/', (req, res, next) => dealController.getDeals(req, res, next));
router.get('/:id', (req, res, next) => dealController.getDealById(req, res, next));
router.post('/:id/detect', (req, res, next) => dealController.detectDeal(req, res, next));
router.post('/:id/approve', (req, res, next) => dealController.approveDeal(req, res, next));
router.post('/:id/reject', validateRequest(DealDTO.validateAction), (req, res, next) => dealController.rejectDeal(req, res, next));
router.post('/:id/replay', (req, res, next) => dealController.replayDeal(req, res, next));

module.exports = router;
