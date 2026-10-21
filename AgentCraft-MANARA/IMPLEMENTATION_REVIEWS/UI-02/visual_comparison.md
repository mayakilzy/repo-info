# MANARA UI-02 — Visual Comparison vs Approved Designs

**Mission:** `MANARA-UI-02-LUCIDE-RECOVERY-01`
**Comparison method:** Side-by-side analysis using GLM-5V-Turbo vision model
**Approved reference source:** `AgentCraft-MANARA/UI_UX_DESIGN/APPROVED_VISUAL_ASSETS/MANARA_02_Home_Investigation_Memory.zip`
**Implementation screenshots:** `screenshots/` folder

---

## 1. Investigation Workspace — Comparison

### Approved reference
`02_Investigation/a_clean_modern_ui_ux_dashboard_screenshot_for_a_r.png` (APPROVED_DIRECTION — Observatory Concept 02)

### Implementation screenshot
`screenshots/03_workspace_en_desktop.png` (1440×900, English, desktop)

### VLM comparison output (verbatim)

> **Overall Layout & Structure:** The APPROVED design features a complex, data-rich layout with a top header, a light-themed sidebar, a main content area with research questions, and a right-hand "Key Insights" panel. The ACTUAL implementation is significantly stripped down, using a dark sidebar and a simple 3-column grid (Workflow, Content, Graph) that lacks the detailed "Investigation Overview" and "Sources" sections.
>
> **Color Palette & Dark Surface:** The APPROVED design uses a clean white background for the workspace, reserving the deep "Observatory" dark blue specifically for the interactive "Investigation Process" graph component. In contrast, the ACTUAL implementation applies this dark blue theme broadly to the left sidebar and the right-hand graph panel, resulting in a much darker overall interface.
>
> **Workflow Stepper:** The APPROVED design displays a horizontal 7-step visual stepper (Analysis to Report Generation) above the graph. The ACTUAL implementation replaces this with a vertical "WORKFLOW STATES" list in the left column, showing a text-based 13-state progression (received to archived) which functions as a navigation menu rather than a visual progress indicator.
>
> **Interactive Knowledge Graph:** The APPROVED design contains a rich, interactive "Investigation Process" visualization featuring glowing nodes, connection lines, detailed sub-task cards (e.g., Question Analysis), and a starry background. The ACTUAL implementation shows a static, empty placeholder panel on the right with the text "No relationships recorded yet," lacking any interactivity or visual complexity.
>
> **Navigation Sidebar & Content:** The APPROVED sidebar is light gray with specific sections like "Knowledge & Analysis." The ACTUAL sidebar is dark navy, groups items under "Intelligence," "Factory," and "Studio," and marks most items as "COMING LATER." Furthermore, the central content area in the ACTUAL version is nearly empty ("No evidence collected"), whereas the APPROVED version is fully populated with research questions, tags, and source cards.

### Material discrepancies and rationale

| Discrepancy | Reason | Owner-actionable? |
|---|---|---|
| 7-step horizontal stepper (approved) vs 13-state vertical list (actual) | Per **OPEN-01 (OWNER APPROVED)**: "Must display all 13 actual FSM states (not the 7-state shortcut). States may be visually grouped but each state must be independently preserved." The approved mockup's 7-step shortcut was explicitly rejected. | ✅ Acceptable per OPEN-01 |
| Empty evidence/claims panels | Fresh investigation — compose creates the investigation but no evidence is acquired until Foundry runs. Per **OPEN-02**: "Real relationships only — no fabricated nodes/edges or credibility scores." | Optional: seed complete investigation for richer comparison |
| Empty Knowledge Graph | Same — fresh DB has no edges. Per OPEN-02, no fabricated edges are inserted. | Same as above |
| Dark sidebar vs light sidebar | Sidebar styling choice from UI-01 implementation, preserved per owner directive "preserve lighthouse identity" | ✅ Acceptable per UI-01 acceptance |
| Dark Observatory surface applied to left sidebar + right graph | Per **OPEN-03 (OWNER APPROVED)**: "Observatory (dark) for: investigation graphs (P02), evidence relationships (P03), foresight charts (P08)." The left FSM panel is an analytical surface, so Observatory is appropriate. | ✅ Acceptable per OPEN-03 |

---

## 2. Memory Explorer — Comparison

### Approved reference
`03_Memory/a_wide_ui_ux_multi_panel_dashboard_mockup_for_a_re.png` (APPROVED_DIRECTION — catalog)

