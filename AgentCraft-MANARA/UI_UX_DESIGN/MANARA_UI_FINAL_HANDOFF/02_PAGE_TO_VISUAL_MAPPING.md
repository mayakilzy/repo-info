# MANARA — Page to Visual Mapping

> **Document type.** Maps each of the 9 MANARA pages to its approved visual reference(s) + implementation notes.
> **Date.** 2026-10-21.
> **Code baseline.** `6efac89bda807825f1cc29b44a59cbd11168fb69`.

---

## 1. Mapping Overview

Each MANARA page maps to one or more visual references. The mapping specifies:
- **Primary visual** — the APPROVED_VISUAL or APPROVED_DIRECTION image that defines the page's aesthetic.
- **Supporting visuals** — SUPPORTING_ONLY images that provide additional design cues.
- **Implementation notes** — what to build, what to remove, what to mark as future.

---

## 2. Page 01 — Investigation Home

| Field | Value |
|---|---|
| **Primary visual** | `01_Home/a_wide_high_resolution_ui_website_app_dashboard_s.png` (APPROVED_VISUAL) |
| **Supporting visuals** | None |
| **Backend endpoints** | `POST /mold-factory/compose`, `GET /status`, `GET /discovery` |
| **User role** | Researcher |

### Implementation notes

**BUILD:**
- Lighthouse hero artwork (preserve the original lighthouse on rocky cliff).
- Hero headline: "What do you want to discover today?"
- Research question textarea (10–1000 chars, character counter).
- "Start Investigation" button (calls `POST /mold-factory/compose`).
- 3-step workflow explanation (static copy: analyze needs → check coverage → build investigation).
- Synthetic discovery example (calls `GET /discovery`, labeled SYNTHETIC).
- Left sidebar navigation (9 pages).

**REMOVE (not supported by backend):**
- User profile avatar + "Researcher" label (no auth — G01).
- Global search bar with `Ctrl+K` (no universal search endpoint).
- Language selector showing French/German/Spanish (only English + Arabic are supported).
- Sun/moon dark mode toggle (not in scope — the dual-theme is per-page Studio/Observatory, not a global toggle).

**Honest flags to surface:**
- `is_unknown_domain=true` → blue "NEW DOMAIN" badge.
- `is_complete=false` → amber "PARTIAL COVERAGE" banner.
- `deliverable_type="coverage_blocker_report"` → red banner.

---

## 3. Page 02 — Investigation Workspace

| Field | Value |
|---|---|
| **Primary visual** | `02_Investigation/a_clean_modern_ui_ux_dashboard_screenshot_for_a_r.png` (APPROVED_DIRECTION — Observatory Concept 02) |
| **Supporting visuals** | `02_Investigation/a_wide_detailed_ui_ux_concept_board_for_a_researc.png` (states/coverage), `02_Investigation/a_wide_clean_high_resolution_ui_ux_design_showca.png` (knowledge graph) |
| **Backend endpoints** | `GET /mold-factory/investigations/{id}`, `GET /mold-factory/investigations/{id}/workflow`, `POST /mold-factory/investigations/{id}/transition`, `GET /memory/investigations/{id}/evidence`, `POST /memory/evidence`, `POST /memory/evidence/{id}/claims`, `POST /memory/claims/{id}/support`, `PATCH /memory/claims/{id}/verdict`, `POST /agents/resolve`, `POST /agents/sessions`, `POST /agents/sessions/{id}/execute`, `GET /agents/sessions/{id}`, `POST /foresight/assess`, `POST /foresight/forecasts`, `POST /foresight/backtest`, `POST /publishing/publications`, `GET /memory/investigations/{id}/decisions` |
| **User role** | Researcher + Investigation Manager |

### Implementation notes

**BUILD:**
- 13-state workflow stepper (the actual FSM states: `received`, `scoped`, `coverage_checked`, `building_capabilities`, `mold_ready`, `acquiring`, `normalizing`, `evidencing`, `forecasting_or_scenarios`, `drafting`, `verification`, `deliverable_ready`, `archived`). Do NOT use the 7-state shortcut shown in the mockup.
- Coverage panel with per-need `coverage_level` badges (NONE/CATALOG/OPERATIONAL/VERIFIED).
- Evidence list (source_id, observed_at, ingested_at, kind, checksum).
- Agent sessions card with `is_mock` banner, `granted_tools`, `tool_invocations[]` (4 status icons).
- Forecast + publication integration (cross-link to Pages 08 + 09).
- Audit timeline (`GET /memory/investigations/{id}/decisions`).
- Dark Observatory surface for analytical panels.

