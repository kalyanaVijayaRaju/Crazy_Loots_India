# ADR-063: Telegram Client Abstraction

## Status
Accepted

## Context
Directly coupling the publishing engine to third-party Telegram bot SDKs or HTTP libraries hampers offline contract testing and mode-switching.

## Decision
We implement `TelegramClientInterface`, `MockTelegramClient`, and `RealTelegramClient` accessed via `TelegramClientFactory`.

## Consequences
- Complete isolation from Telegram API implementation details.
- High testability via mock client injection during testing and `DRY_RUN` modes.
