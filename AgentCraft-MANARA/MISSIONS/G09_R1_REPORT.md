# MANARA — G09-R1 Final Operational Acceptance Report

> Code: https://github.com/mayakilzy/AgentCraft-MANARA (commit `ce1dfb0`)

## Status: PASS

The investigation journey works end-to-end with real IDs.

## Acceptance Matrix

| Criterion | Status | Evidence |
|-----------|--------|----------|
| InvestigationRow auto-created | ✅ PASS | MoldArchitect creates real inv-xxx ID |
| Mold linked to investigation | ✅ PASS | Gap analyses reference investigation_id |
| Evidence ingested for real investigation | ✅ PASS | MemoryCurator links evidence to inv_id |
| Publication uses real investigation_id | ✅ PASS | No inv-session fallback |
| Publication downloadable | ✅ PASS | 619 chars Markdown, correct title |
| No fallback IDs | ✅ PASS | Checked all publications |
| Evidence integrity in claims | ✅ PASS | All claims reference real G03 evidence |
| 279 backend tests pass | ✅ PASS | ruff + mypy + tsc clean |
| Playwright browser E2E | ❌ NOT TESTED | Playwright not in sandbox |
| Live LLM | ❌ NOT TESTED | MockProvider only |
| PostgreSQL + pgvector | ❌ NOT TESTED | SQLite only |
| Docker Compose | ❌ NOT TESTED | Documented, not executed |
| Cross-domain pilots U01-U03 | PARTIAL | Journey proven, live data not collected |

## Journey proven:
Question → Investigation (real ID) → Mold → Evidence → Claim → Publication → Download
