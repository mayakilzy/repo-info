# STR UI-01 — Home Dashboard Standalone Visual Reference v1.0

**Status: DRAFT — owner browser acceptance pending.** This is not an approved implementation-ready source yet.

## Source of truth
- Approved visual concept: `assets/approved-reference.png` (1536 × 1024)
- The original is a static mockup. No original HTML/CSS source was available; this reference was newly authored.
- The original mockup contains fictional counts, people, projects, and feed items. This standalone reference labels the entire view as demo and is NOT a source of production facts.

## Open
Open `index.html` directly in a browser (no build, backend, or network required). Alternatively run `python -m http.server 8080` from this directory and open `http://localhost:8080`.

## Structure
- `index.html`: real DOM elements, semantic sections and demo navigation.
- `styles.css`: dark design tokens, desktop/tablet/mobile layout, RTL and LTR.
- `script.js`: small locale demo toggle; no real application functions.
- `assets/`: approved source image and cropped decorative imagery.

## Important limitations
- Visual fidelity is **not yet verified by Playwright or owner**; do not call this Gate B PASS.
- The EN toggle translates the primary navigation and key headings, but full localization remains outstanding.
- Decorative image crops are sourced from the approved image; they may retain small rendered details.
- Stats, names, projects, lessons, AI controls and feed are **fictional placeholders**. No live API is connected.
- This file is a standalone reference, not Next.js/React production code.
- Font and glyph selection uses system fonts to remain offline; typography may differ from the reference.
- Accessibility and responsive layouts require browser QA.

## Handoff sequence
1. Publish this package to `repo-info/SyrianTechRenaissance/Platform/UI_UX_DESIGN/IMPLEMENTATION_READY/PAGE_01_HOME/` on a review branch.
2. Render at 1536 × 1024, 1440 × 900, 768 × 1024, and 390 × 844; capture Arabic and English.
3. Compare screenshot against the approved original at equivalent viewport. Record gaps and fix reference.
4. Obtain explicit owner approval (Gate B). Only then task GLM to integrate into the Next.js app (Gate C).
5. Do not publish this as complete or merge without authorization.
