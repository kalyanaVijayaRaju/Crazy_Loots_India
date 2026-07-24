const profiles = {
  development: {
    name: 'development',
    publishingMode: 'DRY_RUN',
    logLevel: 'debug',
    schedulerActive: true,
    featureFlags: {
      ENABLE_LIVE_PUBLISHING: false,
      ENABLE_SANDBOX: true,
      ENABLE_DRY_RUN: true,
    },
  },
  staging: {
    name: 'staging',
    publishingMode: 'SANDBOX',
    logLevel: 'info',
    schedulerActive: true,
    featureFlags: {
      ENABLE_LIVE_PUBLISHING: false,
      ENABLE_SANDBOX: true,
      ENABLE_DRY_RUN: true,
    },
  },
  production: {
    name: 'production',
    publishingMode: 'LIVE',
    logLevel: 'info',
    schedulerActive: true,
    featureFlags: {
      ENABLE_LIVE_PUBLISHING: true,
      ENABLE_SANDBOX: true,
      ENABLE_DRY_RUN: true,
    },
  },
};

class EnvironmentProfileManager {
  getProfile(envName = process.env.NODE_ENV || 'development') {
    const key = String(envName).toLowerCase();
    return profiles[key] || profiles.development;
  }
}

module.exports = new EnvironmentProfileManager();
