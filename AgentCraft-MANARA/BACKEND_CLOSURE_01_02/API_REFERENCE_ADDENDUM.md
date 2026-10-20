# API Reference Addendum — Backend Closure 01 + 02

> **Document type.** Addendum to `BACKEND_VERIFICATION_01/API_REFERENCE.md`.
> **Purpose.** Document the 6 new API routes + 4 changed response contracts introduced by `MANARA-UI-BACKEND-CLOSURE-01` and `MANARA-UI-BACKEND-CLOSURE-02`.
> **Code baseline.** `mayakilzy/AgentCraft-MANARA` at SHA `6efac89bda807825f1cc29b44a59cbd11168fb69`.
> **Date.** 2026-10-20.
> **Author.** GLM (Implementer).

---

## 1. How to Read This Addendum

This document is **additive** to `BACKEND_VERIFICATION_01/API_REFERENCE.md`. The original reference documents the 67 endpoints that existed at SHA `91f2909`. This addendum documents:

- **6 new endpoints** added by CLOSURE-01 (R-01, R-04, R-05, R-06, R-07, R-08).
- **4 changed response contracts** (R-02, R-03, FIX-01, and the ComposeMoldResponse contract fix).
- **2 docstring corrections** (R-09) — no endpoint changes, just honest documentation.

The original API_REFERENCE.md is **NOT modified** in place — it remains the historical record of the audited baseline. This addendum is the authoritative reference for the current code state.

When the original and this addendum disagree, **this addendum wins** for the endpoints/contracts documented here. The original remains authoritative for everything else.

---

## 2. Final Endpoint Inventory

**Counting method.** Application endpoints = all FastAPI route handlers EXCEPT framework-generated routes (`/`, `/docs`, `/docs/oauth2-redirect`, `/openapi.json`, `/redoc`).

**Final count at SHA `6efac89`:** **73 MANARA application endpoints** (was 67 at SHA `91f2909`; +6 from CLOSURE-01; CLOSURE-02 added 0 new endpoints — only response-contract extensions).

### 2.1 Per-router breakdown (final)

| Router | Endpoints at `91f2909` | Endpoints at `6efac89` | Delta |
|---|---|---|---|
| `/status` | 2 | 2 | 0 |
| `/discovery` | 1 | 1 | 0 |
| `/contracts` | 1 | 1 | 0 |
| `/registry` | 13 | 13 | 0 |
| `/foundry` | 8 | 8 | 0 |
| `/memory` | 12 | **13** | +1 (R-01: GET /memory/investigations/{id}/edges) |
| `/mold-factory` | 9 | **11** | +2 (R-04: list investigations; R-05: get investigation) |
| `/agents` | 10 | **11** | +1 (R-08: GET /agents/sessions list) |
| `/foresight` | 7 | **9** | +2 (R-06: list forecasts; R-07: list backtests) |
| `/publishing` | 4 | 4 | 0 |
| **Total** | **67** | **73** | **+6** |

---

## 3. New Endpoints (6 — from CLOSURE-01)

### 3.1 R-01 — `GET /memory/investigations/{investigation_id}/edges`

**Purpose.** Knowledge Graph read path. Returns persisted `ClaimSupportEdgeRow` rows for an investigation.

**Route.** `GET /memory/investigations/{investigation_id}/edges`

**Query parameters.**

| Param | Type | Default | Description |
|---|---|---|---|
| `relation` | string \| null | null | Optional filter: `supports` \| `refutes` \| `qualifies` |
| `limit` | int | 200 | 1–1000 |

**Response.** `200 OK` with JSON array:

```json
[
  {
    "edge_id": 1,
    "claim_id": "claim-abc",
    "evidence_id": "ev-001",
    "relation": "supports",
    "weight": 1.5,
    "notes": "strong support",
    "created_at": "2026-10-20T..."
  }
]
```

