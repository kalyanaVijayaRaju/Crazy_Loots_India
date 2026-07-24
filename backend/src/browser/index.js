const BrowserConfiguration = require('./configuration/browserConfiguration');
const BrowserEventTypes = require('./events/browserEventTypes');
const browserRegistry = require('./registry/browserRegistry');
const playwrightAdapter = require('./utils/playwrightAdapter');
const browserFactory = require('./factory/browserFactory');
const browserManager = require('./browserManager/browserManager');
const browserPool = require('./browserPool/browserPool');
const contextPool = require('./contextPool/contextPool');
const pagePool = require('./pagePool/pagePool');
const navigationService = require('./navigation/navigationService');
const domService = require('./dom/domService');
const screenshotService = require('./screenshots/screenshotService');
const browserRateLimiter = require('./rateLimiter/browserRateLimiter');
const noProxyProvider = require('./proxy/noProxyProvider');
const noCaptchaProvider = require('./captcha/noCaptchaProvider');
const browserMetrics = require('./metrics/browserMetrics');
const browserHealthMonitor = require('./health/browserHealthMonitor');
const browserLifecycle = require('./lifecycle/browserLifecycle');

module.exports = {
  BrowserConfiguration,
  BrowserEventTypes,
  browserRegistry,
  playwrightAdapter,
  browserFactory,
  browserManager,
  browserPool,
  contextPool,
  pagePool,
  navigationService,
  domService,
  screenshotService,
  browserRateLimiter,
  noProxyProvider,
  noCaptchaProvider,
  browserMetrics,
  browserHealthMonitor,
  browserLifecycle,
};
