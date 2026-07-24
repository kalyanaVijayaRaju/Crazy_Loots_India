# ADR-071: Observability Architecture

## Status
Accepted

## Context
The platform lacked unified observability across pipeline executions, making it difficult to trace failures, measure performance, and understand system behavior in production.

## Decision
Introduce a dedicated `observability/` module providing TraceTimelineService, ExecutionTimelineStore, PerformanceProfiler, MetricsAggregator, and ObservabilityApi. All observability concerns are isolated from business logic.

## Consequences
- Every execution is traceable via Execution ID, Trace ID, and Correlation ID
- Performance bottlenecks are automatically identified
- Unified metrics are accessible via REST API
- Observability is decoupled from business logic — no existing modules modified
