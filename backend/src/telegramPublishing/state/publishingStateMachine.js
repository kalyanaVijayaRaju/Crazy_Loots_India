const logger = require('../../utils/logger');

const States = Object.freeze({
  CREATED: 'CREATED',
  VALIDATED: 'VALIDATED',
  APPROVED: 'APPROVED',
  QUEUED: 'QUEUED',
  PUBLISHING: 'PUBLISHING',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  ARCHIVED: 'ARCHIVED',
});

const allowedTransitions = new Map([
  [States.CREATED, [States.VALIDATED, States.FAILED, States.REJECTED]],
  [States.VALIDATED, [States.APPROVED, States.FAILED, States.REJECTED]],
  [States.APPROVED, [States.QUEUED, States.FAILED, States.REJECTED, States.EXPIRED]],
  [States.QUEUED, [States.PUBLISHING, States.FAILED, States.EXPIRED, States.ARCHIVED]],
  [States.PUBLISHING, [States.PUBLISHED, States.FAILED, States.ARCHIVED]],
  [States.PUBLISHED, [States.ARCHIVED]],
  [States.FAILED, [States.QUEUED, States.ARCHIVED]],
  [States.REJECTED, [States.ARCHIVED]],
  [States.EXPIRED, [States.ARCHIVED]],
  [States.ARCHIVED, []],
]);

class PublishingStateMachine {
  constructor() {
    this.states = States;
  }

  canTransition(currentStatus, targetStatus) {
    const validTargets = allowedTransitions.get(currentStatus) || [];
    return validTargets.includes(targetStatus);
  }

  transition(publishingItem, targetStatus) {
    const current = publishingItem.status || States.CREATED;
    if (!this.canTransition(current, targetStatus)) {
      throw new Error(`PublishingStateMachine: Invalid transition from '${current}' to '${targetStatus}'.`);
    }
    publishingItem.status = targetStatus;
    publishingItem.updatedAt = new Date().toISOString();
    logger.debug(`[PublishingStateMachine] Transitioned item '${publishingItem.id || publishingItem.packageId}' (${current} -> ${targetStatus})`);
    return publishingItem;
  }
}

module.exports = new PublishingStateMachine();
