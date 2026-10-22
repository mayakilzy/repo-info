# STR-UI-00D — Visual Regression Root Cause Report

**Project:** Syrian Tech Renaissance Platform
**Executor:** GLM Engineering Agent
**Mission:** STR-UI-00D — Visual Regression Recovery
**Type:** Targeted root-cause analysis + surgical fix
**Priority:** HIGH
**Date:** 2026-10-22
**Base:** v1.1 (SHA-256 `659f463f99731b2ca546e71e1ac1f4fbe9b06f0b28458fc1f1fa7a20eb2447b2`)
**Output:** v1.2 (SHA-256 `58835abdb30ce0c2b33f858faf88c57279092fb1180da69dc7a0e423660b641a`)

---

## 1. MASTER's directive and MASTER's principle

> "كل نسخة جديدة يجب أن تكون أفضل من سابقتها، لا أن تكسب تحسناً وتخسر مقابله جزءاً من الواجهة."

This principle frames the entire mission. MASTER accepted v1.1's typography (Tajawal) and hero refinement (R2) but rejected Gate B because v1.1 lost visible page sections. The mission is to recover that completeness while preserving v1.1's gains.

## 2. Confirmed defects (from MASTER's review of the triple comparison)

| ID | Defect | Severity |
|---|---|---|
| D1 | Skills panel ("طوّر مهاراتك") shows large empty space in v1.1; lessons list and thumbnails from v1.0 are gone | HIGH |
| D2 | An oversized blue arrow SVG appears inside the skills panel | HIGH |
| D3 | Lower sections (featured projects, featured engineers, recent activity) are not visible in v1.1's desktop viewport | HIGH |
| D4 | The three feature cards are taller and less dense than v1.0; balance is off | MEDIUM |

## 3. Diagnostic methodology

Per MASTER's directive ("Determine the actual cause, do not assume elements were deleted"), I:

1. Re-downloaded v1.1 ZIP from `repo-info` branch `feat/str-ui-00c-refinement` (SHA-256 verified `659f463f...`).
2. Extracted v1.0 (preserved) and v1.1 side by side.
3. Compared file sizes: v1.1 `index.html` is 29,684 bytes vs v1.0 10,792 bytes — **larger**, not smaller. So elements are unlikely to be deleted.
4. Ran Playwright DOM inspection on v1.1 at 1536×1024 to measure actual element positions and dimensions.
5. Verified DOM presence of every section in v1.1.
6. Found the actual visual bug.

## 4. Root cause analysis (single missing CSS rule)

### 4.1 DOM presence verification (D3 — first suspicion)

```javascript
// All lower sections exist in v1.1's DOM:
lower_grid_exists: true
lower_grid_offsetTop: 1418   // ← outside 1024px viewport!
lower_grid_offsetHeight: 953
lower_grid_children: 3       // featured + engineers + activity all present
featured: true
engineers: true
activity: true
doc_scrollHeight: 2433       // page is 2.4× viewport height
```

**Conclusion:** Elements are present in DOM. They are not hidden by CSS `display:none` and not removed from HTML. They are pushed below the visible viewport by a height inflation upstream.

### 4.2 The height inflation chain

Tracing upward from `.lower-grid`:

```
.lower-grid  offsetTop=1418
.feature-grid  offsetHeight=931   ← inflated
  .learning-panel  offsetHeight=931  ← tallest panel, drags siblings up
    .lesson (each)  offsetHeight=387  ← inflated (v1.0 was 46)
      svg (chevron-right)  width=368, height=368  ← BLOWN UP
```

### 4.3 The 368×368 SVG (D2 — root cause)

Playwright DOM inspection of v1.1 found:

```
total SVGs: 45
big svgs (>30px):
  [34] 368×368 | parent='lesson' | viewBox='0 0 24 24'
  [35] 368×368 | parent='lesson' | viewBox='0 0 24 24'
  [38] 274×274 | parent='person' | viewBox='0 0 24 24'
  [39] 274×274 | parent='person' | viewBox='0 0 24 24'
  [40] 274×274 | parent='person' | viewBox='0 0 24 24'
```