**REMOVE:**
- "Share" button (no endpoint).
- "PDF export" button (not implemented).
- "Edit investigation question" (no endpoint).
- "Pause workflow" (no endpoint — transitions are explicit via `POST /.../transition`).
- Fictitious progress percentages (only derive from real enumerated records).

**VERIFY (closed in CLOSURE-01):**
- Workflow state read: `GET /mold-factory/investigations/{id}/workflow` (confirmed GET, not POST).
- Investigation reload: `GET /mold-factory/investigations/{id}` (R-05 closed).
- Knowledge graph edges: `GET /memory/investigations/{id}/edges` (R-01 closed — render only API-backed edges).

**Honest flags:**
- `transitioned=false` + `blocker` → red warning with blocker text.
- `is_mock=true` → yellow MOCK banner + watermark.
- `leakage_detected=true` → red LEAKAGE banner.
- `deliverable_type="coverage_blocker_report"` → red header on publication card.

---

## 4. Page 03 — Memory Explorer

| Field | Value |
|---|---|
| **Primary visuals** | `03_Memory/a_wide_ui_ux_multi_panel_dashboard_mockup_for_a_re.png` (APPROVED_DIRECTION — catalog), `03_Memory/a_wide_high_resolution_infographic_style_ui_mocku.png` (APPROVED_DIRECTION — claim examination) |
| **Supporting visuals** | None |
| **Backend endpoints** | `GET /memory/investigations/{id}/evidence`, `GET /memory/evidence/{id}`, `GET /memory/investigations/{id}/claims`, `GET /memory/investigations/{id}/edges` (R-01), `POST /memory/investigations/{id}/search-prior`, `POST /memory/investigations/{id}/reuse`, `POST /memory/investigations/{id}/at-cutoff` (POST confirmed), `GET /memory/investigations/{id}/decisions`, `POST /memory/snapshots`, `PATCH /memory/claims/{id}/verdict` |
| **User role** | Investigation Manager |

### Implementation notes

**BUILD:**
- Evidence list with bitemporal timestamps (observed_at, ingested_at, published_at).
- Claim list with verdict filter (candidate/supported/contested/refuted/superseded).
- **Claim Examination split**: three columns — Supporting / Refuting / Qualifying evidence. This is the visual reference for the Knowledge Graph read path (R-01).
- Bitemporal replay (date picker + `POST /memory/investigations/{id}/at-cutoff`).
- Audit timeline (append-only decisions).

**REMOVE:**
- "Global knowledge explorer" universal search (no endpoint).
- Confidence percentages (e.g. "92%") — no fabricated certainty.
- Cross-investigation metrics not backed by API.

**VERIFY (closed in CLOSURE-01):**
- Knowledge graph edges: `GET /memory/investigations/{id}/edges` returns `edge_id`, `claim_id`, `evidence_id`, `relation`, `weight`, `notes`, `created_at`. Render only these edges — no fabricated nodes.

**Honest flags:**
- `verdict=contested` → amber chip with both supporting + refuting evidence listed.
- `deduplicated=true` → blue DEDUPED chip.
- `freshness="outdated"` → gray OUTDATED chip on reuse links.

---

## 5. Page 04 — Capability Registry

| Field | Value |
|---|---|
| **Primary visual** | `04_Capabilities/a_wide_detailed_ui_dashboard_mockup_screenshot_of.png` (APPROVED_DIRECTION — Concept 01) |
| **Supporting visuals** | None |
| **Backend endpoints** | `GET /registry/capabilities`, `GET /registry/capabilities/{id}`, `GET /registry/search`, `GET /registry/search/coverage`, `POST /registry/capabilities`, `POST /registry/capabilities/seed`, `PATCH /registry/capabilities/{id}/promote`, `DELETE /registry/capabilities/{id}`, `GET/POST /registry/capabilities/{id}/evaluations`, `GET/POST /registry/capabilities/{id}/relationships`, `POST /registry/capabilities/{id}/reindex` |
| **User role** | Factory Manager |