**Honest guarantees.**
- Contradictions preserved: `supports` and `refutes` on the same claim are NEVER collapsed.
- No duplicate edges from the join (each `ClaimSupportEdgeRow` is returned once).
- Empty list `[]` for investigations with no edges (NOT 404).
- Tenant isolation enforced via `ClaimSupportEdgeRow.tenant_id == _resolve_tenant()`.
- Deterministic ordering by `edge_id` ascending.

### 3.2 R-04 — `GET /mold-factory/investigations`

**Purpose.** List investigations for the current tenant.

**Route.** `GET /mold-factory/investigations`

**Query parameters.**

| Param | Type | Default | Description |
|---|---|---|---|
| `state` | string \| null | null | Optional filter by workflow state (e.g. `mold_ready`, `archived`) |
| `limit` | int | 50 | 1–200 |
| `offset` | int | 0 | ≥0 |

**Response.** `200 OK` with JSON array:

```json
[
  {
    "id": "inv-abc",
    "topic": "Study the future of intelligent prosthetics",
    "state": "mold_ready",
    "tenant_id": "tenant_demo",
    "created_at": "2026-10-20T...",
    "updated_at": "2026-10-20T..."
  }
]
```

**Notes.**
- `state` may be `null` if no workflow row exists for the investigation.
- Investigations without a workflow row are still returned (LEFT JOIN semantics).
- N+1 avoidance: workflow states are fetched in a single IN-clause query.
- Ordered by `created_at DESC` (newest first).

### 3.3 R-05 — `GET /mold-factory/investigations/{investigation_id}`

**Purpose.** Fetch a single investigation by ID. Primary acceptance: an existing investigation must be recoverable after page reload WITHOUT invoking `POST /mold-factory/compose` again.

**Route.** `GET /mold-factory/investigations/{investigation_id}`

**Response.** `200 OK`:

```json
{
  "id": "inv-abc",
  "topic": "Study the future of intelligent prosthetics",
  "tenant_id": "tenant_demo",
  "user_id": "system",
  "state": "received",
  "payload": { ...the Investigation Pydantic contract... },
  "workflow_state": "mold_ready",
  "mold_id": "mold-xyz",
  "blocker": null,
  "created_at": "2026-10-20T...",
  "updated_at": "2026-10-20T..."
}
```

**Notes.**
- 404 if the investigation does not exist or belongs to a different tenant.
- Never creates a new investigation during retrieval.
- `workflow_state`, `mold_id`, `blocker` may be `null` if no workflow row exists.

### 3.4 R-06 — `GET /foresight/forecasts`

**Purpose.** List forecasts for the current tenant.

**Route.** `GET /foresight/forecasts`

**Query parameters.**

| Param | Type | Default | Description |
|---|---|---|---|
| `investigation_id` | string \| null | null | Optional filter |
| `status` | string \| null | null | Optional filter: `draft` \| `published` \| `superseded` |
| `limit` | int | 50 | 1–200 |
| `offset` | int | 0 | ≥0 |

**Response.** `200 OK` with JSON array of forecast summaries (target, metric, unit, point_estimate, cutoff_date, issue_date, status, method, subsequent_revision_of, superseded_by, investigation_id, created_at).

### 3.5 R-07 — `GET /foresight/forecasts/{forecast_id}/backtests`

**Purpose.** List backtest history for a forecast.

**Route.** `GET /foresight/forecasts/{forecast_id}/backtests`

**Query parameters.**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | int | 50 | 1–200 |
| `offset` | int | 0 | ≥0 |

**Response.** `200 OK` with JSON array:

```json
[
  {
    "id": 1,
    "forecast_id": "fc-abc",
    "leakage_detected": false,
    "leaked_evidence_ids": [],
    "mae": 0.5,
    "rmse": 0.7,
    "baseline_mae": 0.8,
    "improvement_over_baseline": 0.375,
    "data_points_used": 3,
    "data_cutoff_verified": true,
    "notes": "Backtest passed. Model MAE=0.5000, Baseline MAE=0.8000.",
    "created_at": "2026-10-20T..."
  }
]
```

