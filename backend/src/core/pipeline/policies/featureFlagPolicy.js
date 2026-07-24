const PolicyInterface = require('../interfaces/policy.interface');
const featureFlagManager = require('../featureFlags/featureFlagManager');

class FeatureFlagPolicy extends PolicyInterface {
  constructor(flagName) {
    super(`FeatureFlagPolicy:${flagName}`);
    this.flagName = flagName;
  }

  async evaluate(_context) {
    const enabled = featureFlagManager.isEnabled(this.flagName);

    return {
      allowed: enabled,
      flagName: this.flagName,
      isEnabled: enabled,
    };
  }
}

module.exports = FeatureFlagPolicy;