### Implementation notes

**BUILD:**
- Capability card catalog with status badges (candidate/approved/rejected).
- Domain/tag/status filters.
- Semantic search (`GET /registry/search?q=...`).
- Multi-coverage search (`GET /registry/search/coverage?q=...`).
- Card detail: keywords_en, keywords_ar, positive_examples, negative_examples, connector_ids, evaluations, relationships.
- Promote/delete/reindex actions (admin confirmation dialogs).

**REMOVE:**
- Fictitious agents, stats, connectors shown in the mockup.
- "Use in agent" direct invocation button (no endpoint).
- Arbitrary PATCH edit capability (C-04: unsupported — DELETE + re-POST only).
- Universal preinstalled capability cards fabricated by the image.

**VERIFY:**
- Relationship graph: use `GET /registry/capabilities/{id}/relationships` per-capability (no system-wide graph endpoint). Issue N calls and merge client-side.

**Honest flags:**
- `status=candidate` → gray CANDIDATE badge.
- `connector_ids=[]` → amber NO CONNECTOR badge (coverage will be CATALOG, not OPERATIONAL).

---

## 6. Page 05 — Source Foundry

| Field | Value |
|---|---|
| **Primary visual** | `05_Foundry/a_wide_clean_modern_dashboard_ui_mockup_image_fo.png` (APPROVED_DIRECTION — Concept 01) |
| **Supporting visuals** | `05_Foundry/a_wide_clean_modern_ui_dashboard_mockup_in_a_hig.png` (lifecycle cues), `05_Foundry/wide_detailed_ui_ux_dashboard_screenshot_of_an_app.png` (FUTURE_DESIGN — do not implement) |
| **Backend endpoints** | `GET /foundry/candidates`, `GET /foundry/candidates/{id}`, `POST /foundry/candidates/{id}/discover`, `POST /foundry/candidates/{id}/assess`, `POST /foundry/candidates/{id}/register-connector`, `POST /foundry/candidates/{id}/sandbox-test`, `POST /foundry/candidates/{id}/approve`, `POST /foundry/candidates/{id}/quarantine` |
| **User role** | Factory Manager |

### Implementation notes

**BUILD:**
- Candidate list: OpenAlex (assessable), Crossref + arXiv (PLANNED badge, sandbox test disabled).
- Candidate detail: license, data_reuse_rights, commercial_rights, auth_required, rate_limit_policy, allowed_hosts, primary_data_types, coverage_geographies, languages.
- Lifecycle: discover → assess → register-connector → sandbox-test → approve.
- Quarantine action.

**REMOVE / DISABLE:**
- Crossref + arXiv sandbox test button (returns 422 — no connector code).
- Extra providers (PubMed, Scopus, World Bank) shown in mockup — not wired.
- Connected flags for unimplemented sources.

**FUTURE (do not implement as active):**
- Custom source addition wizard (FUTURE_DESIGN classification).
- API key, OAuth, paid subscription, institutional access, secret vault, billing — all future backend enhancements (Source Connector Framework). Reserve for backlog only.

**Honest flags:**
- `state=quarantined` → red QUARANTINED badge.
- Sandbox test `success=false` + `error="rate_limited_after_retries"` → amber SOURCE UNAVAILABLE banner.
- Sandbox test provenance object shown on result card.

---

## 7. Page 06 — Mold Factory

| Field | Value |
|---|---|
| **Primary visual** | `06_Molds/mold_factory_blueprint_dashboard.png` (**APPROVED_VISUAL — Concept 02, owner prefers**) |
| **Supporting visuals** | `06_Molds/mold_factory_dashboard_interface.png` (Mold Library Concept 01 auxiliary) |
| **Backend endpoints** | `GET /mold-factory/molds`, `GET /mold-factory/molds/{id}` (returns `composition_result` per FIX-01), `PATCH /mold-factory/molds/{id}/promote`, `POST /mold-factory/molds/{id}/archive`, `GET /mold-factory/molds/{id}/gaps` |
| **User role** | Factory Manager |

### Implementation notes

