# ADR-057: Priority Publishing Queue

## Status
Accepted

## Context
High-score loot deals require faster dispatch than regular price drop notifications during burst deal windows.

## Decision
We implement `PublishingQueue` supporting priority ordering, pause, resume, cancel, and clear capabilities.

## Consequences
- High-priority deals bypass lower-priority items.
- Full operator queue control.
