class FeatureFlagManager {
  constructor() {
    this.flags = new Map([
      ['ENABLE_LIVE_PUBLISHING', false],
      ['ENABLE_SANDBOX', true],
      ['ENABLE_DRY_RUN', true],
      ['ENABLE_MESSAGE_EDITING', true],
      ['ENABLE_MESSAGE_DELETION', true],
      ['ENABLE_PHOTO_PUBLISHING', true],
    ]);
  }

  isEnabled(flagName) {
    return Boolean(this.flags.get(flagName));
  }

  setFlag(flagName, enabled) {
    this.flags.set(flagName, Boolean(enabled));
  }

  getFlags() {
    return Object.fromEntries(this.flags);
  }
}

module.exports = new FeatureFlagManager();
