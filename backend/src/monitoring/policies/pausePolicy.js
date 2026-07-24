class PausePolicy {
  shouldPause(config) {
    if (!config) {
      return false;
    }
    return config.enabled === false;
  }
}

module.exports = new PausePolicy();
