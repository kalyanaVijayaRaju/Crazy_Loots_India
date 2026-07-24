# ADR-035: Monitoring Run History

## Status
Accepted

## Context
Tracking historical monitoring executions is critical for debugging extraction failures, auditing price change frequency, and calculating operational SLA metrics.

## Decision
We implement `MonitoringRun` Mongoose model and `MonitoringHistoryService` to persist execution records with status, duration, changes, and error messages per product.

## Consequences
- Complete audit trail of every monitoring execution.
- Historical performance analytics capability.
