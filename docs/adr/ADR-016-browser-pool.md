# ADR-016: Reusable Browser Pool Architecture

## Status
Accepted

## Context
Launching browser instances per scraping job incurs massive CPU and memory overhead (~500ms to 2s per launch). Reusing browser instances across requests is mandatory for high-throughput deal monitoring.

## Decision
We implement `BrowserPool` to manage a pool of running browser instances (`maxBrowsers: 2`). Scraping requests acquire pooled browser instances and release them when done.

## Consequences
- Significant latency reduction for scraping operations.
- Controlled memory footprint.
