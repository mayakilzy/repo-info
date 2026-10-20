# UI/UX Design Foundation Addendum — Backend Closure 01 + 02

> **Document type.** Addendum to `UI_UX_DESIGN/MANARA_UI_UX_DESIGN_FOUNDATION.md`.
> **Purpose.** Update the UI/UX design foundation to reflect the backend changes from CLOSURE-01 + CLOSURE-02.
> **Code baseline.** `mayakilzy/AgentCraft-MANARA` at SHA `6efac89bda807825f1cc29b44a59cbd11168fb69`.
> **Date.** 2026-10-20.
> **Author.** GLM (Implementer).

---

## 1. How to Read This Addendum

The original `MANARA_UI_UX_DESIGN_FOUNDATION.md` (v1.0, 2026-10-19) was authored against SHA `91f2909` (BACKEND-VERIFICATION-01). This addendum updates it for the current code baseline at SHA `6efac89`.

**What changed.**
- 6 new endpoints are available for the UI (R-01, R-04, R-05, R-06, R-07, R-08).
- 4 response contracts extended (R-02, R-03, FIX-01, ComposeMoldResponse fix).
- 3 previously-documented gaps are now CLOSED (FIX-01, FIX-02, FIX-03).
- 2 docstring corrections (R-09) — no UI change required, just honest documentation.

**What did NOT change.**
- The 9-page UI design (§6 of the original) is unchanged.
- The 7 UI states (§7 of the original) are unchanged.
- The 12-step user journey (§8 of the original) is unchanged.
- The honest data quality flag catalog (§11 of the original) is unchanged.
- The accessibility / bilingual / polling contracts (§12 of the original) are unchanged.

---

## 2. Updates to §5 (Master Functional Inventory)

The original §5.2 lists 36 capabilities. The following updates apply:

### 2.1 Tier upgrades (capabilities now fully closed)

