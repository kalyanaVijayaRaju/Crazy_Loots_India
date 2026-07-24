const logger = require('../../utils/logger');

const MonitoringStates = Object.freeze({
  IDLE: 'IDLE',
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  WAITING: 'WAITING',
  RETRYING: 'RETRYING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  DISABLED: 'DISABLED',
  CANCELLED: 'CANCELLED',
});

const AllowedTransitions = Object.freeze({
  [MonitoringStates.IDLE]: [MonitoringStates.QUEUED, MonitoringStates.RUNNING, MonitoringStates.DISABLED],
  [MonitoringStates.QUEUED]: [MonitoringStates.RUNNING, MonitoringStates.CANCELLED],
  [MonitoringStates.RUNNING]: [
    MonitoringStates.WAITING,
    MonitoringStates.COMPLETED,
    MonitoringStates.FAILED,
    MonitoringStates.RETRYING,
    MonitoringStates.CANCELLED,
  ],
  [MonitoringStates.WAITING]: [MonitoringStates.RUNNING, MonitoringStates.FAILED, MonitoringStates.CANCELLED],
  [MonitoringStates.RETRYING]: [
    MonitoringStates.QUEUED,
    MonitoringStates.RUNNING,
    MonitoringStates.FAILED,
    MonitoringStates.CANCELLED,
  ],
  [MonitoringStates.COMPLETED]: [MonitoringStates.IDLE, MonitoringStates.QUEUED],
  [MonitoringStates.FAILED]: [MonitoringStates.IDLE, MonitoringStates.QUEUED, MonitoringStates.RETRYING],
  [MonitoringStates.DISABLED]: [MonitoringStates.IDLE],
  [MonitoringStates.CANCELLED]: [MonitoringStates.IDLE],
});

class MonitoringStateMachine {
  constructor(initialState = MonitoringStates.IDLE) {
    this.currentState = initialState;
    this.history = [{ state: initialState, timestamp: new Date().toISOString() }];
  }

  getCurrentState() {
    return this.currentState;
  }

  canTransitionTo(nextState) {
    const allowed = AllowedTransitions[this.currentState] || [];
    return allowed.includes(nextState);
  }

  transitionTo(nextState, reason = '') {
    if (!this.canTransitionTo(nextState)) {
      const msg = `Invalid state transition from '${this.currentState}' to '${nextState}'`;
      logger.error(`[StateMachine] ${msg}`);
      throw new Error(msg);
    }

    const previousState = this.currentState;
    this.currentState = nextState;
    this.history.push({
      fromState: previousState,
      toState: nextState,
      reason,
      timestamp: new Date().toISOString(),
    });

    logger.debug(`[StateMachine] Transitioned '${previousState}' -> '${nextState}' ${reason ? `(${reason})` : ''}`);
    return this.currentState;
  }

  getHistory() {
    return [...this.history];
  }
}

module.exports = {
  MonitoringStates,
  AllowedTransitions,
  MonitoringStateMachine,
};
