# ADR-061: Publishing History Persistence

## Status
Accepted

## Context
Auditing Telegram broadcasts requires mapping every published `PublishingPackage` to its resulting Telegram Message ID, channel, and dispatch duration.

## Decision
We implement `PublishingHistoryService` persisting broadcast records to MongoDB via `TelegramPostRepository`.

## Consequences
- Full audit log of all published Telegram posts.
- Ability to correlate Telegram Message IDs with deal documents.
