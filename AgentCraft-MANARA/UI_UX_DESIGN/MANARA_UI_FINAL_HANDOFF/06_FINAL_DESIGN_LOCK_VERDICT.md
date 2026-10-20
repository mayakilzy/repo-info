# MANARA — Final Design Lock Verdict

> **Document type.** Final verdict: is the design ready for implementation?
> **Date.** 2026-10-21.
> **Authorization.** DOCUMENTATION-ONLY. No frontend implementation.

---

## 1. Verdict Summary

| Dimension | Verdict | Details |
|---|---|---|
| **Visual Design Readiness** | ✅ **PASS** | 22 SHA-verified visual assets; 9-page mapping complete; 4 APPROVED_VISUAL + 9 APPROVED_DIRECTION + 8 SUPPORTING_ONLY + 1 FUTURE_DESIGN. |
| **Backend Contract Readiness** | ✅ **PASS** | 73 endpoints; 412 tests (406 passed + 5 skipped + 1 deselected); migration 0008 verified; all 13 blocking gaps CLOSED. |
| **Implementation Handoff Specification** | ✅ **PASS** | Per-page build/remove/future specifications complete; shared component library defined; responsive + i18n + accessibility contracts specified. |
| **Repository Boundary** | ✅ **PASS** | Boundary verified; only documentation files committed to `repo-info`; no code in docs repo. |
| **Open Verification Items** | ⚠️ **10 OPEN** | Require owner decision before implementation (see `04_OPEN_VERIFICATION_ITEMS.md`). |
| **Frontend Implementation Authorization** | 🛑 **UNAUTHORIZED** | Requires separate explicit owner authorization. |

**Overall verdict: DESIGN LOCK READY — IMPLEMENTATION UNAUTHORIZED.**

The design is locked. The backend is ready. The handoff specifications are complete. The owner must resolve the 10 OPEN items and issue a separate implementation authorization mission.

---

## 2. What Is Locked

### 2.1 Visual identity (non-negotiable preservation)

- **Original lighthouse identity** — preserve from Home Concept 01.
- **Mold Factory Concept 02** — dark-blue blueprint panel (owner prefers).
- **Publishing Concept 02 + Reader Concept 01** — both approved.
- **Modern Knowledge Studio + Intelligence Observatory** — dual-theme system.
- **English default LTR, Arabic optional RTL** — supersedes foundation's browser-locale suggestion.

### 2.2 Color palette (locked)

| Token | Value |
|---|---|
| Porcelain | `#F7F8F6` |
| Ink | `#19334A` |
| Teal | `#2C7380` |
| Brass | `#BB9362` |
| Mist | `#E8EFF1` |

### 2.3 Typography (locked, pending font licensing verification — OPEN-06)

| Usage | Font |
|---|---|
| Headings | Source Serif 4 |
| English UI | Inter |
| Arabic UI | IBM Plex Sans Arabic |
| Mono / IDs | IBM Plex Mono |

### 2.4 Backend contracts (locked at SHA `6efac89`)

- 73 MANARA application endpoints.
- 412 test functions (406 passed + 5 skipped + 1 deselected).
- Migration `0008_mold_composition` verified.
- All 13 blocking gaps CLOSED.
- Bitemporal replay confirmed POST.
- Nonexistent endpoints (recipe promote, quality-gate) confirmed absent.

### 2.5 Honest data quality flags (locked)

Every flag in the `MANARA_UI_UX_DESIGN_FOUNDATION.md` §11 catalog must be surfaced. The UI must NEVER hide these flags or fabricate missing data.

---

## 3. What Is NOT Locked (OPEN Items)

The 10 items in `04_OPEN_VERIFICATION_ITEMS.md` require owner decision:

1. OPEN-01: 13-state vs 7-state workflow stepper.
2. OPEN-02: Knowledge Graph visualization depth.
3. OPEN-03: Studio/Observatory switch scope.
4. OPEN-04: Role switcher behavior.
5. OPEN-05: Mobile navigation pattern.
6. OPEN-06: Arabic font licensing verification.
7. OPEN-07: Polling intervals.
8. OPEN-08: Coverage Blocker Report visual treatment.
9. OPEN-09: Audit log visualization.
10. OPEN-10: Bitemporal replay visualization.

**These do NOT block the design lock.** They block the *implementation* handoff. The owner should resolve them in the implementation authorization mission.

---

## 4. What Is Explicitly Removed

The 28 elements listed in `03_IMPLEMENTATION_HANDOFF_SPECIFICATIONS.md` §5 are marked REMOVE. The implementation team must NOT build these elements. They include:

- User profile / auth / login (G01).
- Global search (no endpoint).
- PDF / HTML export (not implemented).
- Share links (no endpoint).
- Recipe promote button (R-09: not implemented).
- Crossref/arXiv sandbox test (422 — no connector code).
- Fictitious data (confidence percentages, fabricated agents, etc.).
- And 20+ more (see the full list in §5).

---

## 5. What Is Deferred (Future)

The Source Connector Framework and other SaaS enhancements are deferred to future backend missions. The UI must NOT implement them as active functionality. See `03_IMPLEMENTATION_HANDOFF_SPECIFICATIONS.md` §6 for the full list.

---

## 6. Implementation Authorization Gate

**Frontend implementation remains UNAUTHORIZED until the owner:**

1. ✅ Approves this final handoff package (6 files in `MANARA_UI_FINAL_HANDOFF/`).
2. ⚠️ Resolves the 10 OPEN items in `04_OPEN_VERIFICATION_ITEMS.md`.
3. 🛑 Issues a new mission explicitly authorizing frontend implementation.

**A successful design lock does NOT authorize frontend development.** The owner must separately approve the final UI implementation mission.

---

## 7. Final Statement

The MANARA design is locked. The visual assets are verified. The backend contracts are closed. The handoff specifications are complete. The repository boundary is clean.

**The design is ready. The implementation awaits the owner's word.**

— **GLM (Implementer), 2026-10-21**