**BUILD (Concept 02 — dark-blue blueprint):**
- **Mold Recipe Blueprint panel** (the prominent dark-blue panel the owner prefers). 3-column flow:
  - Left: Research Needs (from `composition_result.detected_needs[]`).
  - Middle: Selected Capabilities (from `composition_result.coverage[].selected_capability_id`).
  - Right: Coverage Status (VERIFIED/OPERATIONAL/CATALOG/NONE color-coded, from `composition_result.coverage[].coverage_level`).
  - Curved connector lines between columns (color-matched to coverage level).
- Gap analysis table below the blueprint (from `GET /mold-factory/molds/{id}/gaps`).
- Mold metadata header (ID, name, domain, version, state, last piloted).
- Mold library list (Concept 01 auxiliary) with state/domain filters.

**REMOVE:**
- "PLANNING" workflow state shown in mockup (not in the 13 FSM states — use actual `InvestigationWorkflowRow.state`).
- Fictitious capability IDs (CAP-001, CAP-008, etc. — use real `capability_id` values from the API).
- Arbitrary mold editor / clone / version rollback (no endpoints).
- "Add paid source to close gap" button (future enhancement — link to backlog, not active).

**VERIFY (closed in CLOSURE-02 / FIX-01):**
- `GET /mold-factory/molds/{id}` now returns `composition_result` + `composition_details_available`. The blueprint panel data comes from `composition_result`. For legacy molds (pre-migration 0008), `composition_details_available=false` — show honest "Mold Blueprint details not available for this legacy mold" message.

**Honest flags:**
- `state=temporary/reusable/maintained/archived` → corresponding badge.
- `coverage_level=NONE/CATALOG/OPERATIONAL/VERIFIED` → red/amber/yellow/green chips per need.
- `is_complete=false` → amber PARTIAL COVERAGE badge.

---

## 8. Page 07 — Agent Registry

| Field | Value |
|---|---|
| **Primary visual** | `07_Agents/wide_detailed_ui_screenshot_of_a_web_application.png` (APPROVED_DIRECTION — Concept 02) |
| **Supporting visuals** | `07_Agents/a_wide_clean_modern_ui_dashboard_screenshot_mo.png` (Observatory concept) |
| **Backend endpoints** | `GET /agents/recipes`, `GET /agents/recipes/{id}`, `POST /agents/recipes/seed-clinical`, `POST /agents/recipes/seed-generalist`, `POST /agents/resolve`, `POST /agents/sessions`, `POST /agents/sessions/{id}/execute`, `POST /agents/sessions/{id}/terminate`, `POST /agents/sessions/{id}/evaluate`, `GET /agents/sessions/{id}` (returns `tool_invocations` per R-02), `GET /agents/sessions` (R-08 list) |
| **User role** | Factory Manager |

### Implementation notes

**BUILD:**
- Recipe cards (id, display_name, role, specialty, state, version, allowed_tools).
- Seed buttons: "Seed Clinical Reviewer" + "Seed General Analyst" (both succeed per FIX-02).
- Session instantiation → execution → evaluation flow.
- Session detail: `is_mock` banner (mandatory), `granted_tools`, `tool_invocations[]` with 4 status icons (✅ executed / ❌ denied / ⚠️ not_implemented / ⛔ error).
- Session list (R-08: `GET /agents/sessions` with investigation/recipe/status filters).

**REMOVE:**
- "Promote Recipe" button (R-09: `PATCH /agents/recipes/{id}/promote` NOT implemented).
- Edit / clone / export configuration buttons (no endpoints).
- Success rate dashboard (no performance stats endpoint — G28).
- Fabricated agents/performance percentages.

**VERIFY (closed in CLOSURE-01 + CLOSURE-02):**
- `tool_invocations[]` now returned by `GET /agents/sessions/{id}` + `POST .../execute` (R-02).
- `POST /agents/recipes/seed-generalist` now succeeds (FIX-02 — state changed from MAINTAINED to ON_DEMAND).

**Honest flags:**
- `is_mock=true` → yellow MOCK banner + diagonal watermark on every paragraph of the response.
- `execution_mode="mock"` → always today (until G02 live LLM is wired).
- `state=on_demand/recipe_saved/tested/maintained/retired` → corresponding badge.

---

## 9. Page 08 — Foresight

