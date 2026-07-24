# ADR-040: Data-Driven Rule Engine & Versioning

## Status
Accepted

## Context
Hardcoding business criteria for deal eligibility inside monolithic functions makes it difficult to adjust deal thresholds or test new rules safely.

## Decision
We implement `RuleEngine`, `RuleRegistry`, and `RuleVersionManager` supporting data-driven rules, priority sorting, versioning, rollback, and offline dry-run simulation via `RuleSimulator`.

## Consequences
- Flexible, configurable rule management.
- Zero-risk rule testing and version rollback capabilities.
