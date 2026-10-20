# MANARA — Final Visual Asset Manifest

> **Document type.** Authoritative manifest of all 22 approved visual assets.
> **Date.** 2026-10-21.
> **Source.** 5 ZIP archives uploaded by the owner to `repo-info/AgentCraft-MANARA/UI_UX_DESIGN/APPROVED_VISUAL_ASSETS/`.
> **Verification.** All 22 images SHA-256 verified against `VISUAL_ASSET_MANIFEST.json`. All 22 images VLM-inspected.

---

## 1. Verification Summary

| Metric | Value |
|---|---|
| Total assets in manifest | **22** |
| SHA-256 verified | **22 / 22** (100%) |
| VLM-inspected | **22 / 22** (100%) |
| Missing files | 0 |
| SHA-256 mismatches | 0 |
| Total size | ~35 MB across 5 ZIP archives |

---

## 2. Classification Scheme

| Classification | Meaning | Count |
|---|---|---|
| **APPROVED_VISUAL** | The owner has explicitly approved this visual as the primary reference. Implement faithfully (with element-level removals per the reconciliation). | **4** |
| **APPROVED_DIRECTION** | The owner has approved the overall direction. Use as aesthetic + compositional reference; specific elements may need removal/replacement. | **8** |
| **SUPPORTING_ONLY** | Supporting reference for states, layouts, or concepts. Do not treat as primary; extract only the approved design cues. | **9** |
| **FUTURE_DESIGN** | Depicts a future enhancement NOT implemented in the current backend. Do NOT implement as active functionality; reserve for backlog. | **1** |

---

## 3. The 22 Visual Assets

### 3.1 Page 01 — Investigation Home

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 1 | `a_wide_high_resolution_ui_website_app_dashboard_s.png` | **APPROVED_VISUAL** | `1f7f2d2f00da24ac` | 1536×1024 | 1758 KB | Home Concept 01. Lighthouse hero on rocky cliff. Left sidebar (Home, Investigations, Memory Explorer, Foresight, Publications, Capability Registry, Source Foundry, Template Factory, Agent Registry). Hero: "What do you want to discover today?" + research question input (0/1000 chars) + "Start Investigation" button. 3-step workflow explanation. **REMOVE:** user profile avatar, global search, language selector with extra languages, sun/moon toggle. |

### 3.2 Page 02 — Investigation Workspace

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 2 | `a_clean_modern_ui_ux_dashboard_screenshot_for_a_r.png` | **APPROVED_DIRECTION** | `dd38aac0c4bd6f07` | 1536×1024 | 1629 KB | Investigation Observatory Concept 02. Dark analytical surface. Workflow stepper (must use 13 actual FSM states, not the 7 shown). Evidence panels, agent sessions, forecast + publication integration. **VERIFY:** workflow state read method (GET confirmed in CLOSURE-01). |
| 3 | `a_wide_detailed_ui_ux_concept_board_for_a_researc.png` | SUPPORTING_ONLY | `e1a56df916ee9222` | 1536×1024 | 1598 KB | States and coverage visual references. Illustrative data only. |
| 4 | `a_wide_clean_high_resolution_ui_ux_design_showca.png` | SUPPORTING_ONLY | `e09797e8362b7fe5` | 1536×1024 | 1761 KB | Knowledge graph and evidence states. No fabricated nodes — only render API-backed edges. |

### 3.3 Page 03 — Memory Explorer

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 5 | `a_wide_ui_ux_multi_panel_dashboard_mockup_for_a_re.png` | **APPROVED_DIRECTION** | `63ec326cac722de7` | 1536×1024 | 1732 KB | Memory Explorer catalog + bilingual reference. Evidence list, claim verdicts, bitemporal timestamps. |
| 6 | `a_wide_high_resolution_infographic_style_ui_mocku.png` | **APPROVED_DIRECTION** | `33fe701f6cfb751f` | 1536×1024 | 1870 KB | Claim Examination split: supporting / refuting / qualifying evidence columns. Bitemporal timeline. **KEY:** this is the visual reference for the Knowledge Graph read path (R-01 closed in CLOSURE-01). |

### 3.4 Page 04 — Capability Registry

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 7 | `a_wide_detailed_ui_dashboard_mockup_screenshot_of.png` | **APPROVED_DIRECTION** | `2928f2b4f9a77195` | 1536×1024 | 1785 KB | Capability Registry Concept 01. Card catalog with status badges (candidate/approved/rejected). Domain filters, semantic search, coverage matrix. **REMOVE:** fictitious agents, stats, connectors. **VERIFY:** relationship graph uses only `GET /registry/capabilities/{id}/relationships` data. |

