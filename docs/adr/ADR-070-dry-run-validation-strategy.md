# ADR-070: DRY_RUN Validation Strategy

## Status
Accepted

## Context
Executing end-to-end integration tests using real Amazon product URLs must never accidentally publish test deals to live Telegram channels.

## Decision
We implement `DryRunValidator` ensuring that E2E pipeline executions strictly operate inside `DRY_RUN` mode.

## Consequences
- Guaranteed broadcast safety during E2E integration testing.
- Automatic error generation if pipeline is executed in live mode during integration tests.