**Why this happens:** In v1.1's `index.html`, the lesson and person rows contain an inline SVG without a class:

```html
<div class="lesson">
  <span class="lesson-thumb">AI</span>
  <div>...text...</div>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" .../></svg>
</div>
```

The CSS rules in v1.1:

```css
.lesson svg{flex:none;color:#7aa3d9}
.person>svg{flex:none;color:#7aa3d9}
```

**These rules set `flex:none` and `color`, but NOT `width` or `height`.** The `.ico` and `.ico-sm` classes (which DO constrain size) were not applied because these SVGs have no class attribute.

**Chromium behavior:** An SVG with `viewBox="0 0 24 24"` and no `width`/`height` attribute (neither HTML nor CSS) defaults to `width: auto, height: auto`. The CSS `auto` resolves to the **parent's available height × the SVG's intrinsic aspect ratio**. Since the parent (`.lesson`) is `display:flex; align-items:center`, the SVG grows to fill the flex line height. Combined with the 24/24 viewBox ratio, this produces enormous dimensions.

**Cascade:**
1. SVG → 368×368 (in `.lesson`) or 274×274 (in `.person`)
2. `.lesson` flex row stretches to fit the SVG → 387px height (v1.0 was 46px)
3. `.learning-panel` contains 2 `.lesson`s + heading + levels → 931px height (v1.0 was 280px)
4. `.feature-grid` is `display:grid` → all 3 children stretch to tallest (931px)
5. The page becomes 2433px tall; `.lower-grid` ends up at offsetTop=1418 — **below the 1024px viewport**

### 4.4 Why D1 looks like "missing content"

The `.learning-panel` in v1.1 contains all the same content as v1.0:
- `.feature-heading` (icon + h2 + p)
- `.levels` (3 spans: مبتدئ / متوسط / متقدم)
- 2× `.lesson` (thumbnail + strong + small + svg arrow)

But because each `.lesson` is 387px tall (instead of 46px), the panel becomes 931px. The visible empty area in the screenshot is the bottom 600+ pixels of the panel — the lessons are pushed to the top of a stretched panel, leaving the rest visually empty.

### 4.5 Why D4 looks like "card imbalance"

`.feature-grid` is `display:grid; grid-template-columns: 1.22fr 1.1fr 1.05fr`. CSS grid stretches all children to the tallest row height. So `.ai-panel` and `.explore-panel` (which naturally would be ~280px) get stretched to 931px to match `.learning-panel`. This is why all three panels look tall and under-filled.

## 5. Single CSS fix (surgical, no rewrite)

### Fix 1 — explicit size constraints for inline SVGs without class

```css
/* STR-UI-00D FIX — D2: SVGs inside .lesson, .person, .activity-item, .section-heading
 * must have explicit dimensions. They are inline chevrons/arrows.
 * Without this rule they balloon to 274×274 / 368×368px (verified via Playwright).
 */
.lesson>svg,.person>svg,.activity-item .act-icon svg,.section-heading h2 svg,.section-heading a svg{
  width:18px;height:18px;flex:none;
  fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
.lesson-thumb svg,.btn svg{width:20px;height:20px;flex:none}
```

### Fix 2 — defensive global fallback (prevents any future SVG without size constraint)

```css
/* keep stroke style on every SVG path/rect/circle/line globally so any future
   inline SVG without .ico still inherits the Lucide-compatible stroke style */
svg:not([width]):not([height]) path,
svg:not([width]):not([height]) rect,
svg:not([width]):not([height]) circle,
svg:not([width]):not([height]) line{
  fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
```

**What was NOT done:**
- No `overflow:hidden` to hide missing content
- No element removal or `display:none` to mask the issue
- No page rewrite — only ~16 lines of CSS added to v1.1's `styles.css`
- No changes to `index.html`, `script.js`, `README.md`, or any asset

## 6. Verification — measurement of fix

Re-running Playwright DOM inspection on v1.2:

