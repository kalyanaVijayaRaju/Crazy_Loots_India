# ADR-014: Unified Health Monitoring System

## Status
Accepted

## Context
Monitoring system health across multi-layer components (Queues, Executors, Schedulers, Merchant Registries, Event Bus, Lifecycle Manager) requires a centralized aggregator to expose system status to Kubernetes health probes or monitoring endpoints.

## Decision
We enforce `HealthCheckInterface` across core components and introduce `HealthMonitor` to aggregate health status into structured status reports (`HEALTHY`, `DEGRADED`, `UNHEALTHY`).

## Consequences
- Single aggregated endpoint for application health inspection.
- Early detection of failing internal subsystems.