| Field | Value |
|---|---|
| **Primary visuals** | `08_Foresight/a_wide_high_resolution_ui_dashboard_screenshot_in.png` (APPROVED_DIRECTION — Concept 01 Observatory), `08_Foresight/a_detailed_wide_high_resolution_ui_dashboard_scr.png` (APPROVED_DIRECTION — Concept 02 organization) |
| **Supporting visuals** | None |
| **Backend endpoints** | `POST /foresight/assess`, `POST /foresight/forecasts`, `GET /foresight/forecasts` (R-06 list), `GET /foresight/forecasts/{id}` (returns `probability_distribution` per R-03), `POST /foresight/forecasts/{id}/publish`, `POST /foresight/forecasts/{id}/revise`, `POST /foresight/forecasts/{id}/try-modify`, `POST /foresight/backtest`, `GET /foresight/forecasts/{id}/backtests` (R-07 list) |
| **User role** | Investigation Manager |

### Implementation notes

**BUILD:**
- Evidence sufficiency assessment (`POST /foresight/assess`). When `recommended_method="insufficient_evidence"`, hide the forecast input form + show `assessment_reasoning` verbatim.
- Forecast creation → publish (immutable) → revise flow.
- Forecast list (R-06: `GET /foresight/forecasts` with investigation/status filters).
- Backtest execution + history list (R-07: `GET /foresight/forecasts/{id}/backtests`).
- Backtest result card: MAE, RMSE, baseline_mae, improvement_over_baseline, leakage_detected, leaked_evidence_ids.
- Probability distribution chart (only when `probability_distribution` is non-empty — R-03 closed).