| # | Capability | Tier in original | Tier now | Reason |
|---|---|---|---|---|
| 20 | ToolExecutor + RegistryToolExecutor | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED_AND_VERIFIED` | R-02: `tool_invocations[]` now exposed in API responses. |
| 35 | `PATCH /agents/recipes/{id}/promote` | `NOT_IMPLEMENTED` | `NOT_IMPLEMENTED` (honestly documented) | R-09 corrected the misleading docstring. UI must NOT show a Promote button. |
| 36 | `GET /publishing/publications/{id}/quality-gate` | `NOT_IMPLEMENTED` | `NOT_IMPLEMENTED` (honestly documented) | R-09 corrected the misleading docstring. UI must use the embedded fields. |

### 2.2 New capabilities (8 added)

| # | Capability | Tier | UI implication |
|---|---|---|---|
| 37 | Knowledge Graph edge retrieval (R-01) | `IMPLEMENTED_AND_VERIFIED` | Page 5 (Memory Explorer) can render the claim↔evidence graph. |
| 38 | Investigation listing (R-04) | `IMPLEMENTED_AND_VERIFIED` | Page 2 (Investigation Workspace) can show a "recent investigations" sidebar. |
| 39 | Investigation detail retrieval (R-05) | `IMPLEMENTED_AND_VERIFIED` | Page 2 recovers from page reload without re-running compose. |
| 40 | Forecast listing (R-06) | `IMPLEMENTED_AND_VERIFIED` | Page 8 (Foresight) can show a forecast history list. |
| 41 | Backtest history retrieval (R-07) | `IMPLEMENTED_AND_VERIFIED` | Page 8 can show a backtest history list per forecast. |
| 42 | Agent session listing (R-08) | `IMPLEMENTED_AND_VERIFIED` | Page 7 (Agent Registry) can show a session history list. |
| 43 | Mold Blueprint persistence (FIX-01) | `IMPLEMENTED_AND_VERIFIED` | Page 6 (Mold Factory) Mold Blueprint panel survives page reload. |
| 44 | Backtest failure persistence (FIX-03) | `IMPLEMENTED_AND_VERIFIED` | Page 8 backtest history shows ALL attempts (success + failure), with NULL metrics for failures. |

---

## 3. Updates to §6 (Required Pages)

### 3.1 Page 2 — Investigation Workspace

**Original §6.3** listed `GET /mold-factory/investigations/{id}/workflow` as the only workflow endpoint.

**Update.** The UI now has 3 endpoints for investigation recovery:
- `GET /mold-factory/investigations` (R-04) — list all investigations for the tenant.
- `GET /mold-factory/investigations/{id}` (R-05) — fetch a single investigation for reload recovery.
- `GET /mold-factory/investigations/{id}/workflow` (existing) — fetch the workflow state.

**Reload recovery flow.**
1. On page reload, the UI calls `GET /mold-factory/investigations/{id}` with the investigation_id from the URL.
2. The response includes `workflow_state`, `mold_id`, `blocker`.
3. The UI calls `GET /mold-factory/molds/{mold_id}` (which now returns `composition_result` + `composition_details_available` per FIX-01).
4. The UI reconstructs the Mold Blueprint from `composition_result` (if `composition_details_available=true`).
5. If `composition_details_available=false` (legacy mold), the UI shows an honest "Mold Blueprint details not available for this legacy mold" message — NOT a fabricated blueprint.

### 3.2 Page 5 — Memory Explorer

**Original §6.6** listed `GET /memory/investigations/{id}/claims` but noted the Knowledge Graph read path was missing (D-05).

**Update.** R-01 added `GET /memory/investigations/{id}/edges`. The UI can now render the claim↔evidence graph:
- Call `GET /memory/investigations/{id}/claims` for the claim nodes.
- Call `GET /memory/investigations/{id}/edges` for the edges.
- Render the graph with `supports` (green), `refutes` (red), `qualifies` (amber) edges.
- Contradictions are preserved — both `supports` and `refutes` on the same claim are shown.

### 3.3 Page 6 — Mold Factory

**Original §6.7** listed `GET /mold-factory/molds/{id}` returning only the `Mold` Pydantic contract.

**Update.** FIX-01 extended the response. `GET /mold-factory/molds/{id}` now returns:
- The original `Mold` contract (scope, composition, plan).
- `composition_details_available` (bool).
- `composition_result` (dict | null) — the trimmed `MoldCompositionResult` with `detected_needs[]`, `coverage[]`, `gaps[]`, `is_complete`, `is_catalog_complete`, `deliverable_type`, `is_unknown_domain`, `detection_reasoning`, `composition_notes`, `composed_at`.

**Mold Blueprint rendering.** The UI uses `composition_result` to render the blueprint panel. When `composition_details_available=false`, the UI shows an honest "Mold Blueprint details not available for this legacy mold" message.

### 3.4 Page 7 — Agent Registry

**Original §6.8** noted that `tool_invocations[]` was persisted but NOT returned by the API (D-03).

**Update.** R-02 added `tool_invocations` to both `POST /agents/sessions/{id}/execute` and `GET /agents/sessions/{id}` responses. The UI can now render the tool-invocation audit trail with 4 status icons: ✅ executed, ❌ denied_not_in_granted_set, ⚠️ not_implemented, ⛔ error.

**General Analyst seed.** FIX-02 corrected the `create_general_analyst_recipe` state from `MAINTAINED` to `ON_DEMAND`. `POST /agents/recipes/seed-generalist` now succeeds (was 422). The UI can seed both recipes (Clinical Prosthetics Reviewer + General Analyst) and instantiate sessions from either.

### 3.5 Page 8 — Foresight

**Original §6.9** noted that `probability_distribution` was persisted but NOT returned (D-04), and that backtest history only showed successful backtests.

**Update.**
- R-03 added `probability_distribution` to `GET /foresight/forecasts/{id}`. The UI can now render a probability distribution chart (when non-empty).
- R-06 added `GET /foresight/forecasts` (list). The UI can show a forecast history list.
- R-07 added `GET /foresight/forecasts/{id}/backtests` (list). The UI can show a backtest history list.
- FIX-03 made `POST /foresight/backtest` persist ALL 4 outcome paths. The backtest history now shows failed attempts (leakage, insufficient data, no post-cutoff actuals) with NULL metrics and distinguishing `notes`.

**Backtest history rendering.** The UI must distinguish:
- Successful backtests: `mae`/`rmse`/`baseline_mae`/`improvement_over_baseline` are non-null; `notes` starts with "Backtest passed."
- Leakage failures: `leakage_detected=true`; `leaked_evidence_ids[]` non-empty; metrics are null; `notes` starts with "LEAKAGE DETECTED".
- Insufficient training data: metrics are null; `notes` = "Insufficient data before cutoff for backtest."
- No post-cutoff actuals: metrics are null; `notes` = "No actual values after cutoff to evaluate against."

The UI must NEVER fabricate metrics for failed backtests.

### 3.6 Page 9 — Publishing Studio

**No change from original.** R-09 corrected the docstring advertisement for `GET /publishing/publications/{id}/quality-gate` (which was never implemented). The UI already uses the embedded `quality_gate_passed` + `quality_gate_issues` fields from `GET /publishing/publications/{id}`.

---

## 4. Updates to §9 (API Binding)

The original §9 documents 67 endpoints. The updated count is **73 MANARA application endpoints** (excluding 5 framework routes: `/`, `/docs`, `/docs/oauth2-redirect`, `/openapi.json`, `/redoc`).

### 4.1 New endpoints to add to §9

| Router | New endpoint | §9 section |
|---|---|---|
| Memory | `GET /memory/investigations/{id}/edges` | §9.6 (after `GET .../claims`) |
| Mold Factory | `GET /mold-factory/investigations` | §9.7 (new — list) |
| Mold Factory | `GET /mold-factory/investigations/{id}` | §9.7 (new — detail) |
| Foresight | `GET /foresight/forecasts` | §9.9 (new — list) |
| Foresight | `GET /foresight/forecasts/{id}/backtests` | §9.9 (new — list) |
| Agents | `GET /agents/sessions` | §9.8 (new — list) |

### 4.2 Changed response contracts to add to §9

| Endpoint | New field | §9 section |
|---|---|---|
| `POST /agents/sessions/{id}/execute` | `tool_invocations: list` | §9.8 |
| `GET /agents/sessions/{id}` | `tool_invocations: list` | §9.8 |
| `GET /foresight/forecasts/{id}` | `probability_distribution: dict` | §9.9 |
| `GET /mold-factory/molds/{id}` | `composition_details_available: bool` + `composition_result: dict \| null` | §9.7 |
| `POST /mold-factory/compose` | `tenant_id: str` + `composed_at: str` (contract fix) | §9.7 |

---

## 5. Updates to §10 (Backend Gaps That Affect UI Design)

### 5.1 Gaps now CLOSED (remove from §10)

| Gap ID | Title | Closed by |
|---|---|---|
| D-05 | Missing `GET /memory/claims/{id}/edges` (Knowledge Graph read) | CLOSURE-01 / R-01 |
| D-03 | `tool_invocations` stored but not returned by API | CLOSURE-01 / R-02 |
| D-04 | `probability_distribution` stored but not returned | CLOSURE-01 / R-03 |
| G-list-1 | Missing `GET /mold-factory/investigations` | CLOSURE-01 / R-04 |
| G-list-2 | Missing `GET /mold-factory/investigations/{id}` | CLOSURE-01 / R-05 |
| G-list-3 | Missing `GET /foresight/forecasts` | CLOSURE-01 / R-06 |
| G-list-4 | Missing `GET /foresight/backtests` | CLOSURE-01 / R-07 |
| G-list-5 | Missing `GET /agents/sessions` | CLOSURE-01 / R-08 |
| D-01 | Misleading recipe-promote advertisement | CLOSURE-01 / R-09 |
| D-02 | Misleading quality-gate advertisement | CLOSURE-01 / R-09 |
| C-03 | Mold Blueprint reload integrity | CLOSURE-02 / FIX-01 |
| General Analyst seed bug | `create_general_analyst_recipe` state contract violation | CLOSURE-02 / FIX-02 |
| Backtest persistence gap | `run_backtest` did not persist failure outcomes | CLOSURE-02 / FIX-03 |

### 5.2 Gaps still OPEN (remain in §10)

All other gaps from the original §10 remain open. See `KNOWN_GAPS_ADDENDUM.md` §4 for the full list.

### 5.3 Frontend-only corrections (§14 of the original)

The original §14.1 listed 10 frontend-only removals (F-01 through F-10). These remain valid. Specifically:

- **F-01** (remove Promote Recipe button) — still valid (R-09 confirmed endpoint not implemented).
- **F-02** (remove standalone Quality Gate button) — still valid (R-09 confirmed endpoint not implemented).
- **F-03** through **F-10** — unchanged.

The original §14.2 listed 8 honest-flag corrections (F-11 through F-18). Update:

- **F-11** (tool_invocations placeholder) — **REMOVE**. R-02 closed D-03; `tool_invocations` is now returned by the API.
- **F-12** (probability_distribution placeholder) — **REMOVE**. R-03 closed D-04; `probability_distribution` is now returned.
- **F-13** through **F-18** — unchanged.

---

## 6. Updates to §13 (Open Design Questions)

The original §13 listed 10 open design questions (Q1–Q10). These remain open — they are visual design decisions for the UI team, not backend concerns.

**No update required.** The backend changes do not affect the open design questions.

---

## 7. Migration Requirements for UI Implementation

The UI implementation must be aware of one migration requirement:

### 7.1 Migration `0008_mold_composition`

**Required for.** FIX-01 (Mold Blueprint reconstruction after page reload).

**Effect on UI.** If the migration has NOT been applied to a deployment, `GET /mold-factory/molds/{id}` returns `composition_details_available=false` for ALL molds. The UI must handle this gracefully (show an honest "Mold Blueprint details not available" message).

**Deployment contract.** The migration MUST be applied before the UI goes live. It is a nullable-column additive migration — safe to apply on a running system.

---

## 8. Updated Readiness Verdict

### 8.1 Visual Design Readiness — PASS

The approved visual designs CAN be implemented faithfully. All 13 blocking gaps from the original §10 are now CLOSED. The UI team can proceed with implementation once the owner authorizes it.

### 8.2 Backend Contract Readiness — PASS

73 MANARA application endpoints. 412 test functions (406 passed + 5 skipped + 1 deselected). Zero failures. Zero regressions. Migration 0008 verified (upgrade + downgrade + re-upgrade).

### 8.3 SaaS Product Readiness — NOT READY (unchanged)

Single-tenant demo mode only. Multi-user production SaaS still requires auth, live LLM, PostgreSQL, S3, etc. (all out of scope).

### 8.4 Implementation Authorization — UNAUTHORIZED (unchanged)

Frontend implementation remains **unauthorized** until the owner explicitly authorizes it.

---

## 9. Cross-Reference to Original Foundation

The original `UI_UX_DESIGN/MANARA_UI_UX_DESIGN_FOUNDATION.md` (v1.0) remains the comprehensive design foundation. This addendum supersedes it for:
- §5 (capability inventory) — see §2 of this addendum.
- §6 (required pages) — see §3 of this addendum.
- §9 (API binding) — see §4 of this addendum.
- §10 (backend gaps) — see §5 of this addendum.
- §14 (frontend-only corrections) — see §5.3 of this addendum.

For all other sections, the original remains authoritative.
