# ADR-058: Exponential Backoff & Dead Letter Queue

## Status
Accepted

## Context
Transient network errors or Telegram 429 FloodWait rate limits require automatic retry handling with backoff delays to prevent task loss.

## Decision
We implement `RetryEngine` providing exponential backoff calculations, retry attempt logging, and Dead Letter Queue (`DLQ`) routing upon exceeding max retries.

## Consequences
- Resilient error handling for transient failures.
- Post-mortem inspection capability for DLQ tasks.
