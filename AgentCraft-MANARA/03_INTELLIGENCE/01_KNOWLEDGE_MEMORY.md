# Cumulative Intelligence Memory


> **MANARA Foundation v1.0 · 2026-10-18 · Design specification, not implemented software.**
> Canonical source: `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA`.
> Code only: `https://github.com/mayakilzy/AgentCraft-MANARA`.
> General standards: `https://github.com/mayakilzy/repo-info/tree/main/START-HERE`.

## Mission
Investigations create reusable structured knowledge while filtering duplication, unsourced speculation, stale facts, and cross-tenant leakage. **MANARA learns from every investigation, but trusts only what it can trace.**

## Memory tiers
- Working investigation memory: search hits, drafts, hypothesis notes, transient agent state, intermediate extractions, execution checkpoints; scoped to investigation and tenant; expiry/retention policies.
- Curator gate: normalization, source identity, evidence comparison, duplicates, independence, contradictions, uncertainty and privacy/licensing clearance.
- Cumulative knowledge: source, evidence spans, claims, measures/time series, entities and edges, hypotheses, forecasting runs, evaluations; materialized documents only if rights allow. Also capability/mold/agent **recipes**, distinct from factual knowledge.

## Core entities / relations
`source_record`; `source_snapshot`; `evidence_item` (quote/span/data/sample/checksum); `claim` (bounded statement); `claim_support` (supports/refutes/qualifies, independence group); `entity`; `entity_relation`; `measure` (value/unit/methodology/geography/valid time); `hypothesis`; `scenario`; `forecast` (target/horizon/baseline/model); `forecast_outcome`; `investigation`; `retrieval_run`; `publication_snapshot`; `capability_use`; `agent_recipe` and registry references.

## Provenance and time
W3C PROV-like `was_derived_from`, `was_generated_by`, `used` edges. Save `observed_at`, `published_at`, `valid_from/to`, `ingested_at`, `known_at` and revision/withdrawal date where relevant. Bitemporal awareness: world-time versus knowledge-time; experiments/backtests cannot reference later data. Never silently edit published forecast or old citation set.

## Storage choice
PostgreSQL as authoritative structured store, relation-edge tables for graph semantics, full-text search and optional pgvector for semantic retrieval, local/S3-compatible object storage for permitted source snapshots and generated artifacts. This is not an auto-reasoning vector DB; vector similarity ≠ scientific evidence or causal proof. Add graph DB only if query evidence warrants.

## Curator algorithm
1. Canonicalize URLs/DOIs/IDs, checksum content. 2. Separate syndicated copies from independent evidence. 3. Extract structured claim plus precise support span with metadata. 4. Cross-check units, date, population, conditions. 5. Preserve disagreement and source hierarchy. 6. Label `candidate`, `supported`, `contested`, `refuted`, `superseded`, never silently delete. 7. Promotion according to evidence/rights policy. 8. Audit lineage and version pin.

## Reuse policy
New investigation searches prior relevant memory first, assesses freshness/scope and tenant rights, opens new queries for gaps, and records what was reused vs newly found. No cross-client proprietary data without explicit rights. Deletion/retention/subject rights must be supported where applicable while retaining publication audit proofs in permitted form.

## Metrics and regression
Dedup effectiveness with false-merge rate, citation exactness, cross-tenant isolation, contested-claim preservation, temporal leakage tests, reuse relevance and contradiction detection; quality is not count of stored documents.
