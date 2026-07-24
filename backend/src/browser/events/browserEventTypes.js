const BrowserEventTypes = Object.freeze({
  BROWSER_STARTED: 'BrowserStarted',
  BROWSER_CLOSED: 'BrowserClosed',
  BROWSER_RESTARTED: 'BrowserRestarted',
  CONTEXT_CREATED: 'ContextCreated',
  CONTEXT_DESTROYED: 'ContextDestroyed',
  PAGE_CREATED: 'PageCreated',
  PAGE_DESTROYED: 'PageDestroyed',
  NAVIGATION_STARTED: 'NavigationStarted',
  NAVIGATION_COMPLETED: 'NavigationCompleted',
  NAVIGATION_FAILED: 'NavigationFailed',
  SCREENSHOT_CAPTURED: 'ScreenshotCaptured',
});

module.exports = BrowserEventTypes;
