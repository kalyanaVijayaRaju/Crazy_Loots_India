# ADR-008: Feature Flag Management Architecture

## Status
Accepted

## Context
Deploying new capabilities (such as Playwright scrapers, Redis queues, or Telegram alerts) requires dynamic runtime toggling without needing code redeployments or service restarts.

## Decision
We introduce `FeatureFlagManager` to register, enable, disable, and query feature flags (`ENABLE_PLAYWRIGHT`, `ENABLE_REDIS`, `ENABLE_TELEGRAM`, etc.). Flags integrate directly into pipeline policy checks (`FeatureFlagPolicy`).

## Consequences
- Zero-downtime feature toggling.
- Safe canary deployments and feature isolation.
