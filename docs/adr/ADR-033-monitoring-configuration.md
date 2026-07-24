# ADR-033: Monitoring Configuration Model

## Status
Accepted

## Context
Each monitored product needs independently configurable scheduling parameters (interval, priority, retry policy, timeout) to balance monitoring frequency against resource consumption.

## Decision
We implement a `MonitoringConfiguration` Mongoose model storing per-product monitoring schedules with `enabled`, `priority`, `interval`, `retryPolicy`, `lastRun`, `nextRun`, and `strategy` fields, persisted via `MonitoringConfigurationRepository`.

## Consequences
- Granular per-product monitoring control.
- Priority-based queue ordering for due configurations.
