# ADR-054: Telegram Publishing Engine Architecture

## Status
Accepted

## Context
Publishing deals to Telegram requires decoupling message content generation from delivery mechanics to ensure reliability, rate-limit safety, and testability.

## Decision
We implement `TelegramPublisher` solely dedicated to consuming validated `PublishingPackage` objects and dispatching them via state machines, strategies, and queues.

## Consequences
- Strict separation of concerns (Content Generation vs Delivery).
- High system resilience and modularity.
