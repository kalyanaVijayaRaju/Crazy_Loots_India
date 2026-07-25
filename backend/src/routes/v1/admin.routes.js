const express = require('express');
const adminController = require('../../controllers/admin.controller');

const router = express.Router();

router.post('/seed', (req, res, next) => adminController.seedData(req, res, next));
router.post('/reset', (req, res, next) => adminController.resetData(req, res, next));
router.post('/reindex', (req, res, next) => adminController.reindexData(req, res, next));
router.post('/replay', (req, res, next) => adminController.replayExecution(req, res, next));

module.exports = router;
