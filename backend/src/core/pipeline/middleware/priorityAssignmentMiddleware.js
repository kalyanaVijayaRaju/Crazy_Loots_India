const PipelineMiddleware = require('../interfaces/middleware.interface');
const { PriorityLevels } = require('../../priority/priority.constants');

class PriorityAssignmentMiddleware extends PipelineMiddleware {
  constructor() {
    super('PriorityAssignmentMiddleware', 60);
  }

  async execute(context, next) {
    if (!context.priority) {
      context.priority = PriorityLevels.NORMAL;
    }
    return next();
  }
}

module.exports = PriorityAssignmentMiddleware;
