# STR Unified Design System — Visual Identity Contract v1.0

**Status:** Foundational governance contract approved in principle; exact component tokens pending source extraction.  
**Scope:** STR Platform, STR Academy, STR Engineering Ecosystem.  
**Basis:** STR Platform Product Spec, UX and Acceptance, STR UI Implementation Index (repo-info main, reviewed 2026-10-25).

## 1. Institutional rule

One recognizable Syrian Tech Renaissance institutional visual identity, with product-specific navigation and experiences. A shared design system does **not** imply shared databases, deployment, authentication, or business logic.

## 2. Authority and precedence

1. Founder-approved, runnable page source ZIP and its visual reference govern the specific page.
2. This contract governs new pages and cross-product consistency where no page-specific approval overrides it.
3. Product-specific UI extensions are allowed when required by real workflows and documented.
4. A developer may not substitute an invented design for an approved source.

Approved source archives are recorded in `SyrianTechRenaissance/Platform/STR_UI_IMPLEMENTATION_INDEX.md`:
- `STR_PAGE02_DASHBOARD_SOURCE.zip`
- `STR_PAGE03_MY_PROJECTS_SOURCE.zip`
- `STR_PAGE04_JOB_OPPORTUNITIES_SOURCE.zip`
- `STR_PAGE05_PROFESSIONAL_PROFILE_SOURCE.zip`

## 3. Shared visual DNA

- **Institutional foundation:** dark navy surfaces, restrained cyan/electric-blue highlights, subtle purple glow, glass-like panels and detailed but readable cards, following approved STR screens.
- **Typography:** Cairo for Arabic, IBM Plex Sans for English, subject to verification against the actual source packages.
- **Direction:** Arabic is fully RTL, including navigation position and layout flow; English is LTR. Do not simply flip text alignment.
- **Branding:** STR is the parent identity; Academy and Engineering use clear subordinate labels. No implication that deferred products are already live.
- **Components:** shared visual language for buttons, cards, inputs, tabs, tables, badges, modals, empty/error/loading states, focus and responsive behavior.
- **Accessibility:** keyboard navigation, visible focus, sufficient contrast, meaningful state messaging, responsive layouts.

**Important:** This contract intentionally does not invent hexadecimal colors, spacing scales, shadows, component dimensions or breakpoint values. Extract these from the approved source packages before declaring exact design tokens.

## 4. Product variants

| Product | Shared DNA | Distinct interaction focus | Lifecycle |
|---|---|---|---|
| STR Platform | Parent shell and components | Membership, talent, projects, opportunities, governance | Current platform |
| STR Academy | Parent identity; education variant | Learning pathways, workshops, progress, labs | Separate future product |
| STR Engineering Ecosystem | Parent identity; engineering variant | Tools, technical workspaces, capabilities | Separate future product |

Variant accent colors, if desired, require founder approval after viewing actual mockups; no accent is approved merely by inclusion in an illustration.

## 5. Integration boundaries

- **Within STR Platform v1:** Tool Directory and Integration Core screens belong to the platform.
- **Outside STR Platform v1:** Full Academy and Engineering Ecosystem are separate products. Their STR portal links must be labeled coming later until operational.
- Never fabricate functioning buttons, metrics, providers, integrations, or published content. Use explicit unavailable/empty/coming-soon states.
- Maintain role-based visibility and backend authorization; appearance alone is not a permission boundary.

## 6. Source-first delivery workflow

1. MASTER defines and prepares approved visual screens and executable HTML/CSS/JS/assets in Arabic and English.
2. Verify actual browser behavior, RTL/LTR, responsive states, and interaction semantics.
3. Founder approves the visual source; freeze and version the bundle.
4. GLM integrates that exact source into the application and binds real services; no redesign, reinterpretation or silent substitutions.
5. Verify browser fidelity and functional/security behavior, then report evidence and gaps.

Prefer **functional batches** of related pages with one approval and one source package per batch, while preserving individual page traceability.

## 7. Token extraction and implementation strategy

**Now:** treat this document as the common contract; continue Platform UI without waiting for a shared package.

**Next source-extraction pass:** inspect the four ZIP archives and produce a machine-readable token manifest (`colors`, `typography`, `spacing`, `radii`, `elevation`, `breakpoints`, `motion`, `RTL`) with provenance to source files and screenshots. Mark contradictions for founder resolution; never average or silently replace values.

**Later:** consider a versioned `STR-Design-System` repository containing design tokens, components, app shells, themes, RTL helpers and reference pages only after practical reuse is established. Avoid forcing all products into a single runtime or monorepo.

## 8. Acceptance checklist

- [ ] Matches the approved source and parent STR identity
- [ ] Arabic RTL and English LTR verified in a real browser
- [ ] Desktop/mobile and keyboard/focus verified
- [ ] All states truthful and connected to actual permissions/data
- [ ] Academy/Engineering clearly identified as separate products
- [ ] No unapproved token or component redesign
- [ ] Bundle version, source provenance, and review evidence recorded

## 9. Known unresolved items

- Exact numerical tokens have **not yet been extracted** from the approved ZIPs.
- Page 01 homepage visual/sidebar issue remains a separate closure item.
- Product-specific accent palettes are **not approved**.
- The Platform implementation index lists functional limitations that this design contract does not resolve.

## 10. References

- [Product specification](https://github.com/mayakilzy/repo-info/blob/main/SyrianTechRenaissance/Platform/01-STR-Platform-Product-Spec.md)
- [UX and acceptance](https://github.com/mayakilzy/repo-info/blob/main/SyrianTechRenaissance/Platform/05-UX-and-Acceptance.md)
- [Implementation index and approved ZIP list](https://github.com/mayakilzy/repo-info/blob/main/SyrianTechRenaissance/Platform/STR_UI_IMPLEMENTATION_INDEX.md)

**Change control:** All design identity changes require founder approval. This document is a locally prepared deliverable, not yet committed to GitHub.
