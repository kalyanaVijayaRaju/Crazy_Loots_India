# ADR-074: Execution Replay Architecture

## Status
Accepted

## Context
When debugging production issues or validating fixes, operators need the ability to replay previous pipeline executions without re-running live scraping.

## Decision
Implement ExecutionReplayService (in-memory) and ExecutionArchiveService (disk-backed) to capture and restore execution snapshots including PublishingPackage, TraceContext, Metrics, and Timeline.

## Consequences
- Previous executions can be replayed for debugging without re-scraping
- Snapshots are persisted to disk for historical analysis
- Replay log tracks all replay operations
- Memory-bounded with configurable limits
