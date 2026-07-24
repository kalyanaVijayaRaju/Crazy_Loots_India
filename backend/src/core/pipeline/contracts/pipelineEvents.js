/**
 * Pipeline Lifecycle Event Constants
 */
const PipelineEventTypes = Object.freeze({
  PIPELINE_STARTED: 'PipelineStarted',
  PIPELINE_COMPLETED: 'PipelineCompleted',
  PIPELINE_FAILED: 'PipelineFailed',
  STAGE_STARTED: 'StageStarted',
  STAGE_COMPLETED: 'StageCompleted',
  STAGE_FAILED: 'StageFailed',
  MIDDLEWARE_STARTED: 'MiddlewareStarted',
  MIDDLEWARE_COMPLETED: 'MiddlewareCompleted',
  MIDDLEWARE_FAILED: 'MiddlewareFailed',
});

module.exports = PipelineEventTypes;
