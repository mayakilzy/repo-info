# AgentCraft Synapse — Session Handover
## New GLM Session Continuation Document

**Created**: 2026-10-10
**Authoritative HEAD**: `be78c253578393b928d78a4ac55220700bee9019`
**Branch**: `main`
**Repository**: https://github.com/mayakilzy/AgentCraft_Synapse.git
**Current Phase**: G05-T04 complete; G05-T05 NOT YET AUTHORIZED

---

## 1. Quick Start (for the new GLM session)

### 1.1 Import credentials

The access token is stored at:
```
/home/z/my-project/.secure/credentials  (mode 0600)
/home/z/my-project/.secure/repo_url     (mode 0600)
```

If these files exist, the repository is already cloned at:
```
/home/z/my-project/repos/AgentCraft_Synapse/
```

If the files are missing (session was reset), re-import from:
```
https://raw.githubusercontent.com/mayakilzy/repo-info/main/AgentCraft_Synapse/newT8.zip
```
Extract, strip `+` characters from the token, save to `.secure/credentials`.
Delete the zip after import.

### 1.2 Clone or sync the repository

```bash
cd /home/z/my-project/repos/AgentCraft_Synapse
git fetch origin
git log --oneline -5
git rev-parse HEAD
# Should show: be78c253578393b928d78a4ac55220700bee9019
```

### 1.3 Install the package

```bash
/home/z/.venv/bin/python -m pip install -e ".[dev]"
```

### 1.4 Verify baseline

```bash
/home/z/.venv/bin/python -m ruff check src tests scripts examples
make openapi-check
/home/z/.venv/bin/python -m pytest tests/ -q --no-cov -p no:cacheprovider
# Expected: 532 passed, 3 skipped, 0 failed
```

---

## 2. Project overview

AgentCraft Synapse is an intelligent technical knowledge and innovation platform.
It discovers evidence, extracts structured knowledge, models relationships and
capabilities, reasons across them, proposes innovations, critiques hypotheses,
designs experiments, and updates beliefs from results.

**Architecture**: Modular monolith (FastAPI + SQLAlchemy 2.0 + Pydantic v2).
PostgreSQL in production, SQLite in tests. No graph database, no Redis, no
message broker. API-first (`/api/v1`). 11 ADRs (0001-0011).

**Engineering principle**: Small in code, large in capability.

---

## 3. Completed stages

| Group | Status | Tasks |
|-------|--------|-------|
| G01 — Foundation | PASS | 12 typed domain records, 6 ORM tables, 4 migrations, FastAPI app, SSRF guard |
| G02 — Acquisition | FUNCTIONAL PASS WITH LIMITATIONS | 3 providers (arxiv_search, trafilatura, content_delta_hash), SSRF IP-pinning |
| G03 — Knowledge & Verification | FUNCTIONAL PASS WITH LIMITATIONS | 9 typed knowledge units, RelationshipService, deterministic-v2 verification |
| G04-T01 — Hybrid Retrieval | PASS WITH LIMITATIONS | Lexical + structured + graph + evidence-aware reranking |
| G04-T02 — Capability Registry | PASS WITH LIMITATIONS | 6-class gap analyzer (SUPPORTED/NOT_EVIDENCED/CONTESTED/CONSTRAINED/etc.) |
| G04-T02C — Provider Attribution Closure | PASS | Filter claims by candidate attribution |
| G04-T03 — Grounded Reasoning | PASS WITH LIMITATIONS | 6 intents, FindingType, citation chains |
| G04-T03C — Context Contradiction Closure | PASS | Out-of-context contradictions preserved as metadata, not CONTESTED |
| G04-T04 — Evaluation + Cost Routing | PASS WITH LIMITATIONS | 14 golden cases, 6 quality gates, 3-path router (A/B/C) |
| G04-T04C — Evaluation Integrity Review | PASS WITH MINIMAL CORRECTIONS | Router uses context parameter; 14 negative quality-gate tests |
| G04-T05 — External Client Compatibility | PASS WITH LIMITATIONS | 18 HTTP contract tests, examples/client_g04.py, OpenAPI 3.1.0 |
| **G04 CLOSURE** | **READY FOR REVIEW** | 532 tests pass, 0 fail, 3 skipped |
| G05-P00 — Innovation Plan | PLANNING COMPLETE | 6 sequential tasks (T01-T06) defined |
| G05-P00C — Plan Correction | COMPLETE | 3 corrections (Genuine Innovation, Persistence Isolation, Experiment Policy) |
| G05-T01 — Knowledge Combination | PASS WITH LIMITATIONS | `combine_knowledge()`, epistemic isolation fix (`include_hypothesized=False`) |
| G05-T02 — Opportunity Discovery | PASS WITH LIMITATIONS | `discover_opportunities()`, gap_analyzer hypothesized-origin filter |
| G05-T03 — Innovation Generation | PASS WITH LIMITATIONS | `generate_innovations()`, 6 templates, `POST /api/v1/innovations/generate` activated |
| G05-T03C — Identity & Idempotency | FOCUSED CORRECTION — PASS | Deterministic concept fingerprints, idempotent reuse |
| G05-T05 — Experiment Planning | **NOT AUTHORIZED** | |
| G05-T06 — Evidence Feedback | **NOT AUTHORIZED** | |

