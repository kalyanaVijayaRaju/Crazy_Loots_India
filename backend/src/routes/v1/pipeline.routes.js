const express = require('express');
const pipelineController = require('../../controllers/pipeline.controller');
const validateRequest = require('../../middleware/validateRequest');
const PipelineDTO = require('../../dto/pipeline.dto');

const router = express.Router();

router.post('/run', validateRequest(PipelineDTO.validateRun), (req, res, next) => pipelineController.runPipeline(req, res, next));

module.exports = router;
