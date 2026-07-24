# End-to-End Integration & System Orchestration Specification

## 1. Executive Overview
The **End-to-End Integration & System Orchestration Layer** unifies all 13 platform subsystems of **Crazy Loots India** into a single production workflow. It orchestrates system startup, dependency validation, background task workers, periodic scheduling, environment profiles (`development`, `staging`, `production`), health monitoring, readiness checks, diagnostic reporting, and full pipeline execution using REAL Amazon product URLs in `DRY_RUN` mode.

---

## 2. Functional Requirements

### 2.1 System Orchestrator & Startup Lifecycle
- `SystemOrchestrator` coordinates system initialization order: Database $\rightarrow$ Repositories $\rightarrow$ Merchant Registry $\rightarrow$ Browser Platform $\rightarrow$ Monitoring Engine $\rightarrow$ Deal Engine $\rightarrow$ Affiliate Engine $\rightarrow$ Publishing Engine.
- `StartupManager`, `Bootstrap`, and `LifecycleManager` handle graceful startup and shutdown hooks.

### 2.2 Environment Profiles & Seeder
- `EnvironmentProfileManager` provides environment profiles (`development`, `staging`, `production`) specifying publishing modes, feature flags, and log levels.
- `SeederService` seeds default merchants, channels, monitoring configurations, and feature flags.

### 2.3 Health, Readiness & Diagnostics
- `ReadinessService` performs pre-flight subsystem checks.
- `SystemHealthService` extends health APIs to monitor all 13 subsystems.
- `DiagnosticsService` generates diagnostic reports (subsystem health, feature flags, node environment, versions).

### 2.4 Workers & Scheduler
- `MonitoringWorker` processes monitoring jobs while respecting execution locks.
- `IntegratedScheduler` connects monitoring configurations to interval timers with pause, resume, and shutdown methods.

### 2.5 End-to-End Pipeline & DRY_RUN Safety
- `EndToEndPipeline` executes the complete workflow using REAL Amazon product URLs:
  `Amazon Product URL` $\rightarrow$ `Playwright Extraction` $\rightarrow$ `ProductDTO` $\rightarrow$ `Monitoring Engine` $\rightarrow$ `Deal Detection` $\rightarrow$ `Approval Queue` $\rightarrow$ `Publishing Preparation` $\rightarrow$ `Telegram Publishing (DRY_RUN)` $\rightarrow$ `Publishing History`.
- Every stage is correlated via Trace ID, Correlation ID, and Execution ID.
- `DryRunValidator` guarantees pipeline dispatches remain safely in `DRY_RUN` mode without sending live broadcasts.

---

## 3. Non-Functional Requirements
- **Safety Guarantee**: MUST NEVER publish live messages to public Telegram channels during test execution.
- **Traceability**: Immutable Trace ID, Correlation ID, and Execution ID attached to every pipeline run.
- **Execution Performance**: Complete E2E pipeline execution latency < 2500ms (including DOM extraction).
