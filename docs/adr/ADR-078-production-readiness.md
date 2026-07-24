# ADR-078: Production Readiness Checklist

## Status
Accepted

## Context
Deploying to production without a systematic readiness check risks exposing configuration errors, missing dependencies, or unresolved alerts to end users.

## Decision
Implement ProductionReadinessChecker that evaluates 8 categories (configuration, health, recovery, monitoring, alerts, publishing, performance, security) and produces a scored checklist with pass/fail status per item.

## Consequences
- Deployments are validated systematically before go-live
- Readiness score provides a single metric for deployment confidence
- Failed checks identify specific issues requiring resolution
- Checklist is accessible via the Observability API