**FIX-03 behavior.** As of CLOSURE-02, this endpoint returns ALL backtest attempts, including failures. Failed entries carry:
- `mae`, `rmse`, `baseline_mae`, `improvement_over_baseline` = `null` (NEVER fabricated).
- `leakage_detected` = `true` + `leaked_evidence_ids[]` populated for leakage failures.
- `notes` distinguishes the outcome: `"Backtest passed."` / `"LEAKAGE DETECTED: ..."` / `"Insufficient data before cutoff for backtest."` / `"No actual values after cutoff to evaluate against."`

**404** if the parent forecast does not exist or belongs to a different tenant.

### 3.6 R-08 — `GET /agents/sessions`

**Purpose.** List agent sessions for the current tenant.

**Route.** `GET /agents/sessions`

**Query parameters.**

| Param | Type | Default | Description |
|---|---|---|---|
| `investigation_id` | string \| null | null | Optional filter |
| `recipe_id` | string \| null | null | Optional filter |
| `status` | string \| null | null | Optional filter: `instantiated` \| `running` \| `completed` \| `failed` \| `terminated` |
| `limit` | int | 50 | 1–200 |
| `offset` | int | 0 | ≥0 |

**Response.** `200 OK` with JSON array of session summaries (id, recipe_id, investigation_id, status, execution_mode, is_mock, provider, model, started_at, completed_at, duration_ms).

**Notes.** Read-only. Does NOT execute, instantiate, or terminate any session.

---

## 4. Changed Response Contracts (4)

### 4.1 R-02 — `tool_invocations` added to agent session responses

**Affected endpoints.**
- `POST /agents/sessions/{session_id}/execute`
- `GET /agents/sessions/{session_id}`

**Change.** Both responses now include a `tool_invocations` field (list). Each entry carries one of 4 valid statuses: `executed`, `denied_not_in_granted_set`, `not_implemented`, `error`.

**Backwards-compatible.** Additive field. Existing clients ignore it.

**Empty array** when no invocations were recorded (e.g. session instantiated but not executed, or mock without granted tools).

### 4.2 R-03 — `probability_distribution` added to forecast response

**Affected endpoint.** `GET /foresight/forecasts/{id}`

**Change.** Response now includes `probability_distribution` (dict). Empty dict `{}` when `method="insufficient_evidence"` (the engine refuses to fabricate probabilities in that case).

**Backwards-compatible.** Additive field.

### 4.3 FIX-01 — `composition_result` added to mold response

**Affected endpoint.** `GET /mold-factory/molds/{mold_id}`

**Change.** Response now includes:
- `composition_details_available` (bool) — `true` when the mold was composed after migration 0008; `false` for legacy molds.
- `composition_result` (dict \| null) — the trimmed `MoldCompositionResult` with `detected_needs[]`, `coverage[]`, `gaps[]`, `is_complete`, `is_catalog_complete`, `deliverable_type`, `is_unknown_domain`, `detection_reasoning`, `composition_notes`, `composed_at`. `null` for legacy molds.

**Backwards-compatible.** Additive fields.

**UI contract.** The UI must NOT fabricate missing data when `composition_details_available=false`. The honest signal is `composition_result=null`.

### 4.4 ComposeMoldResponse contract fix

**Affected endpoint.** `POST /mold-factory/compose`

**Change.** The `ComposeMoldResponse` Pydantic model was missing `tenant_id` and `composed_at` fields, but `MoldCompositionResult.to_dict()` returns both. This caused every `POST /compose` call to fail with 422 `extra_forbidden`. Fixed by adding the two fields to the response model.

**Backwards-compatible.** The fields were already being returned by `to_dict()`; the response model now accepts them instead of 422-ing.

---

## 5. Docstring Corrections (R-09 — no endpoint changes)

### 5.1 D-01 — `PATCH /agents/recipes/{id}/promote`

**Status.** NOT IMPLEMENTED. The router docstring previously advertised this endpoint. The docstring now explicitly notes it is NOT implemented.

**UI contract.** The UI must NOT call this endpoint. It returns 404/405. Recipe state promotion is currently a direct DB operation reserved for the owner.

