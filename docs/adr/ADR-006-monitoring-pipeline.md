# ADR-006: Monitoring Pipeline Architecture

## Status
Accepted

## Context
The e-commerce deal monitoring process involves multiple sequential processing steps: task validation, merchant resolution, priority assignment, policy evaluation, scraping execution, price processing, and notification dispatch. Coupling these steps directly into a monolith leads to rigid, untestable code.

## Decision
We implement a modular, priority-sorted Pipeline Coordinator (`PipelineCoordinator`) executing decoupled stages (`PipelineStage`) and middleware (`PipelineMiddleware`). Stage execution supports automatic rollback on failures and emits granular lifecycle events (`PipelineStarted`, `StageStarted`, `StageFailed`, etc.).

## Consequences
- Highly modular stage pipeline.
- Easy addition of new processing stages without touching existing stages.
- Automatic stage rollback guarantees transaction consistency.
