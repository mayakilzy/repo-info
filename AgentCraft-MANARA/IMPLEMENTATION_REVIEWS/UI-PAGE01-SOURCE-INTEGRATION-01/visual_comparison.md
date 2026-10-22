# MANARA UI-PAGE01-SOURCE-INTEGRATION-01 — Visual Comparison

**Mission:** `MANARA-UI-PAGE01-SOURCE-INTEGRATION-01`
**Method:** Side-by-side VLM comparison (GLM-5V-Turbo) at 1536×1024 desktop viewport

---

## 1. Approved → HTML Reference → React (3-way comparison)

The composite image `screenshots/09_side_by_side_approved_html_react.png` shows all three side-by-side at matching height (1024px).

---

## 2. HTML Reference vs Approved Design

**Verdict: HTML reference faithfully reproduces the approved design.**

7 differences identified, all LOW/MEDIUM severity and explicitly disclosed in the source package's README:

| # | Difference | Severity | Source-acknowledged? |
|---|---|---|---|
| 1 | Sidebar icons use Unicode glyphs (generic shapes) instead of approved line-art icons | LOW | Yes (README: "Reference glyphs are placeholders") |
| 2 | Bottom card text "Intelligence Observatory" vs approved "Switch to Observatory" | LOW | Yes |
| 3 | Step icons are generic shapes instead of approved magnifying glass / cylinder / hierarchy | LOW | Yes |
| 4 | Capability icons are generic shapes | LOW | Yes |
| 5 | Header user profile removed (correct per OPEN-04) | NONE | Yes (README: "fake profile/role switch... decorative/inert") |
| 6 | Language dropdown missing checkmark on selected option | LOW | Minor |
| 7 | Search hint text position differs slightly | LOW | Minor |

**Conclusion:** HTML reference is a valid visual source for React integration.

---

## 3. React Integration vs HTML Reference

**Verdict: React faithfully reproduces the HTML reference for the Hero region.**

5 differences identified:

| # | Difference | Severity | Root cause | Fixable? |
|---|---|---|---|---|
| 1 | Sidebar sections differ (Intelligence/Factory/Studio vs Exploration/Knowledge & Analysis/Factory Management) | MEDIUM | Sidebar.tsx was not in scope for this mission (Hero-only) | Yes — follow-up mission |
| 2 | Header layout differs (page title + status vs central search + bell + profile) | MEDIUM | Header.tsx was not in scope. Per OPEN-04, profile correctly removed. Per Decision 05, search is inert. | Yes — follow-up mission (search must be clearly inert) |
| 3 | Process step icons use Lucide (Compass/Database/Network) instead of generic Unicode glyphs | LOW | Per README, reference glyphs were placeholders | Acceptable as improvement |
| 4 | Capability card icons use Lucide instead of generic Unicode glyphs | LOW | Same as above | Acceptable as improvement |
| 5 | ComposeResultCard idle state adds "Type a question to begin..." text not in approved layout | LOW | ComposeResultCard is a separate component | Yes — could suppress via prop |

---

## 4. React Integration vs Approved Design

**Verdict: React Hero region faithfully reproduces the approved design.**

Same 5 differences as React vs HTML reference, plus:

| # | Difference | Severity | Note |
|---|---|---|---|
| 6 | "Start Investigation" button appears light gray in empty-state screenshot | NONE | This is correct disabled behavior. Button is dark navy when input is valid. See `screenshots/07_react_populated.png` for active state. |

---

## 5. Hero Region Pixel Fidelity — Detailed

### Hero headline
- **Approved:** Source Serif 4, weight 500, size ~52px, italic teal accent on "discover", letter-spacing -2.5px
- **HTML ref:** Same per styles.css
- **React:** Same — `font-family: var(--font-source-serif)`, `font-weight: 500`, `font-size: clamp(38px, 4.1vw, 69px)`, `letter-spacing: -2.5px`
- **Note:** Initial React rendering had 16px font due to undefined `--font-source-serif` CSS variable. **Fixed** by defining `--font-source-serif`, `--font-inter`, `--font-ibm-arabic`, `--font-ibm-mono` in `:root`. This was a pre-existing latent bug (variables were referenced but never defined).

