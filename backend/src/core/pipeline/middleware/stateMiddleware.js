const PipelineMiddleware = require('../interfaces/middleware.interface');
const { MonitoringStates } = require('../../state/monitoringStateMachine');

class StateMiddleware extends PipelineMiddleware {
  constructor() {
    super('StateMiddleware', 90);
  }

  async execute(context, next) {
    if (context.state === MonitoringStates.IDLE) {
      context.setState(MonitoringStates.QUEUED, 'Pipeline queued');
    }
    return next();
  }
}

module.exports = StateMiddleware;