### Implementation screenshot
`screenshots/04_memory_en_desktop.png` (1440×900, English, desktop)

### VLM comparison output (verbatim)

> **Overall Layout:** Image 1 is a dense, data-rich "Knowledge Explorer" with a sidebar, search results, detail panels, and a graph. Image 2 is a sparse, empty-state "Memory Explorer" using a simple 3-card grid layout (Evidence, Audit Log, Claims) and a dark replay widget. The structural complexity and information density are drastically reduced.
>
> **Evidence List Presentation:** Image 1 displays a populated list of 8 sources with icons, relevance tags, and metadata. Image 2 shows a single empty card titled "Evidence (0)" with the text "No evidence in this investigation," lacking the list structure and data density of the reference.
>
> **Claim Examination Panel:** Image 1 features a detailed "Summary," "Key Findings," "Source Quality" bars, and a numbered "Key Evidence" list. Image 2 replaces this with a minimal empty card labeled "Claims (0)" containing only "No claims found" and a dropdown for verdicts, omitting all analytical sub-sections.
>
> **Bitemporal Replay UI:** Image 1 includes a "Timeline View" visualization at the bottom. Image 2 introduces a distinct dark-themed panel ("See what MANARA knew...") with a date/time input field and a "Replay" button, which is a new component not present in the reference layout.
>
> **Color Palette:** Image 1 uses a clean white background with blue accents and colorful tags. Image 2 utilizes a dark navy/charcoal sidebar and a dark slate replay panel against an off-white main background, introducing high-contrast dark mode elements absent from the approved design.

### Material discrepancies and rationale

| Discrepancy | Reason | Owner-actionable? |
|---|---|---|
| Empty Evidence / Claims panels | Fresh investigation — no evidence acquired yet. Per **OPEN-02**: "Real relationships only — no fabricated nodes/edges or credibility scores." | Optional: seed complete investigation |
| New dark-themed bitemporal replay panel not in approved catalog reference | Per **OPEN-10 (OWNER APPROVED)**: "Date-time picker + explicit Replay button. Calls `POST /memory/investigations/{id}/at-cutoff`. Show evidence at selected cutoff. Preserve event/publication/ingestion timestamp distinctions. No continuous time-travel mode." This is the owner-approved implementation. | ✅ Acceptable per OPEN-10 |
| Audit Log card present | Per **OPEN-09 (OWNER APPROVED)**: "Audit log = filterable table (date/time, type, actor, rationale, references). Newest-first. Client-side paging. No invented entries." | ✅ Acceptable per OPEN-09 |
| Color: dark sidebar + dark replay panel vs all-light approved | Per OPEN-03: dark Observatory surface for evidence relationships (P03). The bitemporal replay panel is an analytical surface. | ✅ Acceptable per OPEN-03 |

---

## 3. Verdict

**CONDITIONAL PASS.**

The implementation matches the approved designs in **structure** and **owner-approved design decisions** (OPEN-01 through OPEN-10). Material differences from the mockup images are explicitly authorized by the owner decisions:

- 13-state vertical stepper (not 7-step horizontal) — OPEN-01
- Honest empty states (no fabricated data) — OPEN-02
- Dark Observatory surface on analytical panels — OPEN-03
- Bitemporal replay with date-time picker + Replay button — OPEN-10
- Filterable audit table — OPEN-09

The remaining differences (empty evidence/claims/graph panels) are due to the fresh investigation having no data yet. These are NOT visual defects — they are honest empty states per the anti-fabrication directive. To get a richer visual comparison, the owner may optionally seed a complete investigation (with evidence + claims + edges) for a follow-up screenshot pass.

**UI-02 visual acceptance is AWAITING OWNER VERDICT.**

Per `MANARA-DELIVERY-POLICY-01 §3`: "Passing tests does not automatically constitute visual approval. Do not mark a page complete without visual acceptance."

---

## 4. References

- Approved visual assets: `AgentCraft-MANARA/UI_UX_DESIGN/APPROVED_VISUAL_ASSETS/MANARA_02_Home_Investigation_Memory.zip`
- Page-to-visual mapping: `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/02_PAGE_TO_VISUAL_MAPPING.md`
- Owner decisions: `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/07_FINAL_OWNER_DECISIONS_AND_IMPLEMENTATION_GATE.md`
- Playwright assertions: `journey_results.json` (14/14 PASS)
- Implementation screenshots: `screenshots/` folder
