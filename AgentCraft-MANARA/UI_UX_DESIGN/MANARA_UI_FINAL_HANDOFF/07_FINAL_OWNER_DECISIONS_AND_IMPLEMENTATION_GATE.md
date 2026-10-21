# MANARA — Final Owner Decisions & Implementation Gate

> **Mission ID.** `MANARA-UI-DESIGN-DECISIONS-CLOSURE-01`
> **Document type.** Consolidated document: all 10 owner-approved decisions + implementation gate.
> **Author.** GLM (Implementer).
> **Owner.** Ayman (Project Owner).
> **Date.** 2026-10-21.
> **Authorization.** DOCUMENTATION-ONLY. No frontend implementation.

---

## 1. Executive Summary

The project owner has explicitly approved the final decisions for all 10 OPEN items identified during `MANARA-UI-FINAL-DESIGN-LOCK-01`. This document consolidates those decisions, records their implementation requirements, and states the final implementation gate.

**All 10 OPEN items are now CLOSED — OWNER APPROVED.** The design is fully locked. The only remaining gate is the owner's separate explicit authorization for frontend implementation.

---

## 2. All 10 Owner-Approved Decisions

### 2.1 OPEN-01 — Investigation Workflow — ✅ CLOSED

**Decision.** Display all 13 real investigation FSM states using the approved Investigation Observatory Concept 02 visual style.

**Affected pages.** Page 02 (Investigation Workspace).

**Required frontend behavior.**
- Highlight the actual current state.
- Expose all 13 states through expansion or detailed navigation.
- Preserve transition blockers (`transitioned=false` + `blocker`).
- Do not invent intermediate states.
- Support desktop, tablet, and mobile layouts.
- States may be visually grouped for readability, but each real state must be preserved independently.

**API dependency.** `GET /mold-factory/investigations/{id}/workflow` (returns `state`, `transitions[]`, `blocker`).

**The 13 FSM states (non-negotiable).** `received`, `scoped`, `coverage_checked`, `building_capabilities`, `mold_ready`, `acquiring`, `normalizing`, `evidencing`, `forecasting_or_scenarios`, `drafting`, `verification`, `deliverable_ready`, `archived`.

---

### 2.2 OPEN-02 — Knowledge Graph — ✅ CLOSED

**Decision.** Implement a hybrid interactive graph experience.

**Affected pages.** Page 02 (Investigation Workspace), Page 03 (Memory Explorer), Page 04 (Capability Registry).

**Required frontend behavior.**
- Real claim/evidence and capability relationships only.
- Interactive graph with zoom, pan, node selection, and accessible detail inspection.
- List/table representation must always remain available.
- Progressive loading or suitable performance adaptations for larger datasets.
- No fixed artificial limit of 50 nodes.
- Preserve supports/refutes/qualifies distinctions.
- Do not fabricate relationships or credibility scores.

**API dependencies.**
- `GET /memory/investigations/{id}/edges` (R-01) — claim↔evidence edges.
- `GET /registry/capabilities/{id}/relationships` — capability↔capability edges (per-capacity).

---

### 2.3 OPEN-03 — Studio / Observatory — ✅ CLOSED

**Decision.** Use Modern Knowledge Studio as the default visual language. Use dark Intelligence Observatory surfaces selectively for analytical components.

**Affected pages.** All pages (cross-cutting).

**Required frontend behavior.**
- Default: Modern Knowledge Studio (light).
- Observatory (dark) surfaces applied selectively to: investigation graphs (Page 02), evidence relationships (Page 03), foresight charts (Page 08).
- Preserve the dark-blue Mold Blueprint panel from Mold Factory Concept 02 (Page 06) — always dark.
- Do NOT introduce a global dark-mode toggle as a required feature.
- The sun/moon toggle shown in the Home mockup is REMOVED.

**API dependency.** None (frontend-only).

---

### 2.4 OPEN-04 — Role Switcher — ✅ CLOSED

**Decision.** Remove the interactive role switcher entirely.

**Affected pages.** All pages (the role switcher was in the header).