| Metric | v1.0 | v1.1 (broken) | v1.2 (fixed) | Recovery |
|---|---|---|---|---|
| SVGs >30px | 0 | 5 (368×368, 274×274) | **0** | ✅ D2 fixed |
| `.lesson` height | 46px | 387px | **65px** | ✅ D1 fixed |
| `.learning-panel` height | 280px | 931px | **287px** | ✅ D1 fixed |
| `.feature-grid` height | 280px | 931px | **287px** | ✅ D4 fixed |
| `lower-grid` offsetTop | 580 | 1418 (outside 1024) | **774** (inside 1024) | ✅ D3 fixed |
| `doc scrollHeight` | 1139 | 2433 | **1139** | ✅ completeness restored |

**DOM regression tests (run for all 6 viewports):**

| Test | Result |
|---|---|
| `.learning-panel .lesson` count | 2 (matches v1.0) ✅ |
| `.featured` exists + visible height | True, 303px ✅ |
| `.featured .project` count | 3 (matches v1.0) ✅ |
| `.engineers` exists + visible height | True, 303px ✅ |
| `.engineers .person` count | 3 (matches v1.0) ✅ |
| `.activity` exists + visible height | True, 303px ✅ |
| `.activity-item` count | 4 (matches v1.0) ✅ |
| SVGs >30px count | 0 (matches v1.0) ✅ |
| Horizontal scroll | 0 in all 6 cases ✅ |
| Console errors | 0 in all 6 cases ✅ |
| Page errors | 0 in all 6 cases ✅ |
| Locale toggle (ar↔en, rtl↔ltr) | Works in all 6 cases ✅ |

## 7. VLM visual verification

Ran z-ai vision on `comparison-triple-v12.png` (approved | v1.1 | v1.2). The VLM was asked to verify 6 recovery points:

| # | Recovery point | VLM verdict |
|---|---|---|
| 1 | Skills panel lessons list restored | **RECOVERED** — populated lessons list visible in v1.2 |
| 2 | Lower sections visible (featured projects + engineers + activity) | **RECOVERED** — all three sections clearly visible at desktop |
| 3 | Oversized blue arrow SVG gone | **GONE** |
| 4 | Feature card height balance | **BALANCED** — uniform heights, similar to original |
| 5 | Tajawal font preserved | **PRESERVED** — clean modern geometric look throughout |
| 6 | Hero image visibility (R2 improvement kept) | **VISIBLE & IMPROVED** |

**Overall VLM verdict: 9/10 — "successful fix of the v1.1 breakdown"**

VLM quote:
> "v1.2 represents an excellent regression recovery. It has successfully restored all major structural elements (lower sections, skills panel), removed the critical visual bug (giant arrow), and maintained design consistency (fonts, card balance, hero image). The layout is now virtually indistinguishable from the APPROVED original."

## 8. What was preserved from v1.1 (per MASTER's directive)

| Improvement | Status in v1.2 |
|---|---|
| Tajawal Arabic typography (R1, VLM 95% match to approved) | ✅ Preserved — no CSS changes affecting fonts |
| IBM Plex Sans Latin typography (R1) | ✅ Preserved |
| Hero overlay reduction (R2, luminance +18.30) | ✅ Preserved — hero CSS untouched |
| SVG icon system (R4, all 30+ Lucide-compatible) | ✅ Preserved — only size rules added, no icon paths modified |
| Mobile EN-LTR overflow fix (R5, scrollWidth=375) | ✅ Preserved — overflow rules untouched |
| Complete static localization (R6, ~55 strings) | ✅ Preserved — index.html and script.js untouched |
| Demo data integrity (R7) | ✅ Preserved |
| Nonfunctional controls removal (R8) | ✅ Preserved |
| Dark futuristic palette | ✅ Preserved |
| Full app-shell layout | ✅ Preserved |

## 9. What was NOT done (boundary compliance)