---

## 4. Current state

- **HEAD SHA**: `be78c253578393b928d78a4ac55220700bee9019`
- **Tests**: 532 passed / 0 failed / 3 skipped (live)
- **Ruff**: 135 files, all pass
- **OpenAPI**: 3.1.0 validates
- **Working tree**: CLEAN (file-mode artifacts on existing files are sandbox FS changes, 0 insertions/0 deletions)
- **PRB-01..07**: unchanged (production-readiness blockers, NOT G05 blockers)
- **AgentCraft-Toolkit**: STRICTLY READ ONLY — never modified

### 4.1 Activated G05 API endpoints

| Endpoint | Task | Status |
|----------|------|--------|
| `POST /api/v1/innovations/generate` | G05-T03 | ✅ 200 |
| `POST /api/v1/innovations/{id}/critique` | G05-T04 | ✅ 200 |
| `POST /api/v1/experiments` | G05-T05 | ❌ 501 |
| `POST /api/v1/experiments/{id}/execute` | G05-T06 | ❌ 501 |
| `GET /api/v1/experiments/{id}` | G05-T05 | ❌ 501 |
| `GET /api/v1/hypotheses/{id}/evidence-deltas` | G05-T06 | ❌ 501 |
| `/api/v1/future/scenarios*` | G06 | ❌ 501 |

---

## 5. Key architectural decisions and frozen boundaries

| Boundary | Rule |
|----------|------|
| G01 domain contracts | FROZEN — no changes to Pydantic models, enums, or invariants |
| G02 provider scope | FROZEN — 3 providers only |
| G03 scope | FROZEN — no expansion without explicit approval |
| Verification policy | deterministic-v2 — VERIFIED unreachable |
| Graph database | NOT introduced — relational tables + BFS suffice |
| AgentCraft-Toolkit | READ ONLY — never modify, push, or write |

### 5.1 Epistemic isolation (G05-T01 correction)

`find_related_entities()` has `include_hypothesized: bool = False` parameter.
By default, `origin='hypothesized'` relationships are EXCLUDED from:
- `hybrid_retrieve()` (G04-T01)
- `find_capabilities()` / `find_dependencies()` / `find_alternatives()` / `find_limitations()` (G03-T03)
- `analyze_gap()` provider lookup (G04-T02C, G05-T02 correction)

G05 innovation endpoints pass `include_hypothesized=True` to surface
proposed combinations. Hypothesized relationships NEVER contaminate
ordinary retrieval.

### 5.2 Concept identity (G05-T03C correction)

Concepts use deterministic fingerprints (SHA-256 of normalized
problem_domain + context + combination_basis + template_name +
sorted component_entity_ids). Repeated equivalent requests reuse
the same persisted EntityRow + ClaimRow + RelationshipRow IDs.
Concurrency is LIMITED (PRB-03 — no DB-level UNIQUE constraints yet).

### 5.3 Two distinct state machines (G05-P00C correction)

- `HypothesisStatus` (8-state lifecycle): PROPOSED → UNDER_REVIEW →
  TESTABLE → EXPERIMENT_RUNNING → SUPPORTED/WEAKENED/REJECTED → SUPERSEDED
