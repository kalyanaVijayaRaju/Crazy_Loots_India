# ADR-019: Automated Browser Crash Recovery

## Status
Accepted

## Context
Headless browser processes can occasionally crash due to memory pressure or unhandled browser engine errors. Crash failures must not crash the main application server.

## Decision
We implement `BrowserLifecycle.handleCrashAndRecover()`. Upon crash detection, active page and context pools are cleared, stale process references are terminated, and a fresh browser instance is launched automatically.

## Consequences
- High application availability despite browser process instability.
- Self-healing browser automation platform.