**REMOVE:**
- Confidence donuts / fabricated probability distributions when `method="insufficient_evidence"`.
- Generic map overlays not backed by API data.
- Chart exports / PDF (not implemented).
- "Try Modify" as an ordinary edit control (it's a dev-only regression demo — omit from researcher UI).

**VERIFY (closed in CLOSURE-01 + CLOSURE-02):**
- `probability_distribution` now returned by `GET /foresight/forecasts/{id}` (R-03).
- Forecast list now available (R-06).
- Backtest history now available (R-07).
- **FIX-03**: backtest history now includes ALL attempts (success + 3 failure paths). Failed attempts carry NULL metrics + distinguishing `notes`.

**Honest flags:**
- `method="insufficient_evidence"` → red INSUFFICIENT EVIDENCE badge. No probability chart.
- `status="published"` → green PUBLISHED — IMMUTABLE badge.
- `leakage_detected=true` → red LEAKAGE DETECTED banner with `leaked_evidence_ids[]`.
- `improvement_over_baseline < 0` → red WORSE THAN BASELINE chip.

---

## 10. Page 09 — Publishing Studio

| Field | Value |
|---|---|
| **Primary visuals** | `09_Publishing/a_wide_high_resolution_ui_dashboard_screenshot_c.png` (**APPROVED_VISUAL — Concept 02 dark sidebar**), `09_Publishing/a_wide_polished_ui_dashboard_screenshot_of_a_rese.png` (**APPROVED_VISUAL — Reader Concept 01**) |
| **Supporting visuals** | None |
| **Backend endpoints** | `POST /publishing/publications`, `GET /publishing/publications`, `GET /publishing/publications/{id}`, `GET /publishing/publications/{id}/download?format=json\|markdown\|text` |
| **User role** | Researcher + Investigation Manager |

### Implementation notes

**BUILD (Concept 02 — studio with dark status sidebar):**
- Publication list with status badges (draft/published), deliverable_type badges.
- Publication detail: content_json (dossier sections / presenter script / storyboard scenes).
- **Dark status sidebar**: quality gate checklist (5 rules from `quality_gate_issues[]`), metadata (type, domain, version, dates), evidence sources, related outputs.
- Download dropdown: Markdown / JSON / Text (enabled only when `downloadable=true`).
- Coverage blocker report card (red-highlighted when `deliverable_type="coverage_blocker_report"`).

**BUILD (Concept 01 — reader view):**
- Document viewer with tabs: Read / Presenter Edition / Visual Storyboard / Details.
- Evidence chain sidebar.
- Download: Markdown / JSON / Text.

**REMOVE:**
- PDF / HTML download options (greyed out in mockup — correct behavior, but do not even show them as greyed; just omit).
- "Share Link" button (no endpoint).
- "Versions" tab (no version history endpoint).
- "Export" global button (no PDF).
- Online collaborative editor (not implemented).

**VERIFY (closed in CLOSURE-01):**
- Quality gate result: read `quality_gate_passed` + `quality_gate_issues` from `GET /publishing/publications/{id}` (R-09: standalone `GET .../quality-gate` NOT implemented).
- Download gated by `downloadable` field (not by `status="published"`).

**Honest flags:**
- `deliverable_type="coverage_blocker_report"` → red COVERAGE BLOCKER header. Download enabled but file is a gap report.
- `quality_gate_passed=false` → red QUALITY GATE FAILED badge. Download disabled.
- `downloadable=false` → download buttons disabled.
- `rights_status="unknown"/"restricted"` → red RIGHTS UNCLEARED badge on storyboard scenes.
- `scene_type=fictional_scene` → red chip + `disclosure_text` banner.

---

## 11. Page 10 — Design System (cross-cutting)

| Field | Value |
|---|---|
| **Primary visual** | `10_System/a_wide_clean_ui_design_system_infographic_dashboa.png` (APPROVED_DIRECTION — states feedback) |
| **Supporting visuals** | `10_System/a_clean_high_resolution_multi_panel_ui_style_gui.png` (design system reference), `10_System/a_clean_detailed_ui_ux_design_presentation_poster.png` (responsive/LTR-RTL), `10_System/a_wide_polished_multi_panel_ui_ux_showcase_image.png` (mobile/tablet/Arabic) |
| **Backend endpoints** | N/A (design system is frontend-only) |
| **User role** | All |

### Implementation notes

**BUILD (cross-cutting design system):**
- Color palette: Porcelain #F7F8F6, Ink #19334A, Teal #2C7380, Brass #BB9362, Mist #E8EFF1.
- Typography: Source Serif 4 (headings), Inter (English UI), IBM Plex Sans Arabic (Arabic UI).
- Component library: StateBadge, CoverageBadge, APIErrorNotice, AsyncRegion, ConfirmationDialog, EvidenceReference, GraphCanvas.
- State examples: loading, empty, success, error, partial, mock, complete, gate failure, coverage blocker, insufficient evidence, source unavailable, blocked transition.
- Responsive breakpoints: desktop (sidebar + rich content), tablet (drawer + adaptive columns), mobile (primary content first).
- English default LTR, Arabic optional RTL (logical CSS properties, isolate DOIs/URLs/source text).

**REMOVE / CORRECT:**
- Misleading elements in the mobile/tablet/Arabic showcase image (extra sources, fabricated data).
- Fictitious source names, references, dates, statistics, confidence, charts — replace with real API values or explicit empty states.

**Accessibility (WCAG 2.2 AA target):**
- Keyboard navigation, visible focus rings, screen reader names, color-independent statuses, contrast, text resizing, 44px minimum touch targets, reduced motion, 200% zoom.

---

## 12. Cross-Page State Matrix

Every page must handle these states (from `MANARA_COMPONENT_API_BINDING_CLOSURE_v1.md` §3):

| State | Trigger | UI behavior |
|---|---|---|
| Loading | In-flight request | Skeleton/spinner, no fake percentages |
| Empty | Successful empty result | Clear empty message + valid next action |
| Success | 2xx with payload | Display result + honest flags |
| API/Network failure | 4xx/5xx/connection | User-safe error, trace_id details, retry |
| Partial coverage | `is_complete=false` | Visible unmet needs + gaps |
| Insufficient evidence | `recommended_method="insufficient_evidence"` | Show reasoning, no probability chart |
| Source unavailable | Sandbox test `success=false` | Error cause + retry guidance |
| Blocked transition | `transitioned=false` | Show `blocker` text |
| Mock | `is_mock=true` | Prominent banner + watermark |
| Quality gate failed | `quality_gate_passed=false` | Render issues, disable download |
| Coverage blocker | `deliverable_type="coverage_blocker_report"` | Separate visual, not research dossier |
| Leakage | `leakage_detected=true` | Prominent banner + leaked evidence IDs |
| Rights uncleared | `rights_status="unknown"/"restricted"` | Mark affected scenes |
| Investigation ready/archived | Workflow state | Distinct complete/archive treatment |
