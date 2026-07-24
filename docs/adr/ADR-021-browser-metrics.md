# ADR-021: Browser Automation Metrics & Observability

## Status
Accepted

## Context
Monitoring browser platform performance requires tracking resource consumption, navigation speed, and crash frequencies across scraping workloads.

## Decision
We implement `BrowserMetrics` and `BrowserHealthMonitor` to track active browsers, contexts, pages, navigation latencies, process uptime, and restart counts. All actions log structured messages via Winston.

## Consequences
- Operational visibility into browser pool health.
- Real-time telemetry monitoring.
