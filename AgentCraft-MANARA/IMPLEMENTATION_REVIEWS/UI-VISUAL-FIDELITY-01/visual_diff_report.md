# MANARA UI-VISUAL-FIDELITY-01 — Visual Diff Report (BEFORE reconstruction)

**Mission ID:** `MANARA-UI-VISUAL-FIDELITY-01`
**Phase:** Phase 1 — Audit (before any reconstruction)
**Date:** 2026-10-22
**Method:** VLM (GLM-5V-Turbo) side-by-side comparison of approved references vs current implementation screenshots

---

## Executive Summary

The current implementation of Pages 01–03 **materially deviates** from the approved visual designs. The deviations are not subtle — they are structural simplifications that reduce data-rich analytical dashboards to sparse, generic card grids. Per `MANARA-UI-VISUAL-FIDELITY-01 §1`, the approved images are **binding specifications**, not inspiration. The current implementation does not meet this bar.

**Verdict: All three pages FAIL Gate A (Visual Fidelity). Reconstruction is required.**

---

## Page 01 — Investigation Home

**Approved reference:** `01_Home/a_wide_high_resolution_ui_website_app_dashboard_s.png` (APPROVED_VISUAL)
**Current screenshot:** `current/01_home_en_desktop_CURRENT.png`

### Material Differences (12 items)

| # | Difference | Severity | Owner-actionable? |
|---|---|---|---|
| 1 | Lighthouse hero: approved is photorealistic with knowledge-graph overlays (nodes, labels like "Reliable Sources"); actual is flat simplified vector, smaller, less rich | HIGH | Reconstruct hero artwork |
| 2 | Headline: approved uses elegant high-contrast serif; actual uses heavy geometric sans-serif. Word "discover" is teal in both but font family/weight differs | HIGH | Switch to Source Serif 4 (per design tokens) |
| 3 | Textarea: approved is clean single-line bar with inline placeholder; actual is large multi-line box with bold "RESEARCH QUESTION" header + subtext + Clear button + ⌘/Ctrl+Enter hint | HIGH | Redesign textarea per approved |
| 4 | Submit button: approved is solid dark teal with arrow icon; actual is flat, no arrow icon | MEDIUM | Add arrow icon, match color |
| 5 | 3-step workflow: approved has horizontal cards with large detailed icons in circles connected by arrows; actual has grey 01/02/03 numbers + simpler line icons, no connecting arrows | HIGH | Reconstruct with circular icons + arrows |
| 6 | Synthetic discovery: approved has large "A more transparent research process" card with mountain background + video play button; actual has "TRY AN EXAMPLE" text chips | HIGH | Replace chips with approved promo card |
| 7 | Sidebar: approved is LIGHT grey with descriptions per nav item; actual is DARK navy with "Coming Later" badges. Footer: approved has "Switch to Observatory" card; actual has "v0.1 UI Preview" | HIGH | Per OPEN-03, sidebar should be light (Studio default). Re-evaluate |
| 8 | Header: approved has centered logo, search bar, theme toggle, language dropdown with flags, notifications, user profile; actual has no search, no notifications, no profile (correct per OPEN-04 removal), simple EN/AR toggle | MEDIUM | Some removals are correct (OPEN-04). But search bar + flags may need restoration |
| 9 | Color palette: approved background is very light cool grey/off-white; actual is warmer beige/tan | MEDIUM | Match porcelain #F7F8F6 per design tokens |
| 10 | Spacing: approved is breathable editorial; actual is denser utilitarian | MEDIUM | Increase margins per approved |
| 11 | MISSING from actual: "Explore MANARA's capabilities" grid, "A more transparent research process" promo card, knowledge-graph overlay on lighthouse, "Learn more about MANARA" link | HIGH | Add these sections |
| 12 | ADDED in actual (not in approved): "TRY AN EXAMPLE" section with question chips, empty state "Type a question to begin..." | MEDIUM | Remove or replace with approved content |

### Gate A Verdict: ❌ FAIL — 12 material differences, 7 HIGH severity

---

## Page 02 — Investigation Workspace

**Approved reference:** `02_Investigation/a_clean_modern_ui_ux_dashboard_screenshot_for_a_r.png` (APPROVED_DIRECTION — Observatory Concept 02)
**Current screenshot:** `current/02_workspace_en_desktop_CURRENT.png`

### Material Differences (14 items)

