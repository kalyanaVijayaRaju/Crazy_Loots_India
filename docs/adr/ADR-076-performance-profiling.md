# ADR-076: Performance Profiling Strategy

## Status
Accepted

## Context
Without profiling, performance bottlenecks remain invisible until they cause user-facing issues. The platform needs automatic, per-execution performance measurement.

## Decision
Implement PerformanceProfiler that auto-profiles 9 categories (browser launch through total execution) per pipeline run. Reports include per-category breakdown, percentage-of-total, and bottleneck identification.

## Consequences
- Performance regressions are detected early
- Bottleneck identification guides optimization efforts
- Profiling data is available via the Observability API
- Historical profiles enable trend analysis
