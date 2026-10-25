# STR Design Token Conflicts

**Date:** 2026-10-23  
**Purpose:** Document conflicting values across the 4 approved source archives.

These conflicts are **factual observations**, not defects. Each page was hand-authored independently, and minor variations are expected. MASTER may choose to standardize or preserve page-specific values.

---

## 1. Sidebar Width

| Page | Value | Provenance |
|---|---|---|
| 02 Dashboard | 180px | `:root --sidebar` |
| 03 My Projects | 216px | `:root --sidebar` |
| 04 Job Opportunities | 174px | `:root --sidebar-width` |
| 05 Professional Profile | 174px | `.shell --side` |

**Assessment:** Pages 04 and 05 agree (174px). Pages 02 and 03 diverge. No functional impact — each page's sidebar is self-contained. **Recommended canonical:** 180px (Page 02, the first approved page).

---

## 2. Topbar Height

| Page | Value | Provenance |
|---|---|---|
| 02 Dashboard | 70px | `:root --topbar` |
| 03 My Projects | 70px | `:root --top` |
| 04 Job Opportunities | 55px | `:root --top-height` |
| 05 Professional Profile | 55px | `.shell --header` |

**Assessment:** Two groups: 70px (Pages 02, 03) and 55px (Pages 04, 05). **Recommended canonical:** 70px (majority of pages).

---

## 3. Mobile Breakpoint

| Page | Value |
|---|---|
| 02 Dashboard | 720px |
| 03 My Projects | 720px |
| 04 Job Opportunities | 740px |
| 05 Professional Profile | 700px |

**Assessment:** Minor 20–40px variation. **Recommended canonical:** 720px (majority).

---

## 4. Backdrop Blur

| Page | Value | Usage |
|---|---|---|
| 02 | `blur(5px)` | Holographic panel only |
| 03 | `blur(5px)`, `blur(18px)` | Holographic panel, topbar |
| 04 | `blur(3px)`, `blur(14px)` | Holographic panel, topbar |
| 05 | (none) | No backdrop-filter used |

**Assessment:** Page 05 doesn't use glass blur at all. Pages 02-04 vary between 3-18px. **Recommended canonical:** `blur(5px)` for holographic panels, `blur(14px)` for topbar.

---

## 5. CSS Variable Naming

| Concept | Page 02 | Page 03 | Page 04 | Page 05 |
|---|---|---|---|---|
| Background | `--bg` | `--bg` | `--navy` | (inline in .shell) |
| Text | `--text` | `--text` | `--ink` | (inline) |
| Border | `--stroke` | `--line` | `--border` | `--line` |
| Sidebar width | `--sidebar` | `--sidebar` | `--sidebar-width` | `--side` |
| Topbar height | `--topbar` | `--top` | `--top-height` | `--header` |

**Assessment:** Each page uses different variable names for the same semantic concepts. This is the largest naming inconsistency. **Recommended canonical naming:** Use `--str-*` prefix as shown in the canonical token summary in the reference doc.

---

## 6. Hero LTR Behavior

| Page | Method |
|---|---|
| 02 Dashboard | `transform: scaleX(-1)` (mirror) |
| 03 My Projects | `background-position: 100% 58%` (no mirror) |
| 04 Job Opportunities | `background-position: 58% 50%` (no mirror) |
| 05 Profile | `transform: scaleX(-1)` (mirror) |

**Assessment:** Pages 02 and 05 mirror the hero scene for LTR. Pages 03 and 04 reposition it. Both approaches achieve the same visual goal (castle/sunset on the right). **No recommendation** — either approach works. Use `background-position` for new pages to avoid mirroring artifacts.

---

*Documented by: GLM Engineering Agent*  
*Date: 2026-10-23*
