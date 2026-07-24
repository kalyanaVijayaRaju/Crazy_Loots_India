# ADR-060: Pre-Dispatch Delivery Validation

## Status
Accepted

## Context
Attempting to publish packages with missing affiliate links or unapproved deal status wastes resources and can cause invalid dispatches.

## Decision
We implement `DeliveryValidator` checking deal approval status, affiliate link integrity, message payload, and channel configuration prior to dispatch.

## Consequences
- Guaranteed payload validity before channel entry.
- Pre-flight rejection of invalid tasks.
