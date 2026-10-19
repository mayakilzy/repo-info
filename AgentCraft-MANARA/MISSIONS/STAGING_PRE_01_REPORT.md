# MANARA — STAGING-PRE-01 Report

> Code: https://github.com/mayakilzy/AgentCraft-MANARA (commit `ce55baa`)

## Status: READY FOR STAGING DEPLOYMENT

Three confirmed gaps closed before first Staging run.

## Fixes:
1. **Docker networking**: Vite proxy now uses `VITE_API_TARGET` env var.
   - Local dev: `http://localhost:8000` (default)
   - Docker: `http://backend:8000` (set in docker-compose.yml)
   - All 11 API routes proxied.

2. **PostgreSQL unification**: docker-compose.yml uses `${VAR:-default}`
   for ALL env vars. Values sourced from .env file.
   - .env.example updated with all staging vars.
   - `docker compose config` can verify.

3. **Strict Playwright**: 11 tests with PASS/FAIL (no soft passes).
   - Test 3: compose MUST return `inv-xxx` investigation_id
   - Test 7: publication MUST use real investigation_id (not inv-session)
   - Test 8: download MUST produce non-empty content
   - Test 9: checks for critical JS errors
   - Exit: 0=PASS, 1=FAIL, 2=SKIPPED

4. **Documentation**: STAGING_READINESS.md updated to match actual config.

## Not tested (honestly):
- Docker build/run (no Docker in sandbox)
- Playwright execution (no browser in sandbox)
- PostgreSQL (SQLite only in sandbox)
- Live LLM (no API key)

Tests: 279 pass + 5 skip = 284. ruff, mypy, tsc clean.
