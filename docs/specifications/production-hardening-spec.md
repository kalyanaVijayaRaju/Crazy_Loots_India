# Production Hardening, Reliability & Observability — Specification

## 1. Overview

Phase 15 transforms the Crazy Loots India platform into a production-ready system by adding comprehensive observability, reliability patterns, and operational tooling. No new business features or merchants are added.

## 2. Objectives

- **Observability**: Full execution tracing, performance profiling, metrics aggregation, and alerting.
- **Reliability**: Circuit breakers, auto-recovery, failure classification, and chaos testing.
- **Operability**: Health/readiness probes, production readiness checklists, runbooks, and diagnostics.
- **Validation**: Long-run DRY_RUN validation against real Amazon products.

## 3. Architecture

### 3.1 Observability Layer (`backend/src/observability/`)

```
observability/
├── tracing/           → TraceTimelineService
├── timeline/          → ExecutionTimelineStore
├── profiler/          → PerformanceProfiler
├── metrics/           → MetricsAggregator
├── alerts/            → AlertEngine, FailureClassifier
├── recovery/          → AutoRecoveryService
├── circuitBreaker/    → CircuitBreaker, CircuitBreakerRegistry
├── replay/            → ExecutionReplayService
├── archive/           → ExecutionArchiveService
├── health/            → HealthCheckService
├── readiness/         → ProductionReadinessChecker
├── chaos/             → ChaosTestRunner
├── diagnostics/       → SystemDiagnosticsService
├── reports/           → LongRunValidationRunner
├── dashboard/         → ObservabilityApi
├── runbook/           → RunbookGenerator
└── index.js           → Module re-exports
```

### 3.2 Trace Timeline

Each execution records:
- Execution ID, Trace ID, Correlation ID
- Per-stage timing (Extraction → History Persistence)
- Retry counts, failure messages, warnings
- Final result (SUCCESS / FAILURE / PARTIAL)

### 3.3 Performance Profiler

Auto-profiles these categories per execution:
- BROWSER_LAUNCH, NAVIGATION, DOM_EXTRACTION, PARSING
- DATABASE, MONITORING, DEAL_DETECTION, PUBLISHING
- TOTAL_EXECUTION

Generates reports with per-category breakdown, percentages, and bottleneck identification.

### 3.4 Metrics Aggregator

Three metric types:
- **Counters**: Monotonically increasing values (e.g., products processed)
- **Gauges**: Point-in-time values (e.g., queue size)
- **Histograms**: Distribution values with p50/p95/p99 (e.g., execution duration)

### 3.5 Alert Engine

Fires alerts for:
| Alert Type | Severity | Trigger |
|---|---|---|
| SELECTOR_FAILURE | WARNING | Amazon DOM selector mismatch |
| DOM_VERSION_CHANGE | WARNING | Page structure changed |
| BROWSER_CRASH | CRITICAL | Playwright process crash |
| QUEUE_OVERFLOW | CRITICAL | Queue > 500 items |
| SCHEDULER_FAILURE | CRITICAL | Cron scheduler stopped |
| TELEGRAM_OFFLINE | FATAL | Bot API unreachable |
| MONGODB_LATENCY | WARNING | Latency > 5000ms |
| HIGH_RETRY_COUNT | WARNING | Retries > 5 |
| DLQ_GROWTH | CRITICAL | Dead letter queue > 50 |

### 3.6 Failure Classification

Categories: TEMPORARY, PERMANENT, CONFIGURATION, DEPENDENCY, NETWORK, BROWSER, MERCHANT, PUBLISHING, DATABASE.

Each classification includes recoverability flag and suggested action.

### 3.7 Circuit Breakers

Protected dependencies:
| Circuit | Failure Threshold | Reset Timeout |
|---|---|---|
| amazon-merchant | 5 | 60s |
| telegram-client | 3 | 30s |
| browser | 3 | 45s |
| mongodb | 5 | 15s |
| affiliate-provider | 4 | 30s |
| short-url-provider | 4 | 30s |

State machine: CLOSED → OPEN → HALF_OPEN → CLOSED

### 3.8 Auto Recovery

Registered strategies with:
- Max attempt limits (default 5)
- Cooldown between attempts (default 10s)
- Automatic alert on recovery success/failure
- Attempt counter reset on success

### 3.9 Execution Replay & Archive

- **Replay**: Restores PublishingPackage, TraceContext, Metrics, Timeline
- **Archive**: Persists snapshots, reports, packages, metrics, logs to disk

### 3.10 Health & Readiness Probes

| Probe | Purpose |
|---|---|
| Liveness | Process is alive and responsive |
| Readiness | System can serve requests (all dependencies healthy) |
| Startup | Initialization has completed |
| Shutdown | Graceful shutdown in progress |

### 3.11 Chaos Testing

Simulated failure scenarios:
1. Browser crash
2. Telegram failure
3. MongoDB timeout
4. Selector failure
5. Queue overflow
6. Scheduler interruption

Each verifies graceful recovery.

### 3.12 Long-Run Validation

- 20+ real Amazon India product URLs
- Multiple monitoring cycles in DRY_RUN mode
- Generates stability score and detailed per-product reports
- Integrates with tracing, profiling, metrics, and archival

### 3.13 Observability API

Backend-only REST endpoints:
| Endpoint | Description |
|---|---|
| GET /observability/health | Full health report |
| GET /observability/liveness | Liveness probe |
| GET /observability/readiness | Readiness probe |
| GET /observability/metrics | Unified metrics |
| GET /observability/alerts | Alert history with filters |
| GET /observability/timeline | Execution timelines |
| GET /observability/timeline/:id | Single execution |
| GET /observability/failures | Circuit breaker status |
| GET /observability/production-readiness | Readiness checklist |
| GET /observability/diagnostics | System diagnostics |
| GET /observability/status | Aggregated status |

## 4. Design Patterns

- **Circuit Breaker Pattern**: Protects external dependencies
- **Observer Pattern**: Alert listeners, state-change callbacks
- **Strategy Pattern**: Pluggable recovery strategies
- **Factory Pattern**: Circuit breaker registry
- **Repository Pattern**: Timeline/archive stores
- **Singleton Pattern**: Service instances

## 5. Non-Goals

- No Flipkart or additional merchants
- No dashboard UI
- No AWS deployment
- No AI recommendations
- No new business features
