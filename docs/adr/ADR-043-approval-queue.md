# ADR-043: Manual Approval Queue Workflow

## Status
Accepted

## Context
Automated deal publishing without human verification risks sending inaccurate or low-quality deals to public Telegram channels.

## Decision
We implement `DealApprovalQueueService` enforcing a `PENDING` state for all newly detected deals. Deals must be explicitly transitioned to `APPROVED` or `REJECTED` by an authorized reviewer.

## Consequences
- Guaranteed human oversight before publishing.
- Audit history logging for every approval decision via `DealHistoryRepository`.
