# ADR-062: Publishing Message Rollback Strategy

## Status
Accepted

## Context
When deals expire unexpectedly or prices revert immediately after publishing, operators must be able to delete or edit published Telegram posts to mark them expired.

## Decision
We implement `PublishingRollbackService` providing message deletion and message editing capabilities for published Telegram posts.

## Consequences
- Fast remediation for expired or erroneous deals.
- Support for both hard deletion and soft expired-tag editing.
