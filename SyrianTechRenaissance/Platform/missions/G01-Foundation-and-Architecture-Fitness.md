# G01 — Foundation and Architecture Fitness

**إنشاء الأساس واختبار صلاحية المعمارية**  
**Repository for implementation:** `mayakilzy/SyrianTechRenaissance-Platform`  
**Docs/evidence:** `mayakilzy/repo-info/SyrianTechRenaissance/Platform`  
**Status:** PLANNED — NOT STARTED

## Purpose and boundary

Deliver this group as part of the **institutional STR Platform only**. Do not develop STR Academy or Engineering Ecosystem. Preserve all approved product principles, especially STR-GOV-TEAM-01 and secure integrations.

## Work scope

- Establish Next.js TypeScript project, clean folders per module, PostgreSQL migrations and local compose.
- Validate selected dependency versions, licensing, Auth/OIDC compatibility, multi-language RTL and CI build; issue ADRs for any deviations.
- Establish security middleware, request tracing, typed config/env validation, failure pages and error semantics.
- Define shared API response/error conventions, structured logging and migration/seed strategy.
- Bootstrap integration registry and interfaces as **real typed contracts**, not fake routes; provider registration schema.
- Seed only synthetic fixtures and document how to run locally and staging.

## Acceptance evidence

Clean installation, database migrations, typecheck, unit test, app server HTTP success, sample i18n page, route contracts and CI PASS; browser screenshot both RTL and LTR. No claims that auth or integration features work yet.

## Required engineering closure

- Check current code first, avoid rebuilding already verified capabilities.
- Implement backend policy, migrations, error states, frontend journeys and tests together.
- Confirm no hidden scope bypass and no leakage between members, teams, projects or providers.
- Use actual browser for interactive features with screenshots/traces; give exact commands and outcomes.
- Report changed paths, migration IDs, commit SHA, tested environments, PASS/FAIL, risks and follow-up work.
- Never claim deployment/real integration or completed feature without observed evidence.
