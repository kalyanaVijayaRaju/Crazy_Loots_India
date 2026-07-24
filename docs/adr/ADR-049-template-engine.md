# ADR-049: Multi-Channel Template Engine

## Status
Accepted

## Context
Publishing deals across multiple channels (Telegram, Website, WhatsApp, Push, Email) requires channel-specific message formatting without duplicating rendering logic.

## Decision
We implement `TemplateRegistry` and `MessageRenderer` executing channel-specific data-driven template implementations (`TelegramTemplate`, `WebsiteTemplate`, etc.).

## Consequences
- Clean separation of channel layout formatting.
- Easy addition of new publishing channels.
