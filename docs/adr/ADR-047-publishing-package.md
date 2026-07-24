# ADR-047: Immutable Publishing Package DTO

## Status
Accepted

## Context
Downstream publishing services require a self-contained, tamper-proof payload encapsulating all rendered messages, affiliate links, processed images, and metadata for a deal.

## Decision
We implement `PublishingPackage` as an immutable DTO using `Object.freeze()` to lock all payload properties upon creation.

## Consequences
- Guaranteed payload immutability across async worker steps.
- Single source of truth for channel broadcasting.
