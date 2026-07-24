const PipelineCoordinator = require('../../pipeline/coordinator/pipelineCoordinator');
const merchantDispatcher = require('../dispatcher/merchantDispatcher');
const executorFactory = require('../factory/executorFactory');
const executionLifecycle = require('../lifecycle/executionLifecycle');
const TraceContext = require('../tracing/traceContext');
const MonitoringContext = require('../../context/monitoringContext');
const MonitoringResult = require('../../pipeline/results/monitoringResult');
const RetryPolicy = require('../../pipeline/policies/retryPolicy');
const eventBus = require('../../events/eventBus');
const memoryMetrics = require('../../metrics/memoryMetrics');
const logger = require('../../../utils/logger');
const { MonitoringStates } = require('../../state/monitoringStateMachine');

class MonitoringCoordinator {
  constructor(name = 'default-orchestration-coordinator') {
    this.name = name;
    this.pipelineCoordinator = new PipelineCoordinator(`${name}-pipeline`);
    this.dispatcher = merchantDispatcher;
    this.executorFactory = executorFactory;
    this.lifecycle = executionLifecycle;
    this.retryPolicy = new RetryPolicy(3, 2);
  }

  /**
   * Orchestrate execution for a given MonitoringTask
   * @param {MonitoringTask} task
   * @returns {Promise<MonitoringResult>}
   */
  async orchestrate(task) {
    const traceCtx = TraceContext.from({
      taskId: task.taskId,
      traceId: task.traceId,
      correlationId: task.correlationId,
      merchant: task.merchant,
      productId: task.productId,
      metadata: task.metadata,
    });

    logger.info(
      `[MonitoringCoordinator] Orchestrating task '${task.taskId}' [merchant: ${task.merchant}, productId: ${task.productId}, traceId: ${traceCtx.traceId}]`
    );

    const context = new MonitoringContext({
      correlationId: task.correlationId,
      merchant: task.merchant,
      productId: task.productId,
      priority: task.priority,
      state: task.state,
      metadata: { traceId: traceCtx.traceId, taskId: task.taskId, strategy: task.strategy },
    });

    const startMs = Date.now();
    await this.lifecycle.runBeforeExecute(context);

    try {
      // 1. Resolve merchant adapter via Dispatcher
      const adapter = this.dispatcher.dispatch(task.merchant);
      context.updateMetadata('resolvedMerchant', adapter.getMerchantName());

      // 2. Resolve executor via ExecutorFactory
      const executor = this.executorFactory.getExecutor(task.strategy);
      context.updateMetadata('resolvedExecutor', executor.name());

      // 3. Update state machine to RUNNING
      context.setState(MonitoringStates.RUNNING, 'Worker started execution');

      // 4. Run pipeline
      const pipelineRes = await this.pipelineCoordinator.execute(context);
      if (!pipelineRes.success) {
        throw new Error(`Pipeline execution failed: ${pipelineRes.errors.join(', ')}`);
      }

      // 5. Execute product fetch via Executor abstraction
      const productDTO = await executor.execute(context);
      const durationMs = Date.now() - startMs;

      // 6. Transition state machine to COMPLETED
      context.setState(MonitoringStates.COMPLETED, 'Execution completed successfully');

      const productObj = typeof productDTO?.toJSON === 'function' ? productDTO.toJSON() : { ...productDTO };

      const result = new MonitoringResult.Builder()
        .setTaskId(task.taskId)
        .setTraceId(traceCtx.traceId)
        .setSuccess(true)
        .setDuration(durationMs)
        .setState('COMPLETED')
        .setMetadata({ product: productObj })
        .build();

      await this.lifecycle.runOnSuccess(context, result);
      await this.lifecycle.runAfterExecute(context, result);
      await eventBus.emit('MonitoringExecutionCompleted', { task, result });
      memoryMetrics.increment('tasksProcessed');

      logger.info(`[MonitoringCoordinator] Successfully completed task '${task.taskId}' in ${durationMs}ms`);
      return result;
    } catch (err) {
      const durationMs = Date.now() - startMs;
      logger.error(`[MonitoringCoordinator] Orchestration failed for task '${task.taskId}': ${err.message}`);

      await this.lifecycle.runOnFailure(context, err.message);

      // Evaluate retry policy if state permits transition
      const canRetryState =
        context.state === MonitoringStates.RUNNING ||
        context.state === MonitoringStates.QUEUED ||
        context.state === MonitoringStates.FAILED;

      const retryEval = await this.retryPolicy.evaluate(context);
      if (retryEval.allowed && canRetryState) {
        context.incrementRetry();
        context.setState(MonitoringStates.RETRYING, `Retry #${context.retryCount} scheduled`);
        await this.lifecycle.runOnRetry(context, context.retryCount);
        memoryMetrics.increment('totalRetries');
      } else if (canRetryState) {
        context.setState(MonitoringStates.FAILED, 'Max retries exhausted or non-retryable error');
      }

      const result = new MonitoringResult.Builder()
        .setTaskId(task.taskId)
        .setTraceId(traceCtx.traceId)
        .setSuccess(false)
        .setDuration(durationMs)
        .setState(context.state)
        .addError(err.message)
        .build();

      await this.lifecycle.runAfterExecute(context, result);
      await eventBus.emit('MonitoringExecutionFailed', { task, result, error: err.message });

      return result;
    }
  }
}

module.exports = MonitoringCoordinator;