| # | Difference | Severity | Owner-actionable? |
|---|---|---|---|
| 1 | Overall density: approved is 10x denser; actual is sparse 3-column grid with massive whitespace | HIGH | Full layout rebuild |
| 2 | Workflow stepper: approved is rich horizontal 7-step with Completed/In-Progress/Pending states + "Live View" toggle; actual is generic vertical list of ~15 technical states in dark card, no progress indication | HIGH | Reconstruct as horizontal stepper. NOTE: per OPEN-01 must use 13 FSM states, not 7. So approved's 7 is wrong, but actual's vertical list is also wrong — need horizontal 13-state with progress |
| 3 | Knowledge Graph: approved has STUNNING interactive celestial-themed graph with glowing nodes, edges, sub-task cards (Question Analysis, Knowledge Needs); actual is empty dark box with "No relationships recorded yet" | HIGH | Major reconstruction. Per OPEN-02 hybrid graph + list fallback |
| 4 | Investigation Overview + Key Insights panels (right sidebar): approved has Status/Template/Mode/Time estimates + color-coded badges ("3 identified", "Partial coverage", "2 critical gaps"); actual completely omits | HIGH | Build these analytical summary panels |
| 5 | Evidence & Claims panels: approved integrates into "Sources Being Explored" with arXiv/PubMed cards + progress bars; actual has two empty "Evidence (0)" / "Claims (0)" placeholder cards | HIGH | Reconstruct with real data + per-evidence metadata |
| 6 | Agent Sessions panel: approved implies via "Live View" + source acquisition status; actual has no agent visualization | HIGH | Build agent sessions panel |
| 7 | Audit Timeline: approved has "Transition History" log with rich context; actual has simplified version in left column | MEDIUM | Enrich audit timeline per OPEN-09 (filterable table) |
| 8 | Forecast/Publication integration: approved sidebar lists Foresight + Publications under "Knowledge & Analysis"; actual groups under "Factory"/"Studio" with "Coming Later" | MEDIUM | Sidebar restructuring |
| 9 | Dark Observatory surface: approved is deep blue/black with glowing cyan/orange nodes (specifically for graph area); actual is flat matte dark blue container for workflow list + empty graph box | HIGH | Reconstruct dark surface with glow effects |
| 10 | Research Question header: approved has prominent block with tags (AI & Robotics, Medical Devices) + metadata (ID: INV-2026-10-001); actual has simple H1 + UUID | HIGH | Build research question header block |
| 11 | Source Exploration: approved bottom has arXiv/PubMed/OpenAlex cards with logos + progress ("12 sources found"); actual has no equivalent | HIGH | Build source explorer section |
| 12 | Branding: approved header has lighthouse + "Scientific Intelligence Atelier" tagline + Studio/Observatory toggle; actual has generic "Adaptive Intelligence Factory" + standard language switcher | MEDIUM | Restore branding per approved |
| 13 | MISSING: Research Question editor, Tags, Investigation Overview stats, Key Insights cards, Source Explorer cards, Interactive Knowledge Graph, Pause/View Details controls, "Understanding MANARA" widget | HIGH | All these need to be built |
| 14 | DEVIATIONS: vertical state list replaces horizontal flow; empty placeholder replaces graph; empty Evidence/Claims shells replace data-rich cards; "Single-tenant demo mode" footer added (correct per OPEN-04) | HIGH | Replace deviations with approved compositions |

### Gate A Verdict: ❌ FAIL — 14 material differences, 12 HIGH severity

---

## Page 03 — Memory Explorer

**Approved references:**
- `03_Memory/a_wide_ui_ux_multi_panel_dashboard_mockup_for_a_re.png` (catalog view)
- `03_Memory/a_wide_high_resolution_infographic_style_ui_mocku.png` (claim examination)

**Current screenshot:** `current/03_memory_en_desktop_CURRENT_empty.png`

### Material Differences (15 items)

