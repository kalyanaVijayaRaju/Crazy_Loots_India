const logger = require('../../utils/logger');
const { DomainEvent } = require('./event.dto');

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Register a listener for an event
   * @param {string} eventName
   * @param {Function} listener
   * @param {Object} [options]
   * @param {number} [options.priority=50] - Higher priority listeners execute first
   * @param {boolean} [options.once=false]
   */
  register(eventName, listener, options = {}) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('EventBus.register requires a valid eventName string.');
    }
    if (typeof listener !== 'function') {
      throw new Error('EventBus.register requires a listener function.');
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    const listenerList = this.listeners.get(eventName);
    const entry = {
      fn: listener,
      priority: options.priority || 50,
      once: Boolean(options.once),
    };

    listenerList.push(entry);
    // Sort listeners by priority descending
    listenerList.sort((a, b) => b.priority - a.priority);

    logger.debug(`[EventBus] Registered listener for '${eventName}' (Priority: ${entry.priority})`);
    return () => this.removeListener(eventName, listener);
  }

  /**
   * Register a one-time listener for an event
   * @param {string} eventName
   * @param {Function} listener
   * @param {Object} [options]
   */
  registerOnce(eventName, listener, options = {}) {
    return this.register(eventName, listener, { ...options, once: true });
  }

  /**
   * Dispatch / Emit a domain event asynchronously to all registered listeners
   * @param {string|DomainEvent} eventOrName - Event name or DomainEvent object
   * @param {Object} [payload] - Event payload if eventOrName is string
   * @param {Object} [metadata] - Optional metadata
   * @returns {Promise<Array>} Results from all listener executions
   */
  async emit(eventOrName, payload = {}, metadata = {}) {
    let domainEvent;

    if (eventOrName instanceof DomainEvent) {
      domainEvent = eventOrName;
    } else if (typeof eventOrName === 'string') {
      domainEvent = new DomainEvent({
        eventName: eventOrName,
        payload,
        metadata,
      });
    } else {
      throw new Error('EventBus.emit requires an eventName string or DomainEvent instance.');
    }

    const { eventName, eventId, correlationId } = domainEvent;
    const listenerList = this.listeners.get(eventName);

    if (!listenerList || listenerList.length === 0) {
      logger.debug(`[EventBus] Event '${eventName}' emitted with 0 listeners [${correlationId}]`);
      return [];
    }

    logger.debug(
      `[EventBus] Emitting event '${eventName}' [id: ${eventId}, corr: ${correlationId}] to ${listenerList.length} listeners`
    );

    const toRemove = [];
    const executionPromises = listenerList.map(async (entry) => {
      if (entry.once) {
        toRemove.push(entry);
      }
      try {
        return await entry.fn(domainEvent);
      } catch (err) {
        logger.error(
          `[EventBus] Listener error on event '${eventName}' [corr: ${correlationId}]: ${err.message}`,
          { stack: err.stack }
        );
        throw err;
      }
    });

    // Remove one-time listeners
    if (toRemove.length > 0) {
      const remaining = listenerList.filter((e) => !toRemove.includes(e));
      if (remaining.length > 0) {
        this.listeners.set(eventName, remaining);
      } else {
        this.listeners.delete(eventName);
      }
    }

    return Promise.allSettled(executionPromises);
  }

  /**
   * Remove a specific listener for an event
   * @param {string} eventName
   * @param {Function} listener
   */
  removeListener(eventName, listener) {
    const list = this.listeners.get(eventName);
    if (!list) {
      return false;
    }

    const filtered = list.filter((entry) => entry.fn !== listener);
    if (filtered.length === 0) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.set(eventName, filtered);
    }
    return true;
  }

  /**
   * Remove all listeners for a given event name
   * @param {string} eventName
   */
  removeAllListeners(eventName) {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.clear();
    }
  }

  /**
   * Get listener count for an event
   * @param {string} eventName
   * @returns {number}
   */
  listenerCount(eventName) {
    const list = this.listeners.get(eventName);
    return list ? list.length : 0;
  }

  /**
   * List all registered event names
   * @returns {Array<string>}
   */
  getRegisteredEvents() {
    return Array.from(this.listeners.keys());
  }

  /**
   * Reset and clear all event listeners
   */
  clear() {
    this.listeners.clear();
    logger.debug('[EventBus] All event listeners cleared.');
  }
}

module.exports = new EventBus();
