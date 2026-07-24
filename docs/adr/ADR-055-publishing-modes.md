# ADR-055: Controlled Publishing Modes

## Status
Accepted

## Context
Deploying automated publishing pipelines carries risk of accidentally sending test messages to public Telegram subscribers during testing or development.

## Decision
We implement `PublishingModeManager` supporting `DRY_RUN`, `SANDBOX`, and `LIVE` modes, defaulting strictly to `DRY_RUN`.

## Consequences
- Zero accidental live dispatches during local development and testing.
- Full pipeline validation without external network calls in `DRY_RUN`.