**Required frontend behavior.**
- Do NOT build an interactive role switcher (Researcher / Investigation Manager / Factory Manager).
- Display a clear, unobtrusive "Single-tenant demo mode" explanation where appropriate (e.g. footer label).
- Do NOT imply actual permissions or role-based security.

**API dependency.** None (the backend has no auth — G01; every caller is `tenant_demo`).

---

### 2.5 OPEN-05 — Mobile Navigation — ✅ CLOSED

**Decision.** Use a hamburger-triggered navigation drawer for mobile.

**Affected pages.** All pages (mobile navigation).

**Required frontend behavior.**
- All nine major pages remain accessible via the drawer.
- Accessible focus management and keyboard operation.
- Proper RTL mirroring (drawer slides from right in Arabic mode).
- Clear active-page indication.
- No mandatory bottom navigation bar.
- Desktop retains the approved collapsible sidebar.

**API dependency.** None (frontend-only).

---

### 2.6 OPEN-06 — Arabic Typography — ✅ CLOSED WITH TECHNICAL VERIFICATION

**Decision.** Use IBM Plex Sans Arabic for Arabic interface typography.

**Affected pages.** All pages (Arabic RTL mode).

**Required frontend behavior (verify before implementation).**
- Compatible open-source license (IBM Plex Sans Arabic is SIL OFL 1.1).
- Required font weights (Regular, Medium, SemiBold are available).
- Correct Arabic shaping and rendering.
- Browser and device compatibility.
- Responsive behavior and accessibility.
- Do not include font binaries in documentation or handoff archives unnecessarily.
- Any required substitution must be documented without changing the approved visual identity.

**API dependency.** None (frontend-only).

---

### 2.7 OPEN-07 — Polling Strategy — ✅ CLOSED

**Decision.** Initial polling intervals: agent sessions 2 seconds, investigation workflow 5 seconds.

**Affected pages.** Page 02 (Investigation Workspace — workflow polling), Page 07 (Agent Registry — session polling).

**Required frontend behavior.**
- `GET /agents/sessions/{id}` every 2 seconds while `status="running"`.
- `GET /mold-factory/investigations/{id}/workflow` every 5 seconds during transitions.
- Apply adaptive backoff when appropriate.
- Stop polling upon terminal states.
- Cancel polling when leaving the relevant view.
- Avoid duplicate requests and concurrent polling storms.
- Provide manual refresh and retry behavior.
- After 5 minutes without a confirmed terminal result, indicate that automatic status monitoring has paused or timed out.
- **Do NOT equate a polling timeout with failure of the underlying operation.**
- Do not introduce unsupported WebSocket behavior (G30).

**API dependencies.** `GET /agents/sessions/{id}`, `GET /mold-factory/investigations/{id}/workflow`.

---

### 2.8 OPEN-08 — Coverage Blocker Report — ✅ CLOSED

**Decision.** Render `coverage_blocker_report` using a clearly distinct report layout.

**Affected pages.** Page 09 (Publishing Studio).

**Required frontend behavior.**
- Prominent coverage-blocker identification.
- Explain that the output is not a completed evidence-backed research deliverable.
- Show missing capabilities, sources, and unresolved research needs.
- Preserve links to actual available evidence and gap records.
- Do not show fabricated research conclusions.
- Respect the backend `downloadable` field for download eligibility.
- Maintain the overall MANARA visual identity.

**API dependency.** `GET /publishing/publications/{id}` (returns `deliverable_type`, `downloadable`, `quality_gate_passed`, `quality_gate_issues`).

---

### 2.9 OPEN-09 — Audit Log — ✅ CLOSED

**Decision.** Use a filterable audit table with chronological context.

**Affected pages.** Page 03 (Memory Explorer), Page 02 (Investigation Workspace audit panel).

**Required frontend behavior.**
- Date/time, decision type, actor, rationale, and related references.
- Default newest-first ordering.
- Detail inspection for individual decisions.
- Client-side paging where the endpoint returns a bounded complete dataset.
- Do not imply a complete history when only a subset has been fetched.
- No invented audit entries or actors.

**API dependency.** `GET /memory/investigations/{id}/decisions` (returns `[{id, decision_type, evidence_id, claim_id, actor, rationale, decided_at}]` with `limit` + `offset`).