- `EpistemicState` (5-axis claim state): SUPPORTED / INFERRED / HYPOTHESIZED /
  DISPUTED / REJECTED (NO VERIFIED — it's only in `VerificationState`)

`EvidenceDelta.prior_state` / `updated_state` are typed `EpistemicState`.
G05-T06 will transition `HypothesisStatus` and emit `EvidenceDelta` with
`EpistemicState` values. Never conflate the two.

---

## 6. Files to read in the new session

### 6.1 Essential reports

| Report | What it covers |
|--------|---------------|
| `reports/G05_INNOVATION_IMPLEMENTATION_PLAN.md` | The authoritative G05 plan (corrected in G05-P00C) — 6 tasks, acceptance criteria, quality gates |
| `reports/G05_T04_ARCHITECTURE_CRITIQUE.md` | Latest completed task report |
| `reports/SYNAPSE_G04_SESSION_HANDOVER.md` | G04 session handover (historical) |
| `docs/decisions/0011-g03-functional-closure.md` | PRB-01..07 blocker register |

### 6.2 Key source files

| File | What it contains |
|------|-----------------|
| `src/synapse/application/innovation.py` | G05-T01..T04: `combine_knowledge()`, `discover_opportunities()`, `generate_innovations()`, `compose_architecture()`, `critique_innovation()` (~3100 LOC) |
| `src/synapse/application/gap_analyzer.py` | G04-T02C: `analyze_gap()` with epistemic-isolation filter |
| `src/synapse/application/relationship_service.py` | G03-T03 + G05-T01 correction: `find_related_entities(include_hypothesized=False)` |
| `src/synapse/application/reasoning.py` | G04-T03: `answer_query()` + 6 intents + FindingType |
| `src/synapse/application/retrieval.py` | G04-T01: `hybrid_retrieve()` |
| `src/synapse/evaluation/` | G04-T04: golden dataset, metrics, router, runner |
| `src/synapse/api/v1/innovations.py` | G05-T03+T04: `POST /generate` + `POST /{id}/critique` |
| `src/synapse/api/v1/router.py` | Router aggregator + remaining 501 placeholders |
| `src/synapse/domain/hypothesis.py` | FROZEN: 8-state HypothesisStatus + HYPOTHESIS_TRANSITIONS |
| `src/synapse/domain/evidence_delta.py` | FROZEN: EvidenceDelta with EpistemicState prior/updated |

### 6.3 Key test files

| File | What it tests |
|------|--------------|
| `tests/integration/test_g05_t01_knowledge_combination.py` | G05-T01 (7 criteria + 4 negative) |
| `tests/integration/test_g05_t02_opportunity_discovery.py` | G05-T02 (6 criteria + 6 negative) |
| `tests/integration/test_g05_t03_innovation_generation.py` | G05-T03 (7 criteria + 9 negative) |
| `tests/integration/test_g05_t03c_idempotency.py` | G05-T03C (8 idempotency + 1 regression) |
| `tests/integration/test_g05_t04_architecture_critique.py` | G05-T04 (8 criteria + 7 negative) |

---

## 7. What's next: G05-T05

Per the corrected G05 plan §G05-T05:

**Objective**: Define small, measurable experiments for a concept/hypothesis.
Activate `POST /api/v1/experiments` + `GET /api/v1/experiments/{id}`.

**Scope**:
- `src/synapse/application/experiment_planner.py` (~200 LOC): `plan_experiment()`.
- `src/synapse/api/v1/experiments.py` (~150 LOC): `POST` + `GET` endpoints.
- Update `src/synapse/api/v1/router.py`: activate experiments router.
- `tests/integration/test_g05_t05_experiment_planning.py` (~250 LOC).

**Acceptance criteria** (6):
1. Every experiment plan has >=1 success criterion.
2. Every experiment has `execution_mode` (default `dry_run`).
3. `production` mode requires `safety_limits.approved_by`.
4. `POST /api/v1/experiments` returns 200 with auth.
5. `GET /api/v1/experiments/{id}` returns 200 / 404.
6. G01-G05-T04 regression intact.

**G05-T05 is NOT YET AUTHORIZED. Await explicit mission briefing.**

After T05: G05-T06 (Evidence Feedback + Audit Trail) is the final G05 task.

---

## 8. Worklog

The full worklog is at `/home/z/my-project/worklog.md` (1038 lines).
It contains every task from G04 onboarding through G05-T04, with
detailed work logs and stage summaries for each.

---

## 9. Credentials cleanup reminder

The PAT is stored at `/home/z/my-project/.secure/credentials`.
**Delete it when development is complete** (user will request explicitly).
Do NOT mention the token in chat. Do NOT log it.

---

*End of Session Handover — continue from G05-T04 closure.*
