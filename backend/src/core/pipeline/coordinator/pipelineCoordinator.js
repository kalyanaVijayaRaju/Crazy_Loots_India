const { PipelineInterface, PipelineStage } = require('../interfaces/pipeline.interface');
const PipelineMiddleware = require('../interfaces/middleware.interface');
const PipelineEventTypes = require('../contracts/pipelineEvents');
const MonitoringResult = require('../results/monitoringResult');
const eventBus = require('../../events/eventBus');
const memoryMetrics = require('../../metrics/memoryMetrics');
const logger = require('../../../utils/logger');

class PipelineCoordinator extends PipelineInterface {
  constructor(name = 'main-monitoring-pipeline') {
    super(name);
    this.stages = [];
    this.middlewares = [];
  }

  register(stage) {
    if (!(stage instanceof PipelineStage)) {
      throw new Error('PipelineCoordinator.register requires an instance of PipelineStage.');
    }
    this.stages.push(stage);
    // Sort stages descending by priority
    this.stages.sort((a, b) => b.priority() - a.priority());
    logger.debug(`[PipelineCoordinator:${this.name}] Registered stage '${stage.name()}' (Priority: ${stage.priority()})`);
  }

  unregister(stageName) {
    const initialCount = this.stages.length;
    this.stages = this.stages.filter((s) => s.name() !== stageName);
    return this.stages.length < initialCount;
  }

  insert(stage, index) {
    if (!(stage instanceof PipelineStage)) {
      throw new Error('PipelineCoordinator.insert requires an instance of PipelineStage.');
    }
    this.stages.splice(index, 0, stage);
  }

  remove(stageName) {
    return this.unregister(stageName);
  }

  clear() {
    this.stages = [];
    this.middlewares = [];
  }

  use(middleware) {
    if (!(middleware instanceof PipelineMiddleware)) {
      throw new Error('PipelineCoordinator.use requires an instance of PipelineMiddleware.');
    }
    this.middlewares.push(middleware);
    this.middlewares.sort((a, b) => b.priority() - a.priority());
    logger.debug(`[PipelineCoordinator:${this.name}] Registered middleware '${middleware.name()}'`);
  }

  validate(context) {
    if (!context) {
      throw new Error('Pipeline validation failed: null or undefined context.');
    }
    return true;
  }

  async executeMiddlewareChain(context, targetFn) {
    let index = -1;

    const dispatch = async (i) => {
      if (i <= index) {
        throw new Error('next() called multiple times in middleware chain');
      }
      index = i;
      if (i < this.middlewares.length) {
        const mw = this.middlewares[i];
        return mw.execute(context, () => dispatch(i + 1));
      }
      return targetFn();
    };

    return dispatch(0);
  }

  async rollbackStages(failedStageIndex, context) {
    logger.warn(`[PipelineCoordinator:${this.name}] Initiating rollback for stages prior to index ${failedStageIndex}`);
    for (let i = failedStageIndex - 1; i >= 0; i--) {
      const stage = this.stages[i];
      try {
        logger.info(`[PipelineCoordinator:${this.name}] Rolling back stage '${stage.name()}'...`);
        await stage.rollback(context);
      } catch (err) {
        logger.error(`[PipelineCoordinator:${this.name}] Rollback failed for stage '${stage.name()}': ${err.message}`);
      }
    }
  }

  async execute(context) {
    this.validate(context);
    const startTimeMs = Date.now();
    const resultBuilder = new MonitoringResult.Builder()
      .setTaskId(context.correlationId)
      .setTraceId(context.metadata?.traceId || context.correlationId);

    await eventBus.emit(PipelineEventTypes.PIPELINE_STARTED, { context });
    memoryMetrics.increment('pipelineExecutions');

    try {
      // Run middleware chain first
      await this.executeMiddlewareChain(context, async () => {
        // Execute stages sequentially
        for (let i = 0; i < this.stages.length; i++) {
          const stage = this.stages[i];
          const stageName = stage.name();

          await eventBus.emit(PipelineEventTypes.STAGE_STARTED, { stageName, context });
          const stageStart = Date.now();

          try {
            await stage.execute(context);
            const stageDuration = Date.now() - stageStart;
            resultBuilder.addEvent(`Stage '${stageName}' completed in ${stageDuration}ms`);
            await eventBus.emit(PipelineEventTypes.STAGE_COMPLETED, { stageName, context, durationMs: stageDuration });
          } catch (stageErr) {
            await eventBus.emit(PipelineEventTypes.STAGE_FAILED, {
              stageName,
              context,
              error: stageErr.message,
            });
            resultBuilder.addError(`Stage '${stageName}' failed: ${stageErr.message}`);

            // Rollback previous completed stages
            await this.rollbackStages(i, context);
            throw stageErr;
          }
        }
      });

      const totalDurationMs = Date.now() - startTimeMs;
      resultBuilder.setSuccess(true).setDuration(totalDurationMs).setState('COMPLETED');
      memoryMetrics.increment('pipelineSuccesses');
      memoryMetrics.recordDuration('pipelineDuration', totalDurationMs);

      const result = resultBuilder.build();
      await eventBus.emit(PipelineEventTypes.PIPELINE_COMPLETED, { result });
      return result;
    } catch (err) {
      const totalDurationMs = Date.now() - startTimeMs;
      resultBuilder.setSuccess(false).setDuration(totalDurationMs).setState('FAILED').addError(err.message);

      memoryMetrics.increment('pipelineFailures');
      const result = resultBuilder.build();
      await eventBus.emit(PipelineEventTypes.PIPELINE_FAILED, { result, error: err.message });
      return result;
    }
  }
}

module.exports = PipelineCoordinator;