### 5.2 D-02 — `GET /publishing/publications/{id}/quality-gate`

**Status.** NOT IMPLEMENTED. The router docstring previously advertised this endpoint. The docstring now explicitly notes it is NOT implemented.

**UI contract.** The UI must NOT call this endpoint. The quality-gate result (`quality_gate_passed` + `quality_gate_issues`) is already embedded in the `GET /publishing/publications/{id}` response.

---

## 6. Bitemporal Replay — POST (not GET)

**Endpoint.** `POST /memory/investigations/{investigation_id}/at-cutoff`

**Note.** The original `BACKEND_VERIFICATION_01/UI_FUNCTIONAL_HANDOFF.md` documented this as `GET`. The actual code at SHA `91f2909` (and unchanged through `6efac89`) registers it as `POST` with a JSON body `{"cutoff_iso": str}`. The CLOSURE-01 docstring correction made this explicit.

**UI contract.** The UI must use `POST` (not `GET`) for bitemporal replay.

---

## 7. Migration Requirements

### 7.1 Migration `0008_mold_composition`

**Revision ID.** `0008_mold_composition`
**Revises.** `0007_publishing`
**Introduced by.** CLOSURE-02 / FIX-01.

**Upgrade.** Adds a nullable `composition_result_json` (JSON) column to `mold_recipes`.

**Downgrade.** Drops the column.

**Backwards-compatible.** Existing molds keep `composition_result_json = NULL`. The read path returns `composition_details_available=false` for these rows.

**Required for.** FIX-01 (Mold Blueprint reconstruction after page reload).

### 7.2 No other migrations

CLOSURE-01 and CLOSURE-02 introduced no other migrations. All other changes are additive response-contract extensions on existing endpoints (no schema changes).

---

## 8. Test Inventory (Final)

**Total test functions at SHA `6efac89`:** **412**

| Test file | Tests | Category |
|---|---|---|
| `test_agent_factory.py` | 19 | Original |
| `test_api_discovery.py` | 5 | Original |
| `test_api_errors.py` | 4 | Original |
| `test_api_status.py` | 6 | Original |
| `test_contracts.py` | 33 | Original |
| `test_e2e_smoke.py` | 3 | Original |
| `test_foresight.py` | 18 | Original |
| `test_foundry.py` | 32 | Original |
| `test_foundry_live.py` | 5 | Original (skipped: gated by `RUN_LIVE_TESTS=1`) |
| `test_investigation_lifecycle.py` | 10 | Original |
| `test_lifecycle.py` | 7 | Original |
| `test_memory_curator.py` | 24 | Original |
| `test_mold_factory.py` | 23 | Original |
| `test_multi_coverage.py` | 24 | Original |
| `test_publishing.py` | 31 | Original |
| `test_registry_api.py` | 15 | Original |
| `test_registry_service.py` | 35 | Original |
| `test_verification_01_regressions.py` | 26 | Original (BACKEND-VERIFICATION-01) |
| **Original subtotal** | **320** | |
| `test_ui_backend_closure.py` | 58 | CLOSURE-01 |
| `test_ui_backend_closure_02.py` | 34 | CLOSURE-02 |
| **Total** | **412** | |

**Execution results (reconciled).**

- **406 passed**
- **5 skipped** (foundry_live — gated by `RUN_LIVE_TESTS=1`)
- **1 deselected** (foundry contract test that makes a real network call)
- **406 + 5 + 1 = 412 ✓**

**No failures. No regressions.**

---

## 9. Cross-Reference to Original API_REFERENCE.md

The original `BACKEND_VERIFICATION_01/API_REFERENCE.md` remains authoritative for the 67 endpoints that existed at SHA `91f2909` and are unchanged. This addendum supersedes the original for:

- The 6 new endpoints documented in §3.
- The 4 changed response contracts documented in §4.
- The 2 docstring corrections documented in §5.
- The bitemporal replay method (POST, not GET) documented in §6.

For any endpoint NOT mentioned in this addendum, the original API_REFERENCE.md remains the source of truth.
