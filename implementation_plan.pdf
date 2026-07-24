# Phase 10: Product Monitoring & Price Tracking Engine Implementation Plan

We are building the **Product Monitoring & Price Tracking Engine** for **Crazy Loots India**.

This phase establishes product monitoring scheduling configurations, price comparison rules (`UP`, `DOWN`, `UNCHANGED`, `NEW_LOW`, `NEW_HIGH`), product change detection across 9 product attributes, execution locks, monitoring policies (`PausePolicy`, `CooldownPolicy`, `FailurePolicy`), run history logging, report generation, telemetry metrics, and domain events (`MonitoringStarted`, `PriceChanged`, `LowestPriceReached`, etc.).

---

## User Review Required

> [!IMPORTANT]
> - **Branching**: Operating on feature branch `feature/product-monitoring`.
> - **Pure Price & Product Tracking**: Implements price comparison, change detection, repository persistence (`Product`, `PriceHistory`, `MonitoringConfiguration`, `MonitoringRun`), and monitoring event notifications. No deal detection algorithms or Telegram publishing are included.
> - **Locking & Policy Guardrails**: Prevents duplicate concurrent executions per product (`MonitoringLockManager`) and enforces cooldown/pause policies (`CooldownPolicy`, `PausePolicy`).

---

## Proposed Changes

### Models & Repositories (`backend/src/models/` & `repositories/`)
- **[NEW] [monitoringConfiguration.model.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/models/monitoringConfiguration.model.js)** & **[monitoringConfiguration.repository.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/repositories/monitoringConfiguration.repository.js)**: Schema and repository for product monitoring schedules.
- **[NEW] [monitoringRun.model.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/models/monitoringRun.model.js)** & **[monitoringRun.repository.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/repositories/monitoringRun.repository.js)**: Schema and repository for recording execution histories.
- **[MODIFY] [models/index.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/models/index.js)** & **[repositories/index.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/repositories/index.js)**: Export new models and repositories.

### Monitoring Core Modules (`backend/src/monitoring/`)
- **[NEW] [monitoringEventTypes.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/monitoring/events/monitoringEventTypes.js)**: Monitoring event constants.
- **[NEW] [priceComparisonService.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/monitoring/comparison/priceComparisonService.js)**: Compares current price against stored/historical price, returning trend (`UP`, `DOWN`, `UNCHANGED`, `NEW_LOW`, `NEW_HIGH`), percentage change, and lowest/highest ever flags.
- **[NEW] [productChangeDetector.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/monitoring/detector/productChangeDetector.js)**: Detects changes in Price, Rating, Reviews, Availability, Seller, Images, Coupon, Delivery, and Title.
- **[NEW] [monitoringLockManager.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/monitoring/locks/monitoringLockManager.js)**: In-process execution lock manager enforcing one task per product.
- **[NEW] Monitoring Policies**:
  - `policies/pausePolicy.js`, `policies/cooldownPolicy.js`, `policies/failurePolicy.js`.
- **[NEW] History & Reports**:
  - `history/monitoringHistoryService.js`: Records `MonitoringRun` history.
  - `reports/monitoringReportGenerator.js`: Generates detailed `MonitoringReport` objects.
- **[NEW] Telemetry & Service Orchestration**:
  - `metrics/monitoringMetrics.js`: Collects monitoring counters and latencies.
  - `services/productMonitoringService.js`: Orchestrates end-to-end product monitoring, change detection, persistence, run history, and event emission.
- **[NEW] [index.js](file:///c:/NodeProjects/Crazy_Loots_India/backend/src/monitoring/index.js)**: Re-exports monitoring components.

### Documentation & ADRs
- **[NEW] ADR Documents (`docs/adr/`)**:
  - `ADR-033-monitoring-configuration.md`
  - `ADR-034-price-comparison.md`
  - `ADR-035-monitoring-history.md`
  - `ADR-036-product-change-detection.md`
  - `ADR-037-monitoring-reports.md`
  - `ADR-038-monitoring-locks.md`
- **[MODIFY] [docs/architecture.md](file:///c:/NodeProjects/Crazy_Loots_India/docs/architecture.md)**: Updated with Product Monitoring & Price Tracking specifications.

---

## Verification Plan

### Automated Verification Script
1. **ESLint Audit**: Run `npm run lint` in `backend/`.
2. **Product Monitoring Engine Verification Script**:
   - Verify `PriceComparisonService` trend detection (`UP`, `DOWN`, `UNCHANGED`, `NEW_LOW`, `NEW_HIGH`) and percentage calculation.
   - Verify `ProductChangeDetector` detecting changes across title, price, rating, review count, availability, and seller.
   - Verify `MonitoringLockManager` acquiring and releasing product locks.
   - Verify `CooldownPolicy` and `PausePolicy` evaluation.
   - Verify `ProductMonitoringService` end-to-end execution flow: Monitored Product $\rightarrow$ Task $\rightarrow$ Engine $\rightarrow$ DTO $\rightarrow$ Comparison $\rightarrow$ Repositories Persistence $\rightarrow$ Run History $\rightarrow$ Event Emission.
   - Verify `MonitoringReportGenerator` report output.