---

### 2.10 OPEN-10 — Bitemporal Replay — ✅ CLOSED

**Decision.** Use a date-and-time picker with an explicit Replay action.

**Affected pages.** Page 03 (Memory Explorer).

**Required frontend behavior.**
- Call the actual `POST /memory/investigations/{id}/at-cutoff` endpoint.
- Show evidence visible at the selected cutoff.
- Preserve the distinction between event (`observed_at`), publication (`published_at`), and ingestion (`ingested_at`) timestamps when available.
- Explain the selected temporal perspective to the user.
- Show clear empty, loading, and error states.
- No simulated continuous time-travel mode.
- No fabricated historical reconstruction.

**API dependency.** `POST /memory/investigations/{id}/at-cutoff` (body: `{"cutoff_iso": str}`; returns `visible_evidence_count` + `visible_evidence[]`).

---

## 3. Verification Results

### 3.1 All 10 decision identifiers CLOSED

| # | Decision | Status |
|---|---|---|
| OPEN-01 | Investigation Workflow (13 FSM states) | ✅ CLOSED — OWNER APPROVED |
| OPEN-02 | Knowledge Graph (hybrid interactive) | ✅ CLOSED — OWNER APPROVED |
| OPEN-03 | Studio/Observatory (automatic, no global toggle) | ✅ CLOSED — OWNER APPROVED |
| OPEN-04 | Role Switcher (removed) | ✅ CLOSED — OWNER APPROVED |
| OPEN-05 | Mobile Navigation (hamburger drawer) | ✅ CLOSED — OWNER APPROVED |
| OPEN-06 | Arabic Typography (IBM Plex Sans Arabic) | ✅ CLOSED — OWNER APPROVED WITH TECHNICAL VERIFICATION |
| OPEN-07 | Polling Strategy (2s/5s + backoff + 5-min timeout) | ✅ CLOSED — OWNER APPROVED |
| OPEN-08 | Coverage Blocker Report (distinct layout) | ✅ CLOSED — OWNER APPROVED |
| OPEN-09 | Audit Log (filterable table) | ✅ CLOSED — OWNER APPROVED |
| OPEN-10 | Bitemporal Replay (date-time picker + Replay) | ✅ CLOSED — OWNER APPROVED |

### 3.2 No contradiction between handoff documents

All 7 handoff files are consistent:
- `00_README_AND_APPROVAL_STATUS.md` — approval status updated.
- `01_VISUAL_ASSET_MANIFEST_FINAL.md` — unchanged (visual assets unchanged).
- `02_PAGE_TO_VISUAL_MAPPING.md` — updated with §13 (decisions applied).
- `03_IMPLEMENTATION_HANDOFF_SPECIFICATIONS.md` — updated with §4.4–4.7 (polling, role switcher, theme, mobile) + §5 (remove list updated).
- `04_OPEN_VERIFICATION_ITEMS.md` — all 10 items marked CLOSED — OWNER APPROVED (history preserved).
- `05_REPOSITORY_BOUNDARY_VERIFICATION.md` — unchanged (boundary unchanged).
- `06_FINAL_DESIGN_LOCK_VERDICT.md` — verdict updated to DESIGN LOCK COMPLETE.
- `07_FINAL_OWNER_DECISIONS_AND_IMPLEMENTATION_GATE.md` — this file.

### 3.3 Every page retains its owner-approved primary visual reference

