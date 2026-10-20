# Functional Capability Catalog Addendum — Backend Closure 01 + 02

> **Document type.** Addendum to `BACKEND_VERIFICATION_01/FUNCTIONAL_CAPABILITY_CATALOG.md`.
> **Purpose.** Update the capability classifications to reflect CLOSURE-01 + CLOSURE-02 changes.
> **Code baseline.** `mayakilzy/AgentCraft-MANARA` at SHA `6efac89bda807825f1cc29b44a59cbd11168fb69`.
> **Date.** 2026-10-20.
> **Author.** GLM (Implementer).

---

## 1. How to Read This Addendum

The original `FUNCTIONAL_CAPABILITY_CATALOG.md` documents 36 capabilities at SHA `91f2909` with 7-tier classification. This addendum records the updated tier for each capability affected by CLOSURE-01 + CLOSURE-02.

**Tier changes.**

- `NOT_IMPLEMENTED` → `IMPLEMENTED_AND_VERIFIED` (for capabilities closed by CLOSURE-01/02).
- `PARTIALLY_IMPLEMENTED` → `IMPLEMENTED_AND_VERIFIED` (for capabilities fully closed).
- No tier was downgraded.

---

## 2. Capability Tier Changes

### 2.1 Capabilities upgraded by CLOSURE-01

