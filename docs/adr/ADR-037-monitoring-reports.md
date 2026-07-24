# ADR-037: Monitoring Reports

## Status
Accepted

## Context
After each monitoring run, operators and downstream systems need structured summaries containing execution status, detected changes, performance timings, and error details.

## Decision
We implement `MonitoringReportGenerator` producing structured report objects with summary (trend, percentage, lowest/highest flags), changes list, performance metrics, and errors.

## Consequences
- Standardized reporting across all monitored products.
- Foundation for future dashboard and alerting integrations.
