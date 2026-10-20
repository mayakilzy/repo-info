# Known Gaps Addendum — Backend Closure 01 + 02

> **Document type.** Addendum to `BACKEND_VERIFICATION_01/KNOWN_GAPS_AND_LIMITATIONS.md`.
> **Purpose.** Document which gaps from the original KGL are now CLOSED by CLOSURE-01 + CLOSURE-02, and which remain open.
> **Code baseline.** `mayakilzy/AgentCraft-MANARA` at SHA `6efac89bda807825f1cc29b44a59cbd11168fb69`.
> **Date.** 2026-10-20.
> **Author.** GLM (Implementer).

---

## 1. How to Read This Addendum

The original `KNOWN_GAPS_AND_LIMITATIONS.md` documents 30 gaps (G01–G30) at SHA `91f2909`. This addendum records the status of each gap after CLOSURE-01 + CLOSURE-02.

**Status categories.**

- **CLOSED** — the gap is fully addressed by CLOSURE-01 or CLOSURE-02.
- **CLOSED (mitigated)** — the gap is addressed but with a documented limitation (e.g. backwards-compatibility constraint).
- **OPEN** — the gap remains; no change.
- **PARTIALLY CLOSED** — a subset of the gap is addressed.

---

## 2. Gaps Closed by CLOSURE-01

### 2.1 D-05 — Knowledge Graph edge retrieval (CRITICAL) — CLOSED

**Original gap.** No endpoint to read `ClaimSupportEdgeRow` edges. The UI could not render a claim↔evidence relationship graph.

**Closure.** CLOSURE-01 / R-01 added `GET /memory/investigations/{investigation_id}/edges`. Returns persisted edges with `edge_id`, `claim_id`, `evidence_id`, `relation`, `weight`, `notes`, `created_at`. Preserves contradictions (supports + refutes on the same claim are never collapsed). Tenant isolation enforced.

**Verification.** 9 tests in `test_ui_backend_closure.py::TestR01Edges` PASS.

### 2.2 D-03 — Agent tool invocation visibility (HIGH) — CLOSED

**Original gap.** `tool_invocations[]` was persisted in `AgentSessionRow.task_output_json` but NOT returned by `POST /agents/sessions/{id}/execute` or `GET /agents/sessions/{id}`.

**Closure.** CLOSURE-01 / R-02 added `tool_invocations` to both responses. Each entry carries one of 4 valid statuses: `executed`, `denied_not_in_granted_set`, `not_implemented`, `error`.

**Verification.** 7 tests in `test_ui_backend_closure.py::TestR02ToolInvocations` PASS.

### 2.3 D-04 — Forecast probability_distribution (MEDIUM) — CLOSED

**Original gap.** `ForecastRow.probability_distribution` existed in the ORM but was NOT returned by `GET /foresight/forecasts/{id}`.

**Closure.** CLOSURE-01 / R-03 added `probability_distribution` to the response. Empty dict `{}` when `method="insufficient_evidence"`.

**Verification.** 5 tests in `test_ui_backend_closure.py::TestR03ProbabilityDistribution` PASS.

### 2.4 G-list-1 — Investigation listing (HIGH) — CLOSED

**Original gap.** No `GET /mold-factory/investigations` endpoint.

**Closure.** CLOSURE-01 / R-04 added the endpoint. Returns investigation summaries with `id`, `topic`, `state` (may be null), `tenant_id`, `created_at`, `updated_at`. Tenant isolation enforced. N+1 avoidance via IN-clause query.

**Verification.** 6 tests in `test_ui_backend_closure.py::TestR04ListInvestigations` PASS.

### 2.5 G-list-2 — Investigation detail retrieval (HIGH) — CLOSED

**Original gap.** No `GET /mold-factory/investigations/{id}` endpoint. The UI could not recover an investigation after page reload without re-running compose.

