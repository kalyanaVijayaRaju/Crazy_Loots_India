const eventBus = require('./events/eventBus');
const DomainEventTypes = require('./events/event.types');
const eventDTOs = require('./events/event.dto');

const QueueInterface = require('./queue/queue.interface');
const MemoryQueue = require('./queue/memoryQueue');
const PriorityQueue = require('./queue/priorityQueue');
const queueManager = require('./queue/queueManager');

const priorityConstants = require('./priority/priority.constants');
const {
  MonitoringStates,
  AllowedTransitions,
  MonitoringStateMachine,
} = require('./state/monitoringStateMachine');
const MonitoringContext = require('./context/monitoringContext');

const container = require('./di/container');
const lifecycleManager = require('./lifecycle/lifecycleManager');

const MetricsInterface = require('./metrics/metrics.interface');
const memoryMetrics = require('./metrics/memoryMetrics');

const executionContracts = require('./execution/execution.contracts');

module.exports = {
  eventBus,
  DomainEventTypes,
  ...eventDTOs,
  QueueInterface,
  MemoryQueue,
  PriorityQueue,
  queueManager,
  ...priorityConstants,
  MonitoringStates,
  AllowedTransitions,
  MonitoringStateMachine,
  MonitoringContext,
  container,
  lifecycleManager,
  MetricsInterface,
  memoryMetrics,
  ...executionContracts,
};
