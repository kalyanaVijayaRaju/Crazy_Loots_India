# ADR-011: Monitoring Orchestrator Pattern

## Status
Accepted

## Context
Executing price monitoring requests requires coordinating several decoupled subsystems: Pipeline middleware, Merchant Factory dispatchers, Executor strategies, Queue managers, State machines, Telemetry metrics, and Event Bus listeners. Coupling these into controllers or scrapers creates complex dependencies.

## Decision
We implement the Orchestrator Pattern with `MonitoringEngine` as the external facade and `MonitoringCoordinator` as the internal workflow coordinator. The engine accepts `MonitoringTask`, runs lifecycle hooks, dispatches adapters via `MerchantDispatcher`, executes task strategies via `ExecutorFactory`, tracks retries, and returns an immutable `MonitoringResult`.

## Consequences
- Unified orchestration layer.
- Zero direct coupling between scrapers and merchant API logic.