### 3.5 Page 05 — Source Foundry

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 8 | `a_wide_clean_modern_dashboard_ui_mockup_image_fo.png` | **APPROVED_DIRECTION** | `c2ac8cf8e4cf8e4d` | 1536×1024 | 1694 KB | Source Foundry Concept 01. Candidate list: OpenAlex (assessable), Crossref + arXiv (PLANNED badge, sandbox test disabled). License, rights, allowed hosts metadata. |
| 9 | `a_wide_clean_modern_ui_dashboard_mockup_in_a_hig.png` | SUPPORTING_ONLY | `d2531922511fd29b` | 1536×1024 | 1733 KB | Source lifecycle design cues. Do not treat extra sources as live. |
| 10 | `wide_detailed_ui_ux_dashboard_screenshot_of_an_app.png` | **FUTURE_DESIGN** | `dfa30fe8bc304f9d` | 1536×1024 | 1672 KB | Adding paid/API/institutional research sources. **DO NOT IMPLEMENT** — backend enhancement (Source Connector Framework). Reserve for backlog only. |

### 3.6 Page 06 — Mold Factory

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 11 | `mold_factory_blueprint_dashboard.png` | **APPROVED_VISUAL** | `0f10476ef69c9a6a` | 1672×941 | 1656 KB | **Mold Factory Concept 02 — owner prefers this.** Prominent dark-blue Mold Recipe Blueprint panel. 3-column flow: Research Needs → Selected Capabilities → Coverage Status (VERIFIED/OPERATIONAL/CATALOG/NONE color-coded). Gap analysis table below. Mold metadata header (ID, name, domain, version, state, last piloted). **VERIFY:** blueprint data comes from `composition_result` (FIX-01 closed in CLOSURE-02). **REMOVE:** "PLANNING" workflow state (not in 13 FSM states), fictitious capability IDs. |
| 12 | `mold_factory_dashboard_interface.png` | SUPPORTING_ONLY | `ec5172b3e9feee2d` | 1672×941 | 1682 KB | Mold Library Concept 01 auxiliary. Card list of saved molds. |

### 3.7 Page 07 — Agent Registry

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 13 | `wide_detailed_ui_screenshot_of_a_web_application.png` | **APPROVED_DIRECTION** | `227df7bf9cc0d900` | 1536×1024 | 1636 KB | Agent Registry Concept 02. Recipe cards + detail view. Session log with `is_mock` banner, `granted_tools`, `tool_invocations` (R-02 closed in CLOSURE-01). **REMOVE:** editing controls, clone, promote button (R-09: endpoint not implemented). |
| 14 | `a_wide_clean_modern_ui_dashboard_screenshot_mo.png` | SUPPORTING_ONLY | `0a6d2a9ba22eb8b3` | 1536×1024 | 2029 KB | Agent relationships Observatory concept. No invented links. |

### 3.8 Page 08 — Foresight

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 15 | `a_wide_high_resolution_ui_dashboard_screenshot_in.png` | **APPROVED_DIRECTION** | `8398d1170abb1b9e` | 1536×1024 | 1661 KB | Foresight Concept 01 Observatory. Forecast creation, publish, revise. Backtest results with MAE/RMSE/baseline. **KEY:** `method=insufficient_evidence` must hide probability chart (R-03 closed in CLOSURE-01). `probability_distribution` now returned by API. |
| 16 | `a_detailed_wide_high_resolution_ui_dashboard_scr.png` | **APPROVED_DIRECTION** | `69ac15b103d8d6fb` | 1536×1024 | 1617 KB | Foresight Concept 02 organization. Scenario charts illustrative only. **VERIFY:** forecast list now available (R-06 closed in CLOSURE-01). Backtest history with failed attempts now persisted (FIX-03 closed in CLOSURE-02). |

### 3.9 Page 09 — Publishing Studio

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 17 | `a_wide_high_resolution_ui_dashboard_screenshot_c.png` | **APPROVED_VISUAL** | `12f5135e7481ddc9` | 1536×1024 | 1764 KB | **Publishing Concept 02 — dark status sidebar.** Quality gate checklist (5 rules), publication metadata, evidence sources, related outputs. Download dropdown: Markdown/JSON/Text enabled; PDF/HTML greyed out (correct — not implemented). Coverage blocker report card. **REMOVE:** share link (not implemented). **VERIFY:** quality gate read from `GET /publishing/publications/{id}` (R-09: standalone endpoint not implemented). |
| 18 | `a_wide_polished_ui_dashboard_screenshot_of_a_rese.png` | **APPROVED_VISUAL** | `053e56e4d88ad756` | 1536×1024 | 1637 KB | **Publishing Reader Concept 01 — selected companion.** Document viewer with tabs (Read, Presenter Edition, Visual Storyboard, Details, Versions). Evidence chain sidebar. Download: Markdown/JSON/Text + Share Link. **REMOVE:** share link, versions tab (not implemented). **VERIFY:** `downloadable` flag gates the download buttons. |

### 3.10 Page 10 — Design System

