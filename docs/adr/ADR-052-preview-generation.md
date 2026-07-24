# ADR-052: Multi-Channel Preview Generation

## Status
Accepted

## Context
Operators reviewing approved deals require visual previews of rendered posts across target channels (Telegram, Website, WhatsApp) prior to dispatch.

## Decision
We implement `PreviewGenerator` returning structured preview payloads tailored for channel UI rendering.

## Consequences
- Accurate pre-broadcast post inspection.
- Improved manual review efficiency.
