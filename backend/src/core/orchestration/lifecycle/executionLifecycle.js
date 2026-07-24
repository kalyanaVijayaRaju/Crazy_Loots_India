const logger = require('../../../utils/logger');

class ExecutionLifecycle {
  constructor() {
    this.hooks = {
      beforeExecute: [],
      afterExecute: [],
      onSuccess: [],
      onFailure: [],
      onRetry: [],
      onCancel: [],
    };
  }

  registerHook(event, fn) {
    if (!this.hooks[event]) {
      throw new Error(`Invalid lifecycle hook event '${event}'.`);
    }
    if (typeof fn !== 'function') {
      throw new Error('Lifecycle hook callback must be a function.');
    }
    this.hooks[event].push(fn);
    logger.debug(`[ExecutionLifecycle] Registered hook for '${event}'`);
  }

  async runBeforeExecute(context) {
    for (const fn of this.hooks.beforeExecute) {
      await fn(context);
    }
  }

  async runAfterExecute(context, result) {
    for (const fn of this.hooks.afterExecute) {
      await fn(context, result);
    }
  }

  async runOnSuccess(context, result) {
    for (const fn of this.hooks.onSuccess) {
      await fn(context, result);
    }
  }

  async runOnFailure(context, error) {
    for (const fn of this.hooks.onFailure) {
      await fn(context, error);
    }
  }

  async runOnRetry(context, attempt) {
    for (const fn of this.hooks.onRetry) {
      await fn(context, attempt);
    }
  }

  async runOnCancel(context, reason) {
    for (const fn of this.hooks.onCancel) {
      await fn(context, reason);
    }
  }
}

module.exports = new ExecutionLifecycle();
