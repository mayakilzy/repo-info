# G10 — Deployment and Operational Handoff

**نشر تجريبي وتوثيق وتسليم**  
**Repository for implementation:** `mayakilzy/SyrianTechRenaissance-Platform`  
**Docs/evidence:** `mayakilzy/repo-info/SyrianTechRenaissance/Platform`  
**Status:** PLANNED — NOT STARTED

## Purpose and boundary

Deliver this group as part of the **institutional STR Platform only**. Do not develop STR Academy or Engineering Ecosystem. Preserve all approved product principles, especially STR-GOV-TEAM-01 and secure integrations.

## Work scope

- Deliver repeatable multi-stage production build, web+worker, PostgreSQL and object-storage setup, reverse proxy/TLS notes.
- Staging env samples excluding secrets; Google OAuth redirect and email verification setup with environment-specific checks.
- Migration/backup/restore and rollback runbook; health/readiness checks, logs and incident basics.
- Clean staging deployment with live browser full journey, DB persistence and worker tests.
- Prepare complete README Arabic/English, API docs, operator/user guide, known issues, version tag and release candidate report.
- Founder's acceptance required before claiming release complete.

## Acceptance evidence

Clean install and deploy reproduced, verified restore, credentials not committed, smoke and end-to-end roles pass, repository clean/tagged with exact SHA and handoff docs. No production deployment without instruction.

## Required engineering closure

- Check current code first, avoid rebuilding already verified capabilities.
- Implement backend policy, migrations, error states, frontend journeys and tests together.
- Confirm no hidden scope bypass and no leakage between members, teams, projects or providers.
- Use actual browser for interactive features with screenshots/traces; give exact commands and outcomes.
- Report changed paths, migration IDs, commit SHA, tested environments, PASS/FAIL, risks and follow-up work.
- Never claim deployment/real integration or completed feature without observed evidence.
