# STR-UI-04 — Job Opportunities Visual Evidence

**Code PR:** https://github.com/mayakilzy/SyrianTechRenaissance-Platform/pull/10
**Commit SHA:** `ce6daba9475f9a7417350c861d8726fb8b60b4f6`
**Date:** 2026-10-23
**Source package SHA-256:** `dcc1a8dd5b28134dbf044cb32d180eb304e4415ceda1a9b0f59a47ce01d3c496`

## Sidebar position verification (Playwright bounding-box)

| Viewport | Locale | Sidebar position | Expected | Match |
|---|---|---|---|---|
| 1536×1024 | AR | RIGHT | RIGHT | ✅ |
| 1536×1024 | EN | LEFT | LEFT | ✅ |
| 768×1024 | AR | RIGHT | RIGHT | ✅ |
| 768×1024 | EN | LEFT | LEFT | ✅ |
| 375×667 | AR | drawer slides from RIGHT | RIGHT | ✅ |
| 375×667 | EN | drawer slides from LEFT | LEFT | ✅ |

## Quality checks

- typecheck: PASS ✅
- lint: PASS (0 errors) ✅
- Horizontal scroll: 0 in all 6 cases ✅
- Page errors: 0 in all 6 cases ✅
- Console errors: 0 in all 6 cases ✅
- Big SVGs (>30px): 0 ✅
- Castle flag: NONE ✅
- Full screenshot as background: NONE ✅

## Visual comparisons

- `comparison-approved-vs-implemented-ar.png`: approved AR vs implementation AR
- `comparison-approved-vs-implemented-en.png`: approved EN vs implementation EN

## Known limitations

- L1: Opportunity type mapping: OpportunityType enum (PROJECT/TASK/MENTORSHIP/INTERNSHIP/CONSULTING/OTHER) mapped to approved design categories (fulltime/freelance/volunteer/collaborative) — not 1:1
- L2: Applicant count: 0 (no public applicant count API)
- L3: Experience level: inferred from requirements text (no dedicated field)
- L4: Technical field: inferred from title/description (no dedicated field)
- L5: PR #10 depends on PR #9 (which depends on PR #8)

## Awaiting

MASTER + ChatGPT visual review.
