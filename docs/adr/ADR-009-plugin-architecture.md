# ADR-009: Extensible Plugin Architecture

## Status
Accepted

## Context
Integrating third-party tools (Playwright, Telegram, Affiliate networks, AI scoring engines, Analytics) into the core engine can create heavy dependencies and tight coupling if hardcoded.

## Decision
We implement `PluginInterface` (`initialize()`, `shutdown()`, `healthCheck()`, `metadata()`). Features plug into the engine as independent lifecycle-managed plugins (`PlaywrightPlugin`, `TelegramPlugin`, `AffiliatePlugin`, etc.).

## Consequences
- Independent module lifecycle management.
- Ability to enable/disable complex extensions cleanly.
