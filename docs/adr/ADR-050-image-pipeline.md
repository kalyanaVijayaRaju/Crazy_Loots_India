# ADR-050: Multi-Format Image Pipeline

## Status
Accepted

## Context
E-commerce deal images must be resized, compressed, and formatted into thumbnails, banners, and social preview assets for optimal display across channels.

## Decision
We implement `ImagePipeline` to transform raw product images into multi-channel image mappings (`thumbnail`, `banner`, `socialPreview`, `compressed`, `watermarked`).

## Consequences
- Optimized image asset dimensions per channel.
- Fallback image protection against broken product images.
