# G09 — Full Security and Browser Verification

**اختبار قبول وظيفي وأمني شامل**  
**Repository for implementation:** `mayakilzy/SyrianTechRenaissance-Platform`  
**Docs/evidence:** `mayakilzy/repo-info/SyrianTechRenaissance/Platform`  
**Status:** PLANNED — NOT STARTED

## Purpose and boundary

Deliver this group as part of the **institutional STR Platform only**. Do not develop STR Academy or Engineering Ecosystem. Preserve all approved product principles, especially STR-GOV-TEAM-01 and secure integrations.

## Work scope

- Run test matrix of roles: visitor, unverified, verified, proposer, lead, member, steward, reviewer, admin, unrelated member.
- Validate data isolation, policy escalation, concurrent approvals, duplicate requests, OAuth collision, session expiry, injection and file handling.
- Execute full end-to-end with seeded realistic but synthetic organization/team/project/opportunity scenarios.
- Real browser exploration of navigation, forms, modals, statuses, errors and mobile/RTL behavior.
- Fix actual defects, rerun tests and annotate any unresolved items. Do not confuse test success with production readiness.

## Acceptance evidence

Traceable functional/security/browser acceptance matrix with commit SHA, screenshots, traces and honest PASS/PARTIAL/FAIL. Zero unresolved critical security/authorization defects.

## Required engineering closure

- Check current code first, avoid rebuilding already verified capabilities.
- Implement backend policy, migrations, error states, frontend journeys and tests together.
- Confirm no hidden scope bypass and no leakage between members, teams, projects or providers.
- Use actual browser for interactive features with screenshots/traces; give exact commands and outcomes.
- Report changed paths, migration IDs, commit SHA, tested environments, PASS/FAIL, risks and follow-up work.
- Never claim deployment/real integration or completed feature without observed evidence.
