# ADR-075: Alert Engine Design

## Status
Accepted

## Context
The system needs proactive alerting for critical events (selector failures, browser crashes, Telegram offline, etc.) rather than relying on log inspection.

## Decision
Implement AlertEngine with configurable thresholds, severity levels (INFO/WARNING/CRITICAL/FATAL), and listener callbacks. Integrate with FailureClassifier for automatic error categorization.

## Consequences
- Alerts are generated automatically when thresholds are exceeded
- Failure classification enables appropriate response strategies
- Alert history is queryable via the Observability API
- Listeners enable future integration with external alerting systems (PagerDuty, Slack, etc.)
