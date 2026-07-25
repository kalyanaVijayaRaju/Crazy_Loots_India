const express = require('express');
const monitoringController = require('../../controllers/monitoring.controller');

const router = express.Router();

router.post('/run', (req, res, next) => monitoringController.runMonitoring(req, res, next));
router.post('/pause', (req, res, next) => monitoringController.pauseMonitoring(req, res, next));
router.post('/resume', (req, res, next) => monitoringController.resumeMonitoring(req, res, next));
router.post('/retry', (req, res, next) => monitoringController.retryMonitoring(req, res, next));
router.get('/jobs', (req, res, next) => monitoringController.getJobs(req, res, next));
router.get('/history', (req, res, next) => monitoringController.getHistory(req, res, next));

module.exports = router;
