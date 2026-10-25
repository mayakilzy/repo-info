# STR Design Tokens Reference v1.0

**Extracted:** 2026-10-23  
**Sources:** 4 founder-approved UI source archives (Pages 02–05)  
**Machine-readable companion:** `STR_DESIGN_TOKENS_v1.0.json`

---

## Classification System

This document uses three classifications throughout:

- **Extracted Source Value** — Verbatim value from an approved page source archive. Factual observation, not a recommendation.
- **Proposed Canonical Token** — Recommended value for designing future STR pages. Not founder-approved until MASTER explicitly approves.
- **Founder-Approved Token** — Value explicitly approved by MASTER for future use.

No token in this document currently carries "Founder-Approved" status unless individually approved by MASTER.

## Pages Freeze Declaration

> Pages 02–05 remain visually approved and unchanged. Canonical token proposals apply to future pages only. No retroactive CSS normalization. No alteration of approved source ZIP archives. No application code changes.

---

## 1. Color Palette

### Shared Colors (used across all 4 pages)

| Token | Extracted Values | Usage |
|---|---|---|
| Primary Blue | `#087dff` / `#0878ff` / `#086eff` / `#0867c9` | Buttons, active nav, progress bars |
| Cyan Accent | `#14bfff` / `#16c7ff` / `#09c4ff` / `#08c8ff` | Stat icons, glow borders, holographic elements |
| Purple Accent | `#953cff` / `#a400ff` / `#ac08f7` / `#b800ef` | Gradient endpoints, violet badges |
| Background Navy | `#030b19` / `#031327` / `#031124` | Body background |
| Panel Navy | `#061b34` / `#061e37` / `#051c34` / `#041d38` | Card/panel backgrounds |
| Text Primary | `#f4f7ff` / `#eff8ff` / `#f5faff` | Headings, body text |
| Text Muted | `#a7bfde` / `#99b8d7` / `#a5c4e1` | Secondary text, labels |
| Border Navy | `#0b3157` / `#123d61` / `#10426a` / `#0c3b66` | Panel/card borders |
| Gold Star | `#ffcc3b` / `#ffcd33` / `#ffdc4b` / `#ffe233` | STR logo star, brand mark |
| Danger Red | `#ed315f` / `#f60058` / `#f8005b` | Notification badge |
| Success Green | `#00b86c` / `#00e77a` / `#169966` | Verified badge, availability dot, green tags |

**Note:** Each page uses slightly different hex values for the same semantic token. These are **extracted source values** showing natural variation from hand-authored CSS across 4 separate design files. The first value in each list is the **proposed canonical** value for new pages, based on Page 02 (the first approved page). This is a design standardization proposal, not a majority rule.

### Page-Specific Colors

| Page | Token | Value | Usage |
|---|---|---|---|
| 02 | stat_icon_bg_cyan | `#065e71` | Cyan stat icon background |
| 02 | stat_icon_bg_amber | `#574024` | Amber stat icon background |
| 02 | stat_icon_bg_purple | `#44227b` | Purple stat icon background |
| 03 | stat_icon_bg_blue | `#003c9d` | Blue stat icon background |
| 03 | stat_icon_bg_teal | `#004d46` | Teal stat icon background |
| 03 | stat_icon_bg_pink | `#64144e` | Pink stat icon background |
| 04 | badge_freelance_bg | `#4a166f` | Freelance badge background |
| 04 | badge_collaborative_bg | `#694700` | Collaborative badge background |
| 04 | badge_volunteer_bg | `#701a50` | Volunteer badge background |
| 05 | avatar_border | `#4dcaff` | Profile avatar border |
| 05 | avatar_shadow | `#0887ff` | Profile avatar glow |

---

## 2. Typography

| Token | Extracted Value | Usage |
|---|---|---|
| Arabic font | **Cairo** (weights: 400, 500, 600, 700, 800, 900) | All Arabic text |
| English font | **IBM Plex Sans** (weights: 400, 500, 600, 700) | All English text |
| Logo font | IBM Plex Sans 900 | STR brand logo (always Latin, even in Arabic) |
| Body font size | 12px | Default body text across all pages |
| Mono font | IBM Plex Mono (implied) | Keyboard shortcuts, code |

### Typography Accessibility Note

> The extracted 12px body font size is an observation from the approved source files, **not a mandatory font size for all future content**. Typography must remain readable and accessible across desktop and mobile. The 12px value must not be imposed universally on headings, paragraphs, forms, or other components.

### Page-Specific Heading Sizes

| Page | H1 | H2 |
|---|---|---|
| 02 Dashboard | `clamp(27px, 3.2vw, 46px)` | `clamp(15px, 1.6vw, 23px)` |
| 03 My Projects | 40px | 19px |
| 04 Job Opportunities | 37px | 19px |
| 05 Professional Profile | 23px | 15px |

---

## 3. Layout Dimensions

### Shared Layout Behavior

| Token | Value | Usage |
|---|---|---|
| Sidebar position | `position: fixed; inset-inline-start: 0` | Auto RTL (right) / LTR (left) |
| Main offset | `margin-inline-start: var(--sidebar-width)` | Content offset from sidebar |
| Topbar position | `position: sticky; top: 0; z-index: 20-30` | Sticky navigation |
| Mobile sidebar hide (RTL) | `transform: translateX(110%)` | Off-screen right |
| Mobile sidebar hide (LTR) | `transform: translateX(-110%)` | Off-screen left |
| Mobile sidebar show | `transform: translateX(0)` | On-screen when menu open |

