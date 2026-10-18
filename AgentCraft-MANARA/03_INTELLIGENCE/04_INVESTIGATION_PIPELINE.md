# Investigation Workflow & State Machine


> **MANARA Foundation v1.0 · 2026-10-18 · Design specification, not implemented software.**
> Canonical source: `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA`.
> Code only: `https://github.com/mayakilzy/AgentCraft-MANARA`.
> General standards: `https://github.com/mayakilzy/repo-info/tree/main/START-HERE`.

## End-to-end state graph
`received → scoped → coverage_checked → [building_capabilities?] → mold_ready → acquiring → normalizing → evidencing → forecasting_or_scenarios → drafting → verification → deliverable_ready → archived`.
Each state: owner, checkpoint hash, retry semantics, evidence, next action; pending failures visible and recoverable; no fake completion. All task-specific limits adapt to provider/owner operational settings (no arbitrary hard experimental budgets), but enforce security, tenant boundaries and controlled resource management.

## Source results policy
Capture search query and timestamp, provider response IDs, pagination, crawl rights, raw metadata, normalized entity, citations, duplicates and missingness. Search failures become explicit gaps. Do not make up scholarly titles, URL or quotes.

## Evidence policy
Every substantive user-facing claim has traceable evidence or `analysis/hypothesis/scenario` label. Preserve contradicting sources; rank according to relevance/method not just popularity. Check source provenance and original independent support; legal/medical/public policy findings require high standards and appropriate disclaimers.

## Replay and workflows
Idempotent stages, checkpoints, safe resume, immutable publication. Tenant scopes from authorization through all jobs/joins/embeddings/object storage. Store audit and validation logs without raw credentials.