| # | Difference | Severity | Owner-actionable? |
|---|---|---|---|
| 1 | Overall layout: approved is multi-column "command center" with sidebar + central content + right Knowledge Graph panel; actual is sparse single-column with massive whitespace | HIGH | Full layout rebuild |
| 2 | Evidence List: approved has rich paginated list of 8+ items with icons, titles, authors, journals, bitemporal timestamps, relevance badges (High/Medium/Low), action buttons; actual has single empty "No evidence" card | HIGH | Build evidence list with all metadata |
| 3 | Evidence Detail View: approved expands to show Summary, Source Information (Type, Year, DOI), Source Quality (progress bars for Credibility/Methodology), Key Evidence snippets; actual has no detail view | HIGH | Build evidence detail expansion |
| 4 | Claim List: approved is filterable list/grid with verdict badges (Supports/Refutes/Qualifies) + counts; actual is single empty card with basic "All verdicts" dropdown | HIGH | Build claim list with verdict badges + filters |
| 5 | Claim Examination Split: approved has Supporting/Refuting/Qualifying columns (visible in "Contradictions & Debates" section); actual has no such split | HIGH | Build 3-column claim examination per OPEN-02 |
| 6 | Bitemporal Replay: approved integrates subtly (Timeline tab, Time Range filter); actual isolates in large dark "Replay" panel consuming excessive space | MEDIUM | Integrate per approved; per OPEN-10 must have date-time picker + Replay button (current has this but layout is wrong) |
| 7 | Audit Log Table: approved has structured table with columns/filters/pagination; actual has empty "Audit Log (0)" card with no headers | HIGH | Build filterable audit table per OPEN-09 |
| 8 | Knowledge Graph panel (right side): approved has force-directed graph of Topics/Sources/Claims + Node Details popup; actual completely lacks | HIGH | Build knowledge graph panel |
| 9 | Relationships & Edges: approved has visual lines + "Related Topics" list; actual lacks entirely | HIGH | Build relationships visualization |
| 10 | Analytics Widgets: approved bottom has "Contradictions & Debates" (conflict counts), "Timeline View" (dot-plot history), "Related Topics" (bar charts); actual has none | HIGH | Build analytics widgets |
| 11 | Search & Filter Bar: approved has prominent search + advanced filters (Time Range, Source Type, Evidence Type, Sort By); actual has no search | HIGH | Build search + filter bar (per owner directive: NO global explorer search — but in-memory evidence/claim filtering IS allowed) |
| 12 | Header Statistics: approved has "Sources in memory", "Key claims extracted" metrics; actual has minimal title + ID | MEDIUM | Add header statistics |
| 13 | Navigation Context: approved uses light sidebar with "Knowledge Explorer" context; actual uses dark "Factory" sidebar with "Coming Later" badges | MEDIUM | Per OPEN-03, sidebar should be light |
| 14 | Mobile Previews: approved shows iPhone + Arabic RTL previews at bottom; actual lacks | LOW | Out of scope for desktop screenshot |
| 15 | Color Palette: approved is clean white + teal/green accents + red for conflicts; actual is stark flat grey/white + heavy dark-blue replay block | MEDIUM | Match approved palette |

### Gate A Verdict: ❌ FAIL — 15 material differences, 12 HIGH severity

---

## Cross-Page Patterns

Three patterns repeat across all pages:

1. **Information density collapse**: approved designs show 8–15+ data points per region; actual shows 0–2. The current implementation treats "empty state" as the default, when approved designs show POPULATED states.
2. **Sidebar theme inversion**: approved sidebars are LIGHT (Studio default per OPEN-03); actual sidebars are DARK navy. This inverts the Studio/Observatory distinction.
3. **Analytical richness replaced with generic shells**: approved Knowledge Graphs are glowing interactive celestial visualizations; actual is empty placeholder. Approved Evidence panels show rich metadata; actual is empty card.

---

## Escalation Assessment (per §5)

Per `MANARA-UI-VISUAL-FIDELITY-01 §5`: "If recreating a visual composition accurately is difficult, identify the exact page, region, and unresolved design issue. Request a supervisor-provided HTML/CSS reference rather than inventing an alternative."

### Regions I can reconstruct from the approved image alone

| Page | Region | Confidence | Rationale |
|---|---|---|---|
| 01 | Headline typography | HIGH | Design tokens specify Source Serif 4 |
| 01 | Textarea redesign | HIGH | Image shows clear single-line bar |
| 01 | 3-step workflow horizontal cards | MEDIUM | Layout clear; icon details need VLM assist |
| 01 | Promo card for synthetic discovery | MEDIUM | Mountain background + play button visible |
| 02 | Research Question header block | HIGH | Tags + ID visible |
| 02 | Investigation Overview panel | HIGH | Status/Template/Mode/Time visible |
| 02 | Key Insights cards | HIGH | Color-coded badges visible |
| 02 | Source Explorer cards | MEDIUM | Logos + progress visible |
| 02 | Audit Timeline enrichment | HIGH | Per OPEN-09 spec |
| 03 | Evidence List with metadata | HIGH | 8+ items visible with all fields |
| 03 | Evidence Detail expansion | HIGH | Summary/Source Info/Quality bars visible |
| 03 | Claim List with verdict badges | HIGH | Per OPEN-02 + OPEN-09 |
| 03 | Claim Examination 3-column split | HIGH | Supporting/Refuting/Qualifying visible |
| 03 | Audit Log table | HIGH | Per OPEN-09 spec |
| 03 | Analytics widgets | MEDIUM | Contradictions/Timeline/Related Topics visible |