| Page | Primary visual | Classification |
|---|---|---|
| 01 Home | `01_Home/a_wide_high_resolution_ui_website_app_dashboard_s.png` | APPROVED_VISUAL |
| 02 Investigation | `02_Investigation/a_clean_modern_ui_ux_dashboard_screenshot_for_a_r.png` | APPROVED_DIRECTION |
| 03 Memory | `03_Memory/a_wide_ui_ux_multi_panel_dashboard_mockup_for_a_re.png` + `03_Memory/a_wide_high_resolution_infographic_style_ui_mocku.png` | APPROVED_DIRECTION |
| 04 Capabilities | `04_Capabilities/a_wide_detailed_ui_dashboard_mockup_screenshot_of.png` | APPROVED_DIRECTION |
| 05 Foundry | `05_Foundry/a_wide_clean_modern_dashboard_ui_mockup_image_fo.png` | APPROVED_DIRECTION |
| 06 Molds | `06_Molds/mold_factory_blueprint_dashboard.png` | APPROVED_VISUAL |
| 07 Agents | `07_Agents/wide_detailed_ui_screenshot_of_a_web_application.png` | APPROVED_DIRECTION |
| 08 Foresight | `08_Foresight/a_wide_high_resolution_ui_dashboard_screenshot_in.png` + `08_Foresight/a_detailed_wide_high_resolution_ui_dashboard_scr.png` | APPROVED_DIRECTION |
| 09 Publishing | `09_Publishing/a_wide_high_resolution_ui_dashboard_screenshot_c.png` + `09_Publishing/a_wide_polished_ui_dashboard_screenshot_of_a_rese.png` | APPROVED_VISUAL |

### 3.4 Every functional action corresponds to a real API or explicitly local interaction

Verified against `BACKEND_CLOSURE_01_02/API_REFERENCE_ADDENDUM.md` (73 MANARA endpoints at SHA `6efac89`). No unsupported feature is presented as implemented.

### 3.5 No unsupported feature presented as implemented

The 30+ elements in `03_IMPLEMENTATION_HANDOFF_SPECIFICATIONS.md` §5 are marked REMOVE. The 11 elements in §6 are marked FUTURE. No unsupported feature is presented as active.

### 3.6 No source code / migration / dependency / test / deployment modified

**Confirmed.** This mission is documentation-only. The code repository (`mayakilzy/AgentCraft-MANARA`) is untouched at SHA `6efac89`. All changes are confined to the documentation repository (`mayakilzy/repo-info`) under `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/`.

### 3.7 Correct Git remote verified before commit

**Confirmed.** The remote is `https://github.com/mayakilzy/repo-info.git` (documentation repository). No code is pushed to the code repository.

---

## 4. Updated Design-Lock Verdict

| Dimension | Verdict |
|---|---|
| Visual Design Readiness | ✅ PASS |
| Backend Contract Readiness | ✅ PASS |
| Implementation Handoff Specification | ✅ PASS |
| Repository Boundary | ✅ PASS |
| Open Verification Items | ✅ ALL CLOSED (10/10) |
| Frontend Implementation Authorization | 🛑 UNAUTHORIZED (pending separate authorization) |

**Overall: DESIGN LOCK COMPLETE — IMPLEMENTATION UNAUTHORIZED.**

---

## 5. Remaining Limitations (Unrelated to Design)

These limitations remain and are documented for the implementation team. They do NOT block the design lock:

- **G01**: Multi-tenant authentication NOT IMPLEMENTED (single-tenant demo mode).
- **G02**: Live LLM NOT TESTED (`is_mock=true` on every agent response).
- **G19**: Single-turn agent execution loop (no multi-turn conversation).
- **G30**: No WebSocket (polling required — OPEN-07 closed).
- **C-04**: Capability update unsupported (DELETE + re-POST only).
- **G28**: No audit log viewer API for AgentEvaluation / BacktestResult / FoundryCallRecord.
- **G15**: No cursor pagination (`limit` + `offset` only).
- **G14**: No API rate limiting.
- **G16**: SQLite "database is locked" under high concurrency.
- PDF export, sharing, document editing — NOT implemented (out of scope).
- Source Connector Framework — future backend mission.

---

## 6. Implementation Gate

**Frontend implementation remains UNAUTHORIZED until the owner issues a new mission explicitly authorizing it.**

This mission closes the design decisions. It does NOT authorize:
- Frontend implementation.
- Deployment.
- Changes to the approved visual direction.
- Backend code changes.
- Database migrations.
- New dependencies.

**The design lock is complete. The implementation awaits the owner's explicit authorization.**

---

## 7. Final Statement

All 10 owner-approved design decisions are recorded. All handoff documents are updated. The design is fully locked. The repository boundary is clean. The implementation gate is clearly stated.

**MANARA's UI design is ready. The implementation awaits the owner's word.**

— **GLM (Implementer), 2026-10-21**
