# ADR-015: System Statistics and Distributed Tracing Architecture

## Status
Accepted

## Context
Production monitoring at scale requires end-to-end distributed tracing across pipeline stages and unified statistics aggregation for telemetry dashboards.

## Decision
We implement `TraceContext` DTOs containing `requestId`, `traceId`, `correlationId`, `taskId`, and `executionId`. We also implement `StatisticsService` aggregating telemetry counters, queue sizes, execution latencies, retry metrics, and merchant counts.

## Consequences
- End-to-end trace ID tracking across log entries.
- Unified telemetry endpoint ready for Prometheus integration.