### Regions requiring HTML/CSS reference escalation

| Page | Region | Why escalation needed |
|---|---|---|
| 01 | Lighthouse hero artwork with knowledge-graph overlay | The approved image shows a photorealistic lighthouse with knowledge-graph nodes/labels overlaid. This is custom artwork, not a stock illustration. Cannot reconstruct from image alone — need SVG/HTML spec or owner-provided asset. |
| 02 | Knowledge Graph (celestial-themed interactive visualization) | The approved shows glowing nodes, edges, sub-task cards with starry background. This is a complex custom visualization. A faithful reproduction needs HTML/CSS/SVG reference for: node shapes, glow filter parameters, edge curve styles, background gradient, sub-task card placement, interactivity cues. |
| 03 | Knowledge Graph panel (force-directed) | Same as Page 02 — complex custom visualization. Need HTML/CSS/SVG reference. |
| 02 | Workflow stepper horizontal layout (13 FSM states) | The approved shows a 7-step horizontal stepper, but OPEN-01 mandates 13 states. Fitting 13 states horizontally with progress indication + grouping per OPEN-01 ("states may be visually grouped") needs a layout reference. |
| 03 | Bitemporal timeline integration | The approved shows timeline as integrated tab/filter; OPEN-10 mandates date-time picker + Replay button. The integration of these two requirements needs a layout reference. |

---

## Recommendation to Owner

Before I begin reconstruction, I need your guidance on §5 escalations. Specifically:

### Escalation 1: Lighthouse hero artwork (Page 01)

The approved lighthouse is **photorealistic with knowledge-graph overlay** (nodes, labels like "Reliable Sources", "Analysis and Synthesis"). This is custom artwork. Options:

- **(A)** Provide the original SVG/HTML for the lighthouse + overlay
- **(B)** Authorize me to use a high-quality SVG lighthouse (e.g., from Lucide or a custom illustration) + build the overlay as positioned labels
- **(C)** Authorize a simplified lighthouse without the overlay (deviates from approved — needs your sign-off)

### Escalation 2: Knowledge Graph visualizations (Pages 02, 03)

The approved graphs are **celestial-themed** with glowing nodes, curved edges, starry background, sub-task cards. Options:

- **(A)** Provide HTML/CSS/SVG reference for the exact visualization style (node radius, glow filter, edge stroke, colors, background)
- **(B)** Authorize me to use a force-directed graph library (e.g., d3-force, react-force-graph, vis-network) configured to match the approved aesthetic as closely as possible
- **(C)** Authorize a simpler graph style (still interactive, still real-data, but less ornate)

### Escalation 3: 13-state horizontal workflow stepper (Page 02)

OPEN-01 mandates 13 states, but approved shows 7. Fitting 13 horizontally needs grouping. Options:

- **(A)** Provide HTML/CSS reference for the grouped horizontal stepper layout
- **(B)** Authorize me to group the 13 states into 4–5 phases (e.g., "Discovery" = received+scoped+coverage_checked; "Build" = building_capabilities+mold_ready; "Acquire" = acquiring+normalizing+evidencing; "Synthesize" = forecasting_or_scenarios+drafting+verification; "Deliver" = deliverable_ready+archived) with all 13 states visible as sub-items

### Escalation 4: Sidebar theme (cross-cutting)

The approved sidebars are LIGHT; actual is DARK. Per OPEN-03, Studio (light) is the default. But the current sidebar was implemented dark in UI-01 and "preserved" per owner directive. Options:

- **(A)** Restore LIGHT sidebar per approved (matches OPEN-03 default)
- **(B)** Keep DARK sidebar (deviates from approved — needs your sign-off)

---

## Next Steps

**I will NOT begin reconstruction until you respond to the 4 escalations above.**

Per `MANARA-UI-VISUAL-FIDELITY-01 §5`: "Do not independently approve a materially different layout."

Once you respond, I will:
1. Implement Page 01 reconstruction
2. Implement Page 02 reconstruction
3. Implement Page 03 reconstruction
4. Capture AFTER screenshots
5. Produce side-by-side AFTER diff
6. Run all 4 acceptance gates
7. Publish to both repos per MANARA-DELIVERY-POLICY-01

---

## References

- Approved images: `approved_references/` folder
- Current screenshots: `current/` folder
- Handoff documents: `UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/`
- Owner decisions: `07_FINAL_OWNER_DECISIONS_AND_IMPLEMENTATION_GATE.md` (OPEN-01 through OPEN-10)
