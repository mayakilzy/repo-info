# Capability Registry and Rich Search Cards


> **MANARA Foundation v1.0 · 2026-10-18 · Design specification, not implemented software.**
> Canonical source: `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA`.
> Code only: `https://github.com/mayakilzy/AgentCraft-MANARA`.
> General standards: `https://github.com/mayakilzy/repo-info/tree/main/START-HERE`.

## The compounding asset
Registry stores reviewed discoverable **capability units** with rich descriptions, 15–30 *meaningfully different* example intents when justified, multilingual tags/synonyms, negative cases, technical schema, source/rights, provenance, trust and evaluation. **Coverage beats raw item count.** Enable thousands without loading all card text into LLM context.

## Data records
`Source` canonical ID and license snapshot; `Connector` implementation SHA, provider mappings and tests; `Engine` logical search profile and examples; `Relationship` uses/complements/replaces/specializes; `CapabilityEvaluation` dated live sample; `RunUsage` tenant-aware success/failure stats; `Recommendation` suggested engine for task types; `Approval` reviewer and rationale.

## Auto-enrichment policy
Search Foundry drafts descriptions/keywords/use cases but does not assert verified claims absent tests. Curator suggests new validated use cases from successful investigations and alerts for failure or outdated source. Changes versioned and proposed, not silently written over approved public contract.

## Engine select metrics
Intent-coverage recall, top-k useful retrieval, precision, human relevance judgment, false-positive misuse frequency, runtime success, freshness and license eligibility. Penalize redundant nearly identical engines and stale adapters. Dynamic composition picks several complementary engines rather than a single name match.

## Registry growth decision
Keep stable tested connectors; keep lightweight logical capability recipes if discoverable and valuable; archive stale or redundant; cache tenant-specific indices with RBAC. Zero need for permanent worker per engine. Maintenance schedules only for most-used / highest risk connectors, not every rare investigative question.
