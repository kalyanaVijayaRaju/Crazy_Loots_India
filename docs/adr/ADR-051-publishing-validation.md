# ADR-051: Publishing Content Validation

## Status
Accepted

## Context
Publishing invalid, unapproved, or misformatted deal messages risks damaging platform reputation or failing platform character limit constraints.

## Decision
We implement `ContentValidator` to enforce approval state, pricing bounds, affiliate URL presence, and character count limits before package compilation.

## Consequences
- Protection against invalid or malformed deal broadcasts.
- Validation results embedded directly in the `PublishingPackage`.
