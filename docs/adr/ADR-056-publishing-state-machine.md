# ADR-056: Publishing State Machine

## Status
Accepted

## Context
Tracking publishing task lifecycle states requires unambiguous transition rules to prevent invalid operations (e.g. attempting to publish an unapproved deal).

## Decision
We implement `PublishingStateMachine` enforcing 10 discrete states (`CREATED`, `VALIDATED`, `APPROVED`, `QUEUED`, `PUBLISHING`, `PUBLISHED`, `FAILED`, `REJECTED`, `EXPIRED`, `ARCHIVED`).

## Consequences
- Predictable task lifecycle management.
- Guardrails preventing invalid status jumps.
