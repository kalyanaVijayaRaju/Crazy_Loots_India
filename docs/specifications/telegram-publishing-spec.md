# Telegram Publishing Engine Specification

## 1. Executive Overview
The **Telegram Publishing Engine** is responsible for delivering validated `PublishingPackage` objects to Telegram channels for **Crazy Loots India**. It strictly follows the Single Responsibility Principle, consuming pre-generated, validated publishing packages and executing safe dispatches through a 10-state Publishing State Machine, priority queue, configurable strategies, and decoupled client adapters.

---

## 2. Functional Requirements

### 2.1 Publishing Modes & Feature Flags
- Modes: `DRY_RUN` (Default), `SANDBOX`, `LIVE`.
- In `DRY_RUN` mode, no external Telegram HTTP requests are dispatched, but complete state machine, validation, queueing, audit, and event pipelines execute.
- Feature flags: `ENABLE_LIVE_PUBLISHING`, `ENABLE_SANDBOX`, `ENABLE_DRY_RUN`, `ENABLE_MESSAGE_EDITING`, `ENABLE_MESSAGE_DELETION`.

### 2.2 Telegram Client Abstraction
- Abstract client interface (`TelegramClientInterface`).
- `MockTelegramClient`: Offline contract tests and `DRY_RUN`/`SANDBOX` simulation.
- `RealTelegramClient`: Live Telegram Bot API client.
- `TelegramClientFactory`: Client provider based on active publishing mode.

### 2.3 Publishing State Machine
- 10 explicit states: `CREATED`, `VALIDATED`, `APPROVED`, `QUEUED`, `PUBLISHING`, `PUBLISHED`, `FAILED`, `REJECTED`, `EXPIRED`, `ARCHIVED`.
- Strict transition validation via `PublishingStateMachine`.

### 2.4 Channel Registry & Routing
- `TelegramChannelRegistry` manages channel configurations, rate limits, priorities, and status.
- `ChannelRouter` routes publishing packages to target channels.

### 2.5 Publishing Strategies & Queue
- Interchangeable strategies (`ImmediatePublishingStrategy`, `ScheduledPublishingStrategy`, `ManualPublishingStrategy`, `RetryPublishingStrategy`).
- Priority `PublishingQueue` supporting `enqueue`, `dequeue`, `pause`, `resume`, `cancel`, `clear`.

### 2.6 Retry Engine, Rollback & Revisions
- `RetryEngine`: Exponential backoff calculation and Dead Letter Queue (`DLQ`).
- `PublishingRollbackService`: Message deletion and edit rollback capabilities.
- `MessageVersionManager`: Revision history tracking.

### 2.7 Health, History & Telemetry
- `TelegramHealthService` for bot connectivity checks.
- `PublishingHistoryService` for database audit persistence via `TelegramPostRepository`.
- `TelegramPublishingMetrics` for operational metrics.

---

## 3. Non-Functional Requirements
- **Single Responsibility Principle**: Must NEVER generate business content, messages, or affiliate links.
- **Latency**: In-memory task processing latency < 10ms.
- **Zero Accidental Live Broadcasts**: Default mode MUST be `DRY_RUN`.