| # | Capability | Tier at `91f2909` | Tier at `6efac89` | Reason |
|---|---|---|---|---|
| 20 | ToolExecutor + RegistryToolExecutor | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED_AND_VERIFIED` | R-02: `tool_invocations[]` now exposed in API responses. The 4-status audit trail (executed/denied/not_implemented/error) is visible to the UI. |
| 30 | Tenant Isolation (every query filtered by tenant_id) | `PARTIALLY_IMPLEMENTED` | `PARTIALLY_IMPLEMENTED` (unchanged) | Data-layer isolation still complete; auth-layer still NOT IMPLEMENTED. The 6 new endpoints all enforce tenant scoping. |
| 35 | `PATCH /agents/recipes/{id}/promote` | `NOT_IMPLEMENTED` | `NOT_IMPLEMENTED` (unchanged — R-09 documented honestly) | Still not implemented. R-09 corrected the misleading docstring advertisement. |
| 36 | `GET /publishing/publications/{id}/quality-gate` | `NOT_IMPLEMENTED` | `NOT_IMPLEMENTED` (unchanged — R-09 documented honestly) | Still not implemented. R-09 corrected the misleading docstring. Quality-gate result is embedded in `GET /publishing/publications/{id}`. |

### 2.2 Capabilities upgraded by CLOSURE-02

| # | Capability | Tier at `cd4f60b` | Tier at `6efac89` | Reason |
|---|---|---|---|---|
| 12 | Mold Factory (Architect + Detector + Workflow) | `IMPLEMENTED_AND_VERIFIED` | `IMPLEMENTED_AND_VERIFIED` (enhanced) | FIX-01: `MoldArchitect.compose_mold` now persists the full `MoldCompositionResult` on the mold row. The Mold Blueprint can be reconstructed after page reload. |
| 18 | MockProvider (deterministic responses, is_mock=True) | `IMPLEMENTED_AND_VERIFIED` | `IMPLEMENTED_AND_VERIFIED` (unchanged) | FIX-02 corrected the General Analyst recipe state, but the MockProvider itself is unchanged. |
| 23 | Backtest Engine (bitemporal leakage prevention) | `IMPLEMENTED_AND_VERIFIED` | `IMPLEMENTED_AND_VERIFIED` (enhanced) | FIX-03: `BacktestEngine.run_backtest` now persists ALL 4 outcome paths (success + 3 failure paths). Failed attempts carry NULL metrics (never fabricated). |

### 2.3 New capabilities (not in original catalog)

| # | Capability | Tier | Reason |
|---|---|---|---|
| 37 | Knowledge Graph edge retrieval (R-01) | `IMPLEMENTED_AND_VERIFIED` | New endpoint `GET /memory/investigations/{id}/edges`. 9 tests PASS. |
| 38 | Investigation listing (R-04) | `IMPLEMENTED_AND_VERIFIED` | New endpoint `GET /mold-factory/investigations`. 6 tests PASS. |
| 39 | Investigation detail retrieval (R-05) | `IMPLEMENTED_AND_VERIFIED` | New endpoint `GET /mold-factory/investigations/{id}`. 5 tests PASS. |
| 40 | Forecast listing (R-06) | `IMPLEMENTED_AND_VERIFIED` | New endpoint `GET /foresight/forecasts`. 7 tests PASS. |
| 41 | Backtest history retrieval (R-07) | `IMPLEMENTED_AND_VERIFIED` | New endpoint `GET /foresight/forecasts/{id}/backtests`. 6 tests PASS. |
| 42 | Agent session listing (R-08) | `IMPLEMENTED_AND_VERIFIED` | New endpoint `GET /agents/sessions`. 8 tests PASS. |
| 43 | Mold Blueprint persistence (FIX-01) | `IMPLEMENTED_AND_VERIFIED` | `MoldArchitect.compose_mold` persists `composition_result_json`; `GET /mold-factory/molds/{id}` returns it. 12 tests PASS. |
| 44 | Backtest failure persistence (FIX-03) | `IMPLEMENTED_AND_VERIFIED` | All 4 backtest outcome paths now persist. 7 tests PASS. |

---

## 3. Updated Tier Roll-up

| Tier | Count at `91f2909` | Count at `6efac89` | Delta |
|---|---|---|---|
| `IMPLEMENTED_AND_VERIFIED` | 22 | **31** | +9 (upgrades + new capabilities) |
| `IMPLEMENTED_NOT_LIVE_TESTED` | 1 | 1 | 0 |
| `PARTIALLY_IMPLEMENTED` | 2 | 1 | -1 (ToolExecutor upgraded) |
| `CONTRACT_OR_CATALOG_ONLY` | 1 | 1 | 0 |
| `MOCK_ONLY` | 2 | 2 | 0 |
| `NOT_IMPLEMENTED` | 3 | 2 | -1 (General Analyst seed bug closed; the recipe-promote + quality-gate endpoints remain NOT_IMPLEMENTED but honestly documented) |
| `BLOCKED_BY_ENVIRONMENT` | 1 | 1 | 0 |
| **Total** | **32 catalogued + 4 cross-cutting** | **38 catalogued + 6 cross-cutting** | +8 net |

---

## 4. Capability → Endpoint Mapping (Updated)

The original §12 mapping is extended:

| Capability | Primary API endpoints (at `6efac89`) |
|---|---|
| Knowledge Graph edge retrieval (R-01) | `GET /memory/investigations/{id}/edges` |
| Investigation listing (R-04) | `GET /mold-factory/investigations` |
| Investigation detail retrieval (R-05) | `GET /mold-factory/investigations/{id}` |
| Forecast listing (R-06) | `GET /foresight/forecasts` |
| Backtest history retrieval (R-07) | `GET /foresight/forecasts/{id}/backtests` |
| Agent session listing (R-08) | `GET /agents/sessions` |
| Mold Blueprint persistence (FIX-01) | `POST /mold-factory/compose` (persists); `GET /mold-factory/molds/{id}` (returns `composition_result`) |
| Backtest failure persistence (FIX-03) | `POST /foresight/backtest` (persists all outcomes) |

---

## 5. What the UI Team Must NEVER Do (Updated)

The original §14 list is updated:

1. **Never** treat mock responses as real LLM output. Always check `is_mock`. *(unchanged)*
2. **Never** display a `downloadable=False` publication's download button as enabled. *(unchanged)*
3. **Never** collapse supporting + refuting edges into a single "consensus" view. *(unchanged — R-01 preserves contradictions)*
4. **Never** show per-user workspaces — there is one tenant today. *(unchanged)*
5. **Never** auto-advance investigation states — every transition is an explicit API call. *(unchanged)*
6. **Never** show Crossref or arXiv with a "Sandbox test" button — the connector code does not exist. *(unchanged)*
7. **Never** call the non-existent `PATCH /agents/recipes/{id}/promote` or `GET /publishing/publications/{id}/quality-gate` endpoints. *(unchanged — R-09 confirmed they are NOT implemented; the docstrings are corrected)*
8. **Never** hide the `deliverable_type="coverage_blocker_report"` flag — it must be a prominent banner. *(unchanged)*
9. **Never** present a fictional storyboard scene without its `disclosure_text`. *(unchanged)*
10. **Never** treat `recommended_method="insufficient_evidence"` as a forecast — it is an explicit refusal to fabricate. *(unchanged)*
11. **NEW**: Never fabricate `coverage[]` or `detected_needs[]` for a mold when `composition_details_available=false`. Use the honest signal. *(FIX-01)*
12. **NEW**: Never treat a failed backtest as "not run". The `notes` field distinguishes the outcome; NULL metrics are honest, not missing. *(FIX-03)*

---

## 6. Cross-Reference to Original Catalog

The original `BACKEND_VERIFICATION_01/FUNCTIONAL_CAPABILITY_CATALOG.md` remains the historical record at SHA `91f2909`. This addendum supersedes it for the capabilities documented in §2 and §3. For all other capabilities, the original remains authoritative.
