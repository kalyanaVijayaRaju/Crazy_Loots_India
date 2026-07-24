/**
 * PipelineStage Interface
 */
class PipelineStage {
  constructor(stageName, priority = 50) {
    if (this.constructor === PipelineStage) {
      throw new Error('PipelineStage is an abstract interface and cannot be instantiated directly.');
    }
    this._name = stageName || this.constructor.name;
    this._priority = priority;
  }

  name() {
    return this._name;
  }

  priority() {
    return this._priority;
  }

  async execute(_context) {
    throw new Error(`Method 'execute()' must be implemented by ${this.name()}`);
  }

  async rollback(_context) {
    // Optional rollback logic per stage
    return true;
  }

  async validate(_context) {
    return true;
  }
}

/**
 * Pipeline Interface
 */
class PipelineInterface {
  constructor(name = 'default-pipeline') {
    if (this.constructor === PipelineInterface) {
      throw new Error('PipelineInterface is an abstract class.');
    }
    this.name = name;
  }

  async execute(_context) {
    throw new Error(`Method 'execute()' must be implemented by ${this.constructor.name}`);
  }

  register(_stage) {
    throw new Error(`Method 'register()' must be implemented by ${this.constructor.name}`);
  }

  unregister(_stageName) {
    throw new Error(`Method 'unregister()' must be implemented by ${this.constructor.name}`);
  }

  insert(_stage, _index) {
    throw new Error(`Method 'insert()' must be implemented by ${this.constructor.name}`);
  }

  remove(_stageName) {
    throw new Error(`Method 'remove()' must be implemented by ${this.constructor.name}`);
  }

  clear() {
    throw new Error(`Method 'clear()' must be implemented by ${this.constructor.name}`);
  }

  validate(_context) {
    throw new Error(`Method 'validate()' must be implemented by ${this.constructor.name}`);
  }
}

module.exports = {
  PipelineStage,
  PipelineInterface,
};
