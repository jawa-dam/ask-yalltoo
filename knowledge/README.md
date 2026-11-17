# GEI Knowledge Library

This directory contains the authoritative research documents for Genesis Engineered Interpretation (GEI).

## Structure

- **genesis/** — Day-by-day analysis of the creation narrative (Genesis 1–6, KJV)
- **adam-the-dam/** — The Adam/A-DAM hypothesis and supporting analysis
- **firmament/** — The firmament and heaven interpretations
- **hydrology/** — Water systems and hydraulic engineering connections
- **hebrew-linguistics/** — Linguistic analysis and word studies
- **engineering/** — Engineering comparisons and analogies
- **creation-symbolism/** — Symbolic mapping of creation elements
- **questions/** — Common questions and research investigations

## Document Format

Each document uses frontmatter metadata:

```yaml
---
title: "Document Title"
category: "genesis | adam-the-dam | firmament | hydrology | linguistics | engineering | symbolism"
tags: ["tag1", "tag2"]
evidence_level: "textual | linguistic | hypothesis | engineering-analogy | research-question"
genesis_day: 1-6 (if applicable)
related: ["other-doc-slug"]
last_updated: "YYYY-MM-DD"
status: "published | draft | placeholder"
---
```

## Adding New Documents

Simply create a new `.md` file in the appropriate subdirectory with valid frontmatter. The indexing system automatically discovers and indexes all Markdown files in this directory tree.
