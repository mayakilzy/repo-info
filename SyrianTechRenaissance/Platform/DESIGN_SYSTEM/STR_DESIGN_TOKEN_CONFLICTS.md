# STR Design Token Conflicts

**Date:** 2026-10-23 (original extraction), 2026-10-25 (corrections per STR-DS-01A)  
**Purpose:** Document conflicting values across the 4 approved source archives.

These conflicts are **factual observations** (extracted source values), not defects. Each page was hand-authored independently, and minor variations are expected. MASTER may choose to standardize or preserve page-specific values.

**Classification:** All values in this document are **Extracted Source Values**. Proposed canonical tokens are **Proposed**, not Founder-Approved.

---

## 1. Sidebar Width

| Page | Extracted Value | Provenance |
|---|---|---|
| 02 Dashboard | 180px | `:root --sidebar` |
| 03 My Projects | 216px | `:root --sidebar` |
| 04 Job Opportunities | 174px | `:root --sidebar-width` |
| 05 Professional Profile | 174px | `.shell --side` |

**Distribution:** 174px occurs twice (Pages 04, 05). 180px occurs once (Page 02). 216px occurs once (Page 03).

**Proposed canonical:** 180px — based on Page 02 (the first approved page), NOT as a statistical majority. MASTER approval required.

**Pages freeze:** Existing pages retain their extracted sidebar widths. No retroactive normalization.

---

## 2. Topbar Height

| Page | Extracted Value | Provenance |
|---|---|---|
| 02 Dashboard | 70px | `:root --topbar` |
| 03 My Projects | 70px | `:root --top` |
| 04 Job Opportunities | 55px | `:root --top-height` |
| 05 Professional Profile | 55px | `.shell --header` |

**Distribution:** 70px occurs twice (Pages 02, 03). 55px occurs twice (Pages 04, 05). This is a **2-2 tie**, not a majority.

**Proposed canonical:** 70px — as a design standardization decision, NOT as a majority result. MASTER approval required.

**Pages freeze:** Existing pages retain their extracted topbar heights. No retroactive normalization.

---

## 3. Mobile Breakpoint

| Page | Extracted Value |
|---|---|
| 02 Dashboard | 720px |
| 03 My Projects | 720px |
| 04 Job Opportunities | 740px |
| 05 Professional Profile | 700px |

**Distribution:** 720px occurs twice (Pages 02, 03). 740px and 700px each occur once.

**Proposed canonical:** 720px — most frequently used value. MASTER approval required.

---

## 4. Backdrop Blur

| Page | Extracted Value | Usage |
|---|---|---|
| 02 | `blur(5px)` | Holographic panel only |
| 03 | `blur(5px)`, `blur(18px)` | Holographic panel, topbar |
| 04 | `blur(3px)`, `blur(14px)` | Holographic panel, topbar |
| 05 | (none) | No backdrop-filter used |

**Proposed canonical:** `blur(5px)` for holographic panels, `blur(14px)` for topbar. MASTER approval required.

---

## 5. CSS Variable Naming

| Concept | Page 02 | Page 03 | Page 04 | Page 05 |
|---|---|---|---|---|
| Background | `--bg` | `--bg` | `--navy` | (inline in .shell) |
| Text | `--text` | `--text` | `--ink` | (inline) |
| Border | `--stroke` | `--line` | `--border` | `--line` |
| Sidebar width | `--sidebar` | `--sidebar` | `--sidebar-width` | `--side` |
| Topbar height | `--topbar` | `--top` | `--top-height` | `--header` |

**Assessment:** Each page uses different variable names for the same semantic concepts. This is the largest naming inconsistency.

**Proposed canonical naming:** Use `--str-*` prefix (e.g., `--str-bg`, `--str-sidebar`, `--str-topbar`). MASTER approval required.

---

## 6. Hero LTR Behavior

| Page | Extracted Method |
|---|---|
| 02 Dashboard | `transform: scaleX(-1)` (mirror) |
| 03 My Projects | `background-position: 100% 58%` (no mirror) |
| 04 Job Opportunities | `background-position: 58% 50%` (no mirror) |
| 05 Profile | `transform: scaleX(-1)` (mirror) |

**Assessment:** Pages 02 and 05 mirror the hero scene for LTR. Pages 03 and 04 reposition it. Both approaches achieve the same visual goal (castle/sunset on the right).

**Proposed canonical:** `background-position` for new pages to avoid mirroring artifacts. MASTER approval required.

---

*Documented by: GLM Engineering Agent*  
*Date: 2026-10-23*  
*Corrections applied: 2026-10-25 per STR-DS-01A directive*