**Closure.** CLOSURE-01 / R-05 added the endpoint. Returns the full `InvestigationRow` + `workflow_state` + `mold_id` + `blocker`. 404 for missing/cross-tenant. Never creates a new investigation.

**Verification.** 5 tests in `test_ui_backend_closure.py::TestR05GetInvestigation` PASS.

### 2.6 G-list-3 — Forecast listing (MEDIUM) — CLOSED

**Original gap.** No `GET /foresight/forecasts` endpoint.

**Closure.** CLOSURE-01 / R-06 added the endpoint. Returns forecast summaries ordered by `created_at DESC`. Optional `investigation_id` + `status` filters.

**Verification.** 7 tests in `test_ui_backend_closure.py::TestR06ListForecasts` PASS.

### 2.7 G-list-4 — Backtest history retrieval (MEDIUM) — CLOSED

**Original gap.** No `GET /foresight/forecasts/{id}/backtests` endpoint.

**Closure.** CLOSURE-01 / R-07 added the endpoint. Returns backtest records with all metrics + `notes` field distinguishing outcome.

**Verification.** 6 tests in `test_ui_backend_closure.py::TestR07ListBacktests` PASS.

### 2.8 G-list-5 — Agent session listing (MEDIUM) — CLOSED

**Original gap.** No `GET /agents/sessions` endpoint.

**Closure.** CLOSURE-01 / R-08 added the endpoint. Returns session summaries ordered by `started_at DESC`. Optional `investigation_id` + `recipe_id` + `status` filters. Read-only.

**Verification.** 8 tests in `test_ui_backend_closure.py::TestR08ListSessions` PASS.

### 2.9 D-01 — Misleading recipe-promote advertisement (LOW) — CLOSED

**Original gap.** The `agents.py` router docstring advertised `PATCH /agents/recipes/{id}/promote` but the route handler does not exist.

**Closure.** CLOSURE-01 / R-09 corrected the docstring. The endpoint is NOT implemented (correctly out of scope). The docstring now explicitly notes this.

**Verification.** 5 tests in `test_ui_backend_closure.py::TestR09DocstringCorrections` PASS.

### 2.10 D-02 — Misleading quality-gate advertisement (LOW) — CLOSED

**Original gap.** The `publishing.py` router docstring advertised `GET /publishing/publications/{id}/quality-gate` but the route handler does not exist.

**Closure.** CLOSURE-01 / R-09 corrected the docstring. The quality-gate result is already embedded in `GET /publishing/publications/{id}`. The docstring now explicitly notes this.

**Verification.** Same tests as D-01.

---

## 3. Gaps Closed by CLOSURE-02

### 3.1 C-03 — Mold Blueprint reload integrity (HIGH) — CLOSED

**Original gap.** `GET /mold-factory/molds/{id}` returned only the `Mold` Pydantic contract (scope, composition, plan) but NOT the per-need `coverage[]`, `detected_needs[]`, `gaps[]` from the original `MoldCompositionResult`. The UI could not reconstruct the Mold Blueprint after page reload without re-running compose.

**Closure.** CLOSURE-02 / FIX-01 added migration `0008_mold_composition` (nullable `composition_result_json` column on `mold_recipes`). `MoldArchitect.compose_mold` now persists the trimmed `MoldCompositionResult` on the mold row. `GET /mold-factory/molds/{id}` returns `composition_result` + `composition_details_available`.

**Backwards-compatible.** Legacy molds (pre-migration 0008) keep `composition_result_json = NULL` and return `composition_details_available=false` honestly. The UI must NOT fabricate missing data.

**Verification.** 12 tests in `test_ui_backend_closure_02.py::TestFix01MoldBlueprintPersistence` PASS.

### 3.2 General Analyst seed bug (HIGH) — CLOSED

**Original gap.** `create_general_analyst_recipe` set `state=AgentState.MAINTAINED` without satisfying the `AgentRecipe` contract's `tests.last_evaluation_outcome` + `security_review` requirements. This caused `POST /agents/recipes/seed-generalist` to fail with 422.

