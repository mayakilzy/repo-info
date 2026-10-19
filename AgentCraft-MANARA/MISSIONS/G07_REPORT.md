# MANARA — Mission G07 Report

> **MANARA Foundation v1.0 · 2026-10-19 · Outputs & Publishing**
> Owner: Ayman · Supervisor: ChatGPT · Implementer: GLM
> Code: https://github.com/mayakilzy/AgentCraft-MANARA (commit `442840c`)
> Baseline: `0490bcb` (G06)

## Status: PASS

273 tests passing + 5 skip. ruff, mypy, tsc all clean.

## Acceptance focus (per G07.md)
> "A complete sourced report can be downloaded; all media scenes tied to evidence or clearly labeled fiction."

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Downloadable sourced report | ✅ PASS | Dossier downloadable as JSON/Markdown/text |
| Media scenes tied to evidence | ✅ PASS | Evidence-backed scenes have evidence_ids |
| Fictional scenes labeled | ✅ PASS | Fictional scenes have disclosure_text |
| Quality gate 6 rules | ✅ PASS | All 6 rules tested (positive + negative) |
| Presenter duration calculated | ✅ PASS | word_count / 140 wpm → estimated_minutes |
| Coverage blocker labeled | ✅ PASS | deliverable_type=coverage_blocker_report |

## Three output types from single evidence base

1. **Research Dossier** — sections, findings with evidence_ids, contradictions preserved, gaps, forecasts, references
2. **Presenter Edition** — script with word count → duration, cue sheet, editor notes, uncertainty disclosures
3. **Visual Storyboard** — 5 scene types, evidence/fiction classification, rights manifest, asset provenance

## Code commit: 442840c (mayakilzy/AgentCraft-MANARA)
## Tests: 273 pass + 5 skip = 278 total
