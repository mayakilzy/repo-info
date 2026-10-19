# MANARA — Staging Readiness Report

> Code: https://github.com/mayakilzy/AgentCraft-MANARA (commit `01a44e7`)

## Status: READY FOR STAGING

MANARA is ready for deployment on a Staging environment.

## What was done:
1. Unified InvestigationRow creation (MoldArchitect sole owner)
2. Docker Compose updated: PostgreSQL 16 + pgvector
3. Vite proxy: all 11 API routes proxied
4. Playwright E2E test: 9 tests ready to run
5. Staging Readiness Guide: deployment + testing + backup + rollback

## Acceptance Matrix

| Component | Status |
|-----------|--------|
| Backend (284 tests) | ✅ PASS (SQLite) |
| Frontend (tsc clean) | ✅ PASS |
| Investigation lifecycle | ✅ PASS (real IDs) |
| Docker Compose | ✅ READY (not executed — no Docker in sandbox) |
| PostgreSQL + pgvector | ✅ READY (pgvector/pgvector:pg16 image) |
| Playwright E2E | ✅ READY (not executed — no browser in sandbox) |
| Live LLM (Z.AI) | ❌ NOT TESTED (no API key) |
| OpenAlex search | ❌ NOT TESTED (rate-limited) |
| Cross-domain pilots | PARTIAL (journey proven, live data not collected) |

## Next steps:
1. Deploy on Staging: `docker compose up -d`
2. Run migrations: `docker compose exec backend alembic upgrade head`
3. Seed capabilities: `curl -X POST http://localhost:8000/registry/capabilities/seed`
4. Run Playwright: `python tests/e2e/test_staging_journey.py`
5. Test manually from browser: http://localhost:5173
6. Report defects found in Staging