| # | Filename | Classification | SHA-256 (first 16) | Dimensions | Size | VLM-verified content |
|---|---|---|---|---|---|---|
| 19 | `a_clean_high_resolution_multi_panel_ui_style_gui.png` | SUPPORTING_ONLY | `5962f02b1dc6d400` | 1536×1024 | 1657 KB | Design system reference. Retain original lighthouse + navy/teal/gold palette. Color swatches, typography, component library. |
| 20 | `a_clean_detailed_ui_ux_design_presentation_poster.png` | SUPPORTING_ONLY | `64fde410f2ae4313` | 1536×1024 | 1737 KB | Responsive/LTR-RTL general direction. Desktop/tablet/mobile breakpoints. |
| 21 | `a_wide_polished_multi_panel_ui_ux_showcase_image.png` | SUPPORTING_ONLY | `2ebd21aa13c72a84` | 1536×1024 | 1750 KB | Mobile investigation / tablet molds / Arabic memory reference. **CORRECT:** misleading elements (e.g. extra sources, fabricated data). |
| 22 | `a_wide_clean_ui_design_system_infographic_dashboa.png` | **APPROVED_DIRECTION** | `ce153cecbe4b3971` | 1536×1024 | 1735 KB | States feedback handling concept. Loading/empty/error/partial/mock/complete state examples. |

---

## 4. SHA-256 Verification Evidence

All 22 images were SHA-256 verified against the `VISUAL_ASSET_MANIFEST.json` provided in `MANARA_01_Documents.zip`. The verification script:

```python
import json, hashlib
from pathlib import Path

manifest = json.loads(Path("VISUAL_ASSET_MANIFEST.json").read_text())
for asset in manifest:
    # ... locate the file in the extracted ZIP structure ...
    actual_sha = hashlib.sha256(file_path.read_bytes()).hexdigest()
    assert actual_sha == asset["sha256"], f"MISMATCH: {asset['path']}"
```

**Result: 22/22 verified, 0 mismatches, 0 missing.**

---

## 5. VLM Inspection Evidence

All 22 images were inspected using the `z-ai vision` CLI (model: `glm-5v-turbo`). The VLM provided detailed descriptions of:
- Overall layout and color scheme.
- Major sections and panels.
- Text labels and navigation items.
- Interactive elements.
- Elements that must be removed (per the visual-functional reconciliation).

The VLM descriptions were cross-referenced against:
- The `MANARA_VISUAL_FUNCTIONAL_RECONCILIATION_v1.md` classifications.
- The `MANARA_COMPONENT_API_BINDING_CLOSURE_v1.md` per-page binding.
- The backend API at SHA `6efac89`.

**Result: 22/22 VLM-inspected.** The VLM confirmed the visual content matches the manifest descriptions and identified the elements requiring removal/replacement.

---

## 6. Asset Classification Roll-up

| Page | APPROVED_VISUAL | APPROVED_DIRECTION | SUPPORTING_ONLY | FUTURE_DESIGN | Total |
|---|---|---|---|---|---|
| 01 Home | 1 | 0 | 0 | 0 | 1 |
| 02 Investigation | 0 | 1 | 2 | 0 | 3 |
| 03 Memory | 0 | 2 | 0 | 0 | 2 |
| 04 Capabilities | 0 | 1 | 0 | 0 | 1 |
| 05 Foundry | 0 | 1 | 1 | 1 | 3 |
| 06 Molds | 1 | 0 | 1 | 0 | 2 |
| 07 Agents | 0 | 1 | 1 | 0 | 2 |
| 08 Foresight | 0 | 2 | 0 | 0 | 2 |
| 09 Publishing | 2 | 0 | 0 | 0 | 2 |
| 10 System | 0 | 1 | 3 | 0 | 4 |
| **Total** | **4** | **9** | **8** | **1** | **22** |

---

## 7. Cross-Reference to Source Manifests

This final manifest supersedes the following source manifests for the purposes of UI implementation:

- `MANARA_01_Documents/VISUAL_ASSET_MANIFEST.md` (v1.0)
- `MANARA_01_Documents/VISUAL_ASSET_MANIFEST.json` (v1.0)

The source manifests remain the historical record. This final manifest adds:
- SHA-256 verification evidence.
- VLM inspection evidence.
- Cross-reference to the backend API at SHA `6efac89`.
- Updated classifications based on the CLOSURE-01 + CLOSURE-02 backend changes.

---

## 8. Preservation Directives

The following are **non-negotiable preservation directives** from the owner:

1. **Original lighthouse identity** — preserve the lighthouse logo + hero artwork from Home Concept 01. Do not replace with a different mark.
2. **Mold Factory Concept 02** — the dark-blue blueprint panel is the owner's preferred design. Implement this concept, not Concept 01.
3. **Publishing Concept 02 + Reader Concept 01** — both are approved; Concept 02 for the studio view, Concept 01 for the reader view.
4. **Modern Knowledge Studio + Intelligence Observatory** — the dual-theme system (light primary, dark analytical surfaces) is approved.
5. **English default LTR, Arabic optional RTL** — supersedes the foundation's browser-locale suggestion.

These directives MUST be respected by the implementation team. No visual change to these elements is authorized without explicit owner approval.