### Page-Specific Dimensions (CONFLICTS — see conflicts doc)

| Page | Sidebar width | Topbar height | Mobile sidebar width |
|---|---|---|---|
| 02 Dashboard | 180px | 70px | 245px |
| 03 My Projects | 216px | 70px | 225px |
| 04 Job Opportunities | 174px | 55px | 240px |
| 05 Profile | 174px | 55px | 225px |

---

## 4. Responsive Breakpoints

| Page | Breakpoints (max-width) |
|---|---|
| 02 Dashboard | 720px, 1020px, 1250px |
| 03 My Projects | 720px, 1050px, 1350px, 385px |
| 04 Job Opportunities | 740px, 1050px, 1440px, 380px |
| 05 Profile | 700px, 950px, 1320px |

**Proposed canonical breakpoints for new pages:** 720px (mobile), 1050px (tablet), 1350px (desktop) — based on frequency across pages, not founder approval.

---

## 5. Effects

### Shared Gradient Patterns

| Pattern | CSS Value (proposed canonical) | Usage |
|---|---|---|
| Primary button | `linear-gradient(105deg, #00b6ff, #0766ff 60%, #ad00fa)` | Create/Post/Primary buttons |
| Active nav link | `linear-gradient(95deg, #08b9ff, #0054ff)` | Active sidebar nav link |
| Panel background | `linear-gradient(155deg, #062747, #02182f 82%)` | Card/panel backgrounds |
| Sidebar background | `linear-gradient(180deg, #06172c, #001124 60%)` | Sidebar gradient |
| Stat icon glow | `box-shadow: 0 0 15px rgba(0,111,255,0.33)` | Stat icon glow |

### Backdrop Blur (Glass Effect)

| Page | Value | Usage |
|---|---|---|
| 02 | `blur(5px)` | Holographic panel |
| 03 | `blur(5px)`, `blur(18px)` | Holographic panel, topbar |
| 04 | `blur(3px)`, `blur(14px)` | Holographic panel, topbar |
| 05 | N/A (no backdrop-filter in CSS) | — |

---

## 6. Border Radius

| Token | Value | Usage |
|---|---|---|
| Small | 5–6px | Chips, small buttons |
| Medium | 7–10px | Buttons, inputs, cards |
| Large | 11–12px | Panels, hero, stats |
| Pill | 20–22px | Pills, tags, filter tabs |
| Circle | 50% | Avatars, progress rings |

---

## 7. Focus Accessibility

| Token | Value |
|---|---|
| Outline color | `#58d8ff` / `#4ad8ff` / `#6be5ff` / `#49dfff` |
| Outline width | 2px |
| Outline offset | 2–3px |

---

## 8. RTL/LTR Behavior

| Feature | Implementation |
|---|---|
| Direction attribute | `<html dir="rtl">` (Arabic) / `<html dir="ltr">` (English) |
| Font switching | `Cairo` for RTL, `IBM Plex Sans` for LTR |
| Sidebar positioning | CSS logical property `inset-inline-start: 0` (auto-directional) |
| Main content offset | CSS logical property `margin-inline-start` (auto-directional) |
| Sidebar border | CSS logical property `border-inline-end` (auto-directional) |
| Mobile sidebar slide | `translateX(110%)` for RTL, `translateX(-110%)` for LTR |
| Hero scene LTR | Page 02/05: `scaleX(-1)` mirror; Page 03/04: `background-position` shift |

---

## 9. Proposed Canonical Token Summary for New Pages

> The following values are **proposed canonical tokens** for designing future STR pages. They are NOT founder-approved unless MASTER explicitly approves them. They are extracted from the approved source archives and recommended for design consistency.

```css
:root {
  /* Colors — proposed canonical (first value from each extracted range) */
  --str-bg: #031124;
  --str-panel: #061b34;
  --str-text: #f4f7ff;
  --str-muted: #a7bfde;
  --str-border: #0b3157;
  --str-blue: #087dff;
  --str-cyan: #14bfff;
  --str-purple: #953cff;
  --str-gold: #ffcc3b;
  --str-danger: #ed315f;
  --str-success: #00b86c;

  /* Layout — proposed canonical (design standardization, not majority) */
  --str-sidebar: 180px;  /* from Page 02, the first approved page */
  --str-topbar: 70px;     /* from Pages 02/03 (2-2 tie with 55px; 70px proposed as standard) */
  --str-mobile-sidebar: 245px;

  /* Breakpoints — proposed canonical */
  --str-bp-mobile: 720px;
  --str-bp-tablet: 1050px;
  --str-bp-desktop: 1350px;

  /* Radius — proposed canonical */
  --str-radius-sm: 6px;
  --str-radius-md: 9px;
  --str-radius-lg: 12px;
  --str-radius-pill: 20px;

  /* Fonts — extracted from all 4 pages */
  --str-font-ar: 'Cairo', sans-serif;
  --str-font-en: 'IBM Plex Sans', sans-serif;
}
```

---

*Extracted by: GLM Engineering Agent*  
*Date: 2026-10-23*  
*All values traced to approved source CSS with provenance records.*  
*Corrections applied: STR-DS-01A (2026-10-25) per MASTER directive.*
