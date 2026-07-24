# ADR-044: Deal Explainability Engine

## Status
Accepted

## Context
Black-box scoring outputs make it difficult for human reviewers or operators to understand why a deal was detected or prioritized.

## Decision
We implement `DealExplainabilityEngine` generating structured bullet points (`✓ Lowest price in 180 days`, `✓ 44% discount off list price`) explaining the exact qualification factors.

## Consequences
- Transparent deal scoring rationale.
- Fast review workflow for manual approvers.
