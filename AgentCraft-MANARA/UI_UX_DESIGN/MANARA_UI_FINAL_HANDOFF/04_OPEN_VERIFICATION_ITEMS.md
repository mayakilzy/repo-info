# MANARA — Open Verification Items

> **Document type.** Items marked OPEN rather than guessed — requires owner decision before implementation.
> **Date.** 2026-10-21.
> **Authorization.** DOCUMENTATION-ONLY. No frontend implementation.

---

## 1. Purpose

This document lists every item that could not be resolved definitively from the approved visual assets + the backend code at SHA `6efac89`. Each item is marked **OPEN** and requires the owner's decision before frontend implementation begins.

**Per the mission directive:** "Mark missing, ambiguous, or contradictory visual references as OPEN rather than guessing."

---

## 2. Open Items

### OPEN-01 — Visual reference for Page 02 (Investigation Workspace) "Concept 02" vs the 7-state shortcut

**Issue.** The approved visual (`02_Investigation/a_clean_modern_ui_ux_dashboard_screenshot_for_a_r.png`) shows a workflow stepper with 7 states. The backend FSM has 13 states. The reconciliation document says "workflow stepper must use 13 actual FSM states."

**Question.** Does the owner want:
- (a) The 13-state stepper rendered in the same visual style as Concept 02 (compact, possibly with sub-states grouped), OR
- (b) A 7-state "high-level" stepper that maps to the 13 FSM states (with a "show details" expander), OR
- (c) Something else?

**Backend fact.** The 13 FSM states are: `received`, `scoped`, `coverage_checked`, `building_capabilities`, `mold_ready`, `acquiring`, `normalizing`, `evidencing`, `forecasting_or_scenarios`, `drafting`, `verification`, `deliverable_ready`, `archived`. These are non-negotiable — the UI must not invent or collapse states.

**Recommendation.** Option (a): 13-state stepper in Concept 02 style, with the current state highlighted and sub-states visually grouped (e.g. `coverage_checked` + `building_capabilities` + `mold_ready` under a "Mold" group).

**Status.** OPEN — owner decision required.

---

### OPEN-02 — Knowledge Graph visualization depth (Page 02 + Page 03)

**Issue.** The approved visuals show knowledge graph visualizations with nodes and edges. The backend provides:
- `GET /memory/investigations/{id}/edges` (R-01) — returns claim↔evidence edges.
- `GET /registry/capabilities/{id}/relationships` — returns capability↔capability edges (per-capability, not system-wide).

**Question.** Does the owner want:
- (a) A full interactive graph canvas (nodes draggable, zoomable, clickable), OR
- (b) A simpler list/table view with optional graph visualization, OR
- (c) A hybrid (graph for small datasets, list fallback for large)?

**Backend fact.** There is NO system-wide graph query endpoint. The UI must issue N calls (one per claim or one per capability) and merge client-side. For ≤200 items this is acceptable; for >500 it would be slow.

**Recommendation.** Option (c): hybrid. Graph canvas for ≤50 nodes; accessible list fallback always available; "show graph" toggle.

**Status.** OPEN — owner decision required.

---

### OPEN-03 — Studio/Observatory switch scope

**Issue.** The design system mentions a "Studio/Observatory" mode switch. The approved visuals show light surfaces (Studio) and dark analytical surfaces (Observatory).

**Question.** Does the owner want:
- (a) A global toggle (whole app switches between light and dark), OR
- (b) A per-page toggle (each page can be in Studio or Observatory mode independently), OR
- (c) Automatic (certain pages/panels are always Observatory, others always Studio)?

**Backend fact.** This is a frontend-only concern — no backend impact.

**Recommendation.** Option (c): automatic. Investigation Workspace analytical panels, Memory Explorer graph, Foresight charts → Observatory (dark). Home, Capability Registry, Mold Factory library → Studio (light). Mold Factory blueprint panel is always dark-blue (per Concept 02).

**Status.** OPEN — owner decision required.

---

### OPEN-04 — Role switcher behavior

**Issue.** The design system mentions a "role switcher" (Researcher / Investigation Manager / Factory Manager). The backend has NO authentication (G01) — every caller is `tenant_demo`.