### Lighthouse artwork
- **Approved:** Photorealistic lighthouse + knowledge-graph overlay (baked-in)
- **HTML ref:** Uses `assets/lighthouse-scene.png` (cropped from approved, preserves baked-in overlay)
- **React:** Uses same `lighthouse-scene.png` (copied from owner's source package to `frontend/public/hero/`)
- **Fidelity:** ✅ Identical (same image asset)

### Question card
- **Approved:** White card with textarea, char counter, dark navy submit button, 3 chips
- **HTML ref:** Matches approved
- **React:** Matches approved — textarea with `maxlength=1000`, char counter, dark navy submit button (`#05394d`), 3 chips
- **Fidelity:** ✅ Faithful

### 3-step process
- **Approved:** 3 horizontal cards with circular icons, connecting arrows, brass-gradient number badges
- **HTML ref:** Matches approved (with placeholder Unicode glyph icons)
- **React:** Matches approved (with Lucide icons: Compass/Database/Network)
- **Fidelity:** ✅ Faithful (icons improved per README allowance)

### Capabilities grid
- **Approved:** 4 cards with circular icons, labels, descriptions
- **HTML ref:** Matches approved (with placeholder Unicode glyph icons)
- **React:** Matches approved (with Lucide icons: FileText/BookOpen/TrendingUp/FileText)
- **Fidelity:** ✅ Faithful

### Mountain promo card
- **Approved:** Mountain landscape photo with dark text overlay + "Explore the workflow" button
- **HTML ref:** Uses `assets/mountain-scene.png` (cropped from approved, has some text residue per README)
- **React:** Uses same `mountain-scene.png` (copied from owner's source package)
- **Fidelity:** ✅ Identical (same image asset)

---

## 6. Responsive + RTL Verification

| State | Captured? | Notes |
|---|---|---|
| EN desktop 1536×1024 | ✅ `screenshots/03_react_en_desktop.png` | Full layout visible |
| AR desktop RTL 1536×1024 | ✅ `screenshots/04_react_ar_desktop.png` | RTL mirrored, Arabic text |
| EN mobile 375×812 | ✅ `screenshots/05_react_en_mobile.png` | Responsive layout, mobile nav |
| AR mobile RTL 375×812 | ✅ `screenshots/06_react_ar_mobile.png` | RTL + mobile |
| Populated (after compose) | ✅ `screenshots/07_react_populated.png` | Real compose result |
| Error state (backend killed) | ✅ `screenshots/08_react_error_state.png` | Real API error |

---

## 7. Final Verdict

**Hero region of Page 01: ✅ VISUALLY FAITHFUL to the approved design.**

**Sidebar + Header: ⚠️ Require follow-up mission** (were not in scope for this Hero-only mission).

**Recommendation to owner:**
1. ACCEPT the Hero region of Page 01
2. Issue a follow-up mission `MANARA-UI-PAGE01-SIDEBAR-HEADER-INTEGRATION-01` to reconcile Sidebar.tsx and Header.tsx with the HTML reference
3. After Page 01 full-page acceptance, proceed to Page 02

---

## 8. References

- Source package: `AgentCraft-MANARA/IMPLEMENTATION_READY/MANARA_PAGE_01_HTML_CSS_SOURCE_v1.zip`
- Source README: `manara_home_source/README.md` (inside the ZIP)
- Approved reference: `AgentCraft-MANARA/UI_UX_DESIGN/APPROVED_VISUAL_ASSETS/MANARA_02_Home_Investigation_Memory.zip`
- Side-by-side composite: `screenshots/09_side_by_side_approved_html_react.png`
- Mission report: `REPORT.md` (in this folder)
