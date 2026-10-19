# MANARA — G07-R1 Corrective Closure Report

> **MANARA Foundation v1.0 · 2026-10-19 · Evidence integrity + file export**
> Code: https://github.com/mayakilzy/AgentCraft-MANARA (commit `d490562`)

## Status: PASS

284 tests passing (279 + 5 skip). ruff, mypy all clean.

## Fixes:
1. QualityGate verifies evidence_ids against G03 Memory (existence + tenant scope)
2. Rule 4 checks G06 forecast calibration status
3. Rule 5 checks rights_status field directly (not text matching)
4. Download API returns actual file responses with Content-Type + filename
5. Bug fix: empty set falsiness in evidence verification

## New tests (6):
- nonexistent_evidence_id_rejected
- cross_tenant_evidence_rejected
- uncalibrated_forecast_with_probability_rejected
- unknown_rights_with_external_source_rejected
- owned_rights_accepted (positive)
- download_returns_file_with_content_type (markdown/json/text)
