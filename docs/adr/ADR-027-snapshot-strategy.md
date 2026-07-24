# ADR-027: HTML Failure Snapshot Strategy

## Status
Accepted

## Context
When DOM extraction fails or layout changes break selectors, post-mortem debugging requires inspecting the exact HTML page structure seen at execution time.

## Decision
We implement `SnapshotManager` and `HtmlSanitizer` to save sanitized HTML snapshots upon extraction failures.

## Consequences
- Fast diagnosis of broken selectors.
- Sanitized HTML storage preventing token leakage.