**Question.** Does the owner want:
- (a) A visual-only role switcher (changes which pages/actions are emphasized, but no real authorization), OR
- (b) Remove the role switcher entirely (since there's no auth), OR
- (c) Keep it as a "demo mode" label that explains the 3 roles?

**Backend fact.** No auth. The role switcher is purely cosmetic. It MUST NOT be presented as a security boundary.

**Recommendation.** Option (c): keep as a "demo mode" explanatory label, not an interactive switcher. Show "Single-tenant demo mode" in the footer.

**Status.** OPEN — owner decision required.

---

### OPEN-05 — Mobile navigation pattern

**Issue.** The approved visuals show mobile layouts, but the navigation pattern is ambiguous.

**Question.** Does the owner want:
- (a) A hamburger menu that opens a drawer with the 9 pages, OR
- (b) A bottom navigation bar with the top 4-5 pages + "more" menu, OR
- (c) A tab bar?

**Backend fact.** Frontend-only concern.

**Recommendation.** Option (a): hamburger menu + drawer. The 9 pages are too many for a bottom bar; the drawer scales.

**Status.** OPEN — owner decision required.

---

### OPEN-06 — Arabic font licensing

**Issue.** The design system proposes "IBM Plex Sans Arabic" for Arabic UI text. The licensing + weight availability needs verification.

**Question.** Has the owner verified:
- (a) IBM Plex Sans Arabic is available under a compatible license (SIL OFL 1.1)?
- (b) The required weights (Regular, Medium, SemiBold) are available?
- (c) The font renders correctly with the proposed layout?

**Backend fact.** Frontend-only concern.

**Recommendation.** Verify (a), (b), (c) before implementation. IBM Plex Sans Arabic is indeed SIL OFL 1.1 licensed and has the required weights. The implementation team should confirm rendering on target browsers.

**Status.** OPEN — owner verification required.

---

### OPEN-07 — Polling intervals for long-running operations

**Issue.** The design foundation specifies polling (no WebSocket). The exact intervals are not finalized.

**Question.** Does the owner approve:
- (a) Agent session: poll every 2 seconds. Workflow: poll every 5 seconds. (Per the foundation.)
- (b) Different intervals?
- (c) Exponential backoff?

**Backend fact.** G16: SQLite "database is locked" under high concurrency. G14: no API rate limiting. The UI should debounce to avoid overwhelming the backend.

**Recommendation.** Option (a) with a 5-minute timeout. If the operation is still running after 5 minutes, show "operation timed out" with a retry button.

**Status.** OPEN — owner decision required.

---

### OPEN-08 — Coverage Blocker Report visual treatment

**Issue.** The reconciliation says `deliverable_type="coverage_blocker_report"` must be visually distinct from a research dossier. The approved Publishing visuals show a "Coverage Blocker Report" card but the exact treatment is ambiguous.

**Question.** Does the owner want:
- (a) A completely different layout (red header, "COVERAGE BLOCKER" in title, gap list as body), OR
- (b) Same layout as research dossier but with a red banner, OR
- (c) A modal that explains the situation before showing the report?

**Backend fact.** `deliverable_type` is returned by `GET /publishing/publications/{id}`. The `downloadable` field gates the download button.

**Recommendation.** Option (a): completely different layout. The risk of mistaking a coverage blocker for a research deliverable is too high.

**Status.** OPEN — owner decision required.

---

### OPEN-09 — Audit log visualization

**Issue.** The Memory Explorer shows an audit timeline. The backend returns `GET /memory/investigations/{id}/decisions` as an append-only list. The visualization style is ambiguous.

**Question.** Does the owner want:
- (a) A reverse-chronological list (newest first), one card per decision, OR
- (b) A horizontal timeline with milestones, OR
- (c) A filterable table (columns: time, type, actor, rationale)?

**Backend fact.** The audit log can grow to hundreds of entries. No pagination (G15: `limit` + `offset` only).

**Recommendation.** Option (c): filterable table with client-side pagination (50 per page).

**Status.** OPEN — owner decision required.

---

### OPEN-10 — Bitemporal replay visualization

**Issue.** `POST /memory/investigations/{id}/at-cutoff` returns evidence visible at a cutoff time. The visualization is ambiguous.

**Question.** Does the owner want:
- (a) A date picker + "replay" button that shows the evidence visible at that date, OR
- (b) A scrubber (horizontal slider) over a timeline, OR
- (c) A "time travel" mode that re-renders the entire UI as of a chosen date?

**Backend fact.** The endpoint returns a list of evidence items with `observed_at` + `ingested_at`. No streaming.

**Recommendation.** Option (a): date picker + replay button. Simpler + less likely to confuse users who don't understand bitemporal semantics.

**Status.** OPEN — owner decision required.

---

## 3. Items NOT Open (Resolved by Backend Closure)

The following items were OPEN in the original reconciliation (`MANARA_VISUAL_FUNCTIONAL_RECONCILIATION_v1.md` §5) but are now RESOLVED by CLOSURE-01 + CLOSURE-02:

| Original Item | Resolution |
|---|---|
| Q01: GET vs POST workflow state read | RESOLVED: `GET /mold-factory/investigations/{id}/workflow` confirmed (CLOSURE-01 reconciliation). |
| Q02: Evidence-support relationship read shape | RESOLVED: `GET /memory/investigations/{id}/edges` (R-01) returns the full edge shape. |
| Q03: Need→capability edge data for Mold Blueprint | RESOLVED: `GET /mold-factory/molds/{id}` returns `composition_result` (FIX-01). |
| Q04: Graph node/edge read capacity | RESOLVED: R-01 (memory edges) + per-capability relationship reads. No system-wide graph endpoint (by design). |
| Q05: Publication download enum + blocker handling | RESOLVED: formats = json/markdown/text; gated by `downloadable` field. |
| Q06: GET /status payload + role UI | RESOLVED: `GET /status` returns capabilities + not_implemented list. Role switcher is visual-only. |
| Q07: Pagination availability | RESOLVED: `limit` + `offset` on list endpoints. No cursor pagination (G15). |
| Q08: Source licensing + future paid integrations | RESOLVED: documented as FUTURE_DESIGN. Source Connector Framework is a separate backend mission. |
| Q09: Visual asset manifest with checksums | RESOLVED: this package (22 images SHA-256 verified). |
| Q10: Per-page state + keyboard/mobile behavior | RESOLVED: see `03_IMPLEMENTATION_HANDOFF_SPECIFICATIONS.md` §4. |

---

## 4. Owner Decision Required

The 10 OPEN items above require the owner's decision before frontend implementation begins. GLM recommends the listed recommendation for each, but the owner may choose differently.

**These items do NOT block the documentation handoff.** They block the *implementation* handoff. The owner should resolve them in the implementation authorization mission.