**Closure.** CLOSURE-02 / FIX-02 changed the state to `ON_DEMAND` — the same state the Clinical Prosthetics Reviewer ships in. The General Analyst has NOT undergone formal evaluation nor a security review in the sandbox; claiming `maintained` would be dishonest. No validation bypass; no fabricated evaluation.

**Verification.** 6 tests in `test_ui_backend_closure_02.py::TestFix02GeneralAnalystRecipe` PASS.

### 3.3 Backtest persistence for failure paths (HIGH) — CLOSED

**Original gap.** `BacktestEngine.run_backtest` returned early WITHOUT persisting a `BacktestResultRow` in 3 cases: (1) temporal leakage, (2) insufficient training data, (3) no post-cutoff actuals. The backtest history endpoint returned an empty list for failed backtests.

**Closure.** CLOSURE-02 / FIX-03 modified all 3 early-return paths to call `_persist_backtest_result` before returning. Failed attempts carry NULL metrics (never fabricated) + distinguishing `notes`. The success path also uses the helper.

**Verification.** 7 tests in `test_ui_backend_closure_02.py::TestFix03BacktestPersistence` PASS.

---

## 4. Gaps Still OPEN (out of scope for CLOSURE-01 + CLOSURE-02)

These gaps remain and are documented for the owner. They do NOT block UI implementation (workarounds exist or they are SaaS-level concerns).

### 4.1 CRITICAL (blocks production deployment)

| Gap ID | Title | Status |
|---|---|---|
| **G01** | Multi-tenant authentication NOT IMPLEMENTED | OPEN. Single-tenant demo mode only. No JWT, API key, session cookie, or role-based access control. |
| **G02** | Live LLM NOT TESTED | OPEN. `MANARA_ZAI_API_KEY` not set in sandbox. Every agent execution has `is_mock=true`. |
| **G19** | Live agent execution loop NOT IMPLEMENTED | OPEN. Single-turn execution only. No multi-turn conversation. |

### 4.2 HIGH (limits real-world usage)

| Gap ID | Title | Status |
|---|---|---|
| **G03** | Live OpenAlex search RATE-LIMITED | OPEN. Shared-IP rate limit. Live tests gated by `RUN_LIVE_TESTS=1`. |
| **G04** | PostgreSQL + pgvector NOT TESTED | OPEN. SQLite dev only. |
| **G05** | Playwright browser E2E NOT RUN | OPEN. No browser in sandbox. |
| **G06** | Docker build NOT TESTED | OPEN. No Docker in sandbox. |
| **G07** | PgvectorEmbeddingStore is a STUB | OPEN. Numpy fallback. |
| **G08** | S3CompatibleStore would crash | OPEN. `boto3` not in deps. `LocalFilesystemStore` used today. |
| **G09** | DNS rebinding TOCTOU | OPEN. Partial SSRF defense only. |
| **G10** | Forecast immutability is code-level only | OPEN. No DB CHECK constraint. |
| **G11** | State machine invariants NOT DB-enforced | OPEN. No DB CHECK constraints. |

### 4.3 MEDIUM (workaround exists)

| Gap ID | Title | Status |
|---|---|---|
| **G12** | Foreign keys missing ON DELETE behavior | OPEN. |
| **G13** | JSON columns for structured data | OPEN. Acceptable at current scale. |
| **G14** | No API rate limiting | OPEN. |
| **G15** | No cursor pagination | OPEN. `limit` + `offset` only. |
| **G16** | SQLite "database is locked" under concurrency | OPEN. Pre-existing. |
| **G18** | ToolExecutor only dispatches 3 tools | OPEN. `registry.search`, `memory.search_prior`, `foundry.search_openalex` only. |
| **G23** | Single-cutoff backtesting only | OPEN. `n_cutoffs=1`. |
| **G24** | Storyboard rights enforcement in code only | OPEN. |
| **G25** | No security headers middleware | OPEN. |
| **G26** | No CSRF protection | OPEN. (Not exploitable today since no auth.) |
| **G30** | No WebSocket / real-time updates | OPEN. UI must poll. |
| **C-04** | Capability update unsupported | OPEN. DELETE + re-POST only. |

