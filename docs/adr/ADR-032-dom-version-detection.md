# ADR-032: DOM Version Detection Architecture

## Status
Accepted

## Context
E-commerce platforms periodically roll out new frontend layouts or A/B tests. Detecting layout changes before extraction failures occur helps maintain high reliability.

## Decision
We implement `DOMVersionDetector` to analyze HTML structures and categorize layout versions (`AMAZON_DESKTOP_V1`, `AMAZON_DESKTOP_V2`, `AMAZON_MOBILE_V1`), emitting warnings when unexpected layouts appear.

## Consequences
- Proactive detection of merchant DOM redesigns.
- Early warning system for scraper maintenance.
