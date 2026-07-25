const publishingModeManager = require('../mode/publishingModeManager');
const deliveryValidator = require('../validation/deliveryValidator');
const publishingStateMachine = require('../state/publishingStateMachine');
const channelRouter = require('../routing/channelRouter');
const publishingQueue = require('../queue/publishingQueue');
const ImmediatePublishingStrategy = require('../strategies/immediatePublishingStrategy');
const retryEngine = require('../retry/retryEngine');
const messageVersionManager = require('../versioning/messageVersionManager');
const publishingHistoryService = require('../history/publishingHistoryService');
const telegramPublishingMetrics = require('../metrics/telegramPublishingMetrics');
const TelegramPublishingEventTypes = require('../events/telegramPublishingEventTypes');
const eventBus = require('../../core/events/eventBus');
const idProvider = require('../../core/pipeline/providers/idProvider');
const logger = require('../../utils/logger');

class TelegramPublisher {
  constructor() {
    this.defaultStrategy = new ImmediatePublishingStrategy();
  }

  /**
   * Process and deliver a PublishingPackage to target Telegram channel
   * @param {Object} publishingPackage - Validated PublishingPackage DTO
   * @param {Object} options - { strategy, priority }
   * @returns {Promise<Object>} PublishingResult { success, taskId, messageId, mode, status, durationMs }
   */
  async publish(publishingPackage, options = {}) {
    const startMs = Date.now();
    const taskId = `pub_${idProvider.generateTaskId()}`;
    const mode = publishingModeManager.getMode();

    logger.info(`[TelegramPublisher] Starting publishing execution '${taskId}' in mode '${mode}' for package '${publishingPackage.packageId}'`);

    const taskItem = {
      id: taskId,
      taskId,
      packageId: publishingPackage.packageId,
      status: publishingStateMachine.states.CREATED,
      retryCount: 0,
    };

    // 1. Route task to target channel
    const targetChannel = channelRouter.route(publishingPackage);

    // 2. Delivery Validation
    const validation = deliveryValidator.validate(publishingPackage, targetChannel);
    if (!validation.valid) {
      publishingStateMachine.transition(taskItem, publishingStateMachine.states.REJECTED);
      telegramPublishingMetrics.recordFailure();
      await eventBus.emit(TelegramPublishingEventTypes.PUBLISHING_FAILED, { taskId, errors: validation.errors });
      logger.error(`[TelegramPublisher] Validation failed for task '${taskId}': ${validation.errors.join(', ')}`);
      return { success: false, taskId, errors: validation.errors, status: taskItem.status };
    }

    publishingStateMachine.transition(taskItem, publishingStateMachine.states.VALIDATED);
    publishingStateMachine.transition(taskItem, publishingStateMachine.states.APPROVED);

    // 3. Queue task
    publishingQueue.enqueue(taskItem, options.priority || targetChannel.priority || 50);
    publishingStateMachine.transition(taskItem, publishingStateMachine.states.QUEUED);
    await eventBus.emit(TelegramPublishingEventTypes.PUBLISHING_QUEUED, { taskId, channelId: targetChannel.channelId });

    // Dequeue for execution
    const dequeued = publishingQueue.dequeue();
    const currentTask = dequeued || taskItem;
    publishingStateMachine.transition(currentTask, publishingStateMachine.states.PUBLISHING);
    await eventBus.emit(TelegramPublishingEventTypes.PUBLISHING_STARTED, { taskId });

    // 4. Record Message Revision
    const textMessage = publishingPackage.renderedMessages ? publishingPackage.renderedMessages.telegram : '';
    messageVersionManager.recordRevision(taskId, textMessage, {
      packageVersion: publishingPackage.packageVersion,
      templateVersion: publishingPackage.templateVersion,
    });

    // 5. Select & Execute Strategy
    const strategy = options.strategy || this.defaultStrategy;
    try {
      const context = {
        targetChannel,
        renderedMessage: textMessage,
        images: publishingPackage.images,
        product: publishingPackage.product,
        deal: publishingPackage.deal,
      };

      const dispatchResult = await strategy.execute(currentTask, context);
      const durationMs = Date.now() - startMs;
      const messageId = (dispatchResult && dispatchResult.result) ? dispatchResult.result.message_id : null;

      publishingStateMachine.transition(currentTask, publishingStateMachine.states.PUBLISHED);
      telegramPublishingMetrics.recordPublish(durationMs, mode);

      // 6. Record Publishing History
      await publishingHistoryService.recordPublishing({
        packageId: publishingPackage.packageId,
        dealId: publishingPackage.deal ? publishingPackage.deal._id : null,
        channelId: targetChannel.channelId,
        telegramMessageId: messageId,
        mode,
        status: currentTask.status,
        durationMs,
      });

      // 7. Emit Event
      await eventBus.emit(TelegramPublishingEventTypes.PUBLISHING_SUCCEEDED, {
        taskId,
        messageId,
        channelId: targetChannel.channelId,
        mode,
      });

      logger.info(`[TelegramPublisher] Successfully published task '${taskId}' (Message ID: ${messageId}) in ${durationMs}ms [Mode: ${mode}]`);
      return {
        success: true,
        taskId,
        messageId,
        mode,
        status: currentTask.status,
        durationMs,
      };
    } catch (err) {
      const durationMs = Date.now() - startMs;
      telegramPublishingMetrics.recordFailure();
      retryEngine.recordAttempt(currentTask, err);

      if (retryEngine.canRetry(currentTask)) {
        currentTask.retryCount = (currentTask.retryCount || 0) + 1;
        telegramPublishingMetrics.recordRetry();
        publishingStateMachine.transition(currentTask, publishingStateMachine.states.FAILED);
        publishingStateMachine.transition(currentTask, publishingStateMachine.states.QUEUED);
        await eventBus.emit(TelegramPublishingEventTypes.PUBLISHING_RETRIED, { taskId, retryCount: currentTask.retryCount });
      } else {
        publishingStateMachine.transition(currentTask, publishingStateMachine.states.FAILED);
        retryEngine.moveToDLQ(currentTask, err.message);
        await eventBus.emit(TelegramPublishingEventTypes.PUBLISHING_FAILED, { taskId, error: err.message });
      }

      logger.error(`[TelegramPublisher] Publishing failed for task '${taskId}': ${err.message}`);
      return {
        success: false,
        taskId,
        error: err.message,
        mode,
        status: currentTask.status,
        durationMs,
      };
    }
  }
}

module.exports = new TelegramPublisher();