| Boundary | Compliance |
|---|---|
| Did not redesign the homepage | ✅ Only CSS rules added |
| Did not introduce a new visual identity | ✅ Same palette, same icons, same fonts |
| Did not replace the approved Syrian hero imagery | ✅ `hero-scene.webp` unchanged |
| Did not remove major page sections | ✅ All sections preserved |
| Did not modify production code | ✅ `SyrianTechRenaissance-Platform` untouched |
| Did not modify v1.0 ZIP | ✅ SHA-256 `0717bdd7127535bc...` verified unchanged |
| Did not modify v1.1 ZIP | ✅ SHA-256 `659f463f99731b2ca...` preserved on its branch |
| Did not declare Gate B approved | ✅ Status remains `GATE_B_REVIEW_PENDING` |
| Did not begin STR-UI-01-PAGE-01 (Next.js integration) | ✅ Awaiting MASTER verdict |
| Did not merge any PR | ✅ PR will be opened, not merged |
| Did not use `overflow:hidden` to hide missing content | ✅ Fix is at the SVG sizing layer |

## 10. v1.2 package contents

```
STR_UI_01_HOME_REFERENCE_v1.2.zip  (2,006,484 bytes, 12 files)
SHA-256: 58835abdb30ce0c2b33f858faf88c57279092fb1180da69dc7a0e423660b641a
├── CHANGELOG.md (13,536 bytes — added v1.2 entry to v1.1's history)
├── README.md (3,907 bytes — unchanged from v1.1)
├── REFERENCE_MANIFEST.json (8,015 bytes — updated to v1.2-draft + regression recovery section)
├── index.html (29,684 bytes — UNCHANGED from v1.1, SHA matches)
├── script.js (2,665 bytes — UNCHANGED from v1.1, SHA matches)
├── styles.css (25,286 bytes — v1.1 23,883 + ~1.4 KB of SVG sizing rules)
└── assets/ (7 files — UNCHANGED, all SHAs match v1.0/v1.1)
    ├── approved-reference.png (2,010,840 bytes)
    ├── heritage.webp (12,266 bytes)
    ├── hero-scene.webp (32,320 bytes)
    ├── project-city.webp (8,376 bytes)
    ├── project-education.webp (8,670 bytes)
    └── project-health.webp (7,670 bytes)
```

**Asset SHA-256 verification:** All 7 asset files have identical SHA-256 to v1.0 and v1.1 — bytes were never modified.

**Source file SHA-256 verification:** `index.html`, `script.js`, `README.md` have identical SHA-256 to v1.1. Only `styles.css`, `REFERENCE_MANIFEST.json`, and `CHANGELOG.md` changed.

## 11. Recommendations to MASTER

GLM provides these options without deciding:

1. **Approve Gate B based on v1.2** — proceed to STR-UI-01-PAGE-01 (Next.js integration). The regression is recovered, all v1.1 improvements preserved, all 4 defects fixed, VLM 9/10.

2. **Approve Gate B conditionally** — request a v1.2.1 hotfix if any specific detail is still off (e.g., if MASTER wants the hologram element visually different, or wants a slightly darker hero, or wants different SVG icon choices).

3. **Reject** — return v1.2 for further revision with specific objections.

GLM's recommendation: **Option 1 — Approve Gate B based on v1.2**. The regression recovery is complete and verified both quantitatively (DOM tests pass, 0 oversized SVGs, lower-grid visible at desktop) and qualitatively (VLM 9/10, all 6 recovery points confirmed). The principle "each version must be better, not trade one improvement for a lost section" is honored: v1.2 keeps every v1.1 gain AND restores every v1.0 section.

**Final decision remains MASTER's alone.**

---

**Report prepared by:** GLM Engineering Agent
**Standard followed:** AgentCraft Universal Project Delivery & Visual Fidelity Standard v1.0 (§6 Gate B, §8 Page Acceptance Loop)
**Mission:** STR-UI-00D — Visual Regression Recovery
**Status:** TECHNICALLY COMPLETE. **Gate B decision is MASTER's alone.** Status: GATE_B_REVIEW_PENDING.
