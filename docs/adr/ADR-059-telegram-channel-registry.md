# ADR-059: Telegram Channel Registry & Routing

## Status
Accepted

## Context
Future scaling will require broadcasting deals across niche channels (Loot Deals, Electronics, Fashion, Coupons) based on category and merchant.

## Decision
We implement `TelegramChannelRegistry` and `ChannelRouter` mapping publishing packages to target channels based on priority and publishing mode.

## Consequences
- Multi-channel routing readiness.
- Centralized channel configuration management.