### 4.4 LOW (cosmetic or future enhancement)

| Gap ID | Title | Status |
|---|---|---|
| **G17** | 8 Boolean ORM/migration type mismatches | CLOSED (by BACKEND-VERIFICATION-01 F1). |
| **G20** | No coverage measurement | OPEN. |
| **G21** | No load testing | OPEN. |
| **G22** | No property-based testing | OPEN. |
| **G27** | `MANARA_SINGLE_TENANT_DEMO` flag is dead code | OPEN. |
| **G28** | No audit log viewer API for some tables | OPEN. `AgentEvaluationRow`, `BacktestResultRow`, `FoundryCallRecord` have no GET endpoint. |
| **G29** | No file upload endpoint | OPEN. Evidence is ingested as JSON + base64. |

### 4.5 NOT_IMPLEMENTED endpoints (still absent — R-09 documented)

| Endpoint | Status |
|---|---|
| `PATCH /agents/recipes/{id}/promote` | NOT IMPLEMENTED. R-09 corrected the misleading docstring. Recipe state promotion is a direct DB operation. |
| `GET /publishing/publications/{id}/quality-gate` | NOT IMPLEMENTED. R-09 corrected the misleading docstring. The quality-gate result is embedded in `GET /publishing/publications/{id}`. |

### 4.6 Out-of-scope product features (deferred)

| Feature | Status |
|---|---|
| PDF export | NOT IMPLEMENTED. |
| Publication sharing / public URLs | NOT IMPLEMENTED. |
| Document editing | NOT IMPLEMENTED. |
| Source Connector Framework | FUTURE WORK. See `MANARA_FINAL_UI_BACKEND_GAP_CLOSURE.md` §11 for the feasibility analysis. |

---

## 5. Summary Roll-up

| Category | Count |
|---|---|
| Gaps CLOSED by CLOSURE-01 | 10 (D-05, D-03, D-04, G-list-1..5, D-01, D-02) |
| Gaps CLOSED by CLOSURE-02 | 3 (C-03, General Analyst seed bug, Backtest persistence) |
| Gaps CLOSED by BACKEND-VERIFICATION-01 | 1 (G17) |
| Gaps still OPEN (CRITICAL) | 3 (G01, G02, G19) |
| Gaps still OPEN (HIGH) | 8 (G03–G11) |
| Gaps still OPEN (MEDIUM) | 12 (G12–G16, G18, G23–G26, G30, C-04) |
| Gaps still OPEN (LOW) | 6 (G20–G22, G27–G29) |
| NOT_IMPLEMENTED endpoints (documented) | 2 |
| Out-of-scope product features | 4 (PDF, sharing, editing, Source Connector Framework) |

---

## 6. UI Implementation Blockers

**For the 9-page approved UI design, the blocking gaps are now CLOSED.** The UI can be implemented faithfully.

**Remaining limitations the UI must accommodate (workarounds exist):**
- Single-tenant demo mode (G01) — no login UI.
- Mock LLM (G02) — `is_mock=true` banner mandatory.
- Single-turn agent (G19) — no chat-style view.
- No WebSocket (G30) — polling required.
- Capability update via DELETE + re-POST (C-04).
- No PDF / sharing / editing (out of scope).

**These do NOT block UI implementation.** They are documented honestly and the UI must surface them via honest flags (see `MANARA_UI_UX_DESIGN_FOUNDATION.md` §11).

---

## 7. Cross-Reference to Original KGL

The original `BACKEND_VERIFICATION_01/KNOWN_GAPS_AND_LIMITATIONS.md` remains the historical record at SHA `91f2909`. This addendum supersedes it for the gaps documented in §2 and §3 (CLOSED). For all other gaps, the original remains authoritative.
