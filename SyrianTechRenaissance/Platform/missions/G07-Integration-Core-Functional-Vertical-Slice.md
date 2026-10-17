# G07 — Integration Core Functional Vertical Slice

**منظومة التكاملات العاملة والموصل التجريبي**  
**Repository for implementation:** `mayakilzy/SyrianTechRenaissance-Platform`  
**Docs/evidence:** `mayakilzy/repo-info/SyrianTechRenaissance/Platform`  
**Status:** PLANNED — NOT STARTED

## Purpose and boundary

Deliver this group as part of the **institutional STR Platform only**. Do not develop STR Academy or Engineering Ecosystem. Preserve all approved product principles, especially STR-GOV-TEAM-01 and secure integrations.

## Work scope

- Complete provider registry/approval, capabilities with typed schemas, secure scoped connections, credential refs.
- Background job dispatcher with durable outbox, per-project authorization and idempotency.
- Mock connector using same adapter interface as future providers; real queued→running→result lifecycle.
- Verified webhook receiver or authenticated mock event flow with replay/signature tests.
- Cancel/revoke/suspend integration, audit job outcomes, separate failure handling; no arbitrary provider URL execution.
- Tool directory/admin listing and clearly labeled mock/dev service, no real tool claim.

## Acceptance evidence

End-to-end browser creates scoped mock integration, submits job, sees result, revokes connection, blocks subsequent requests. Cross-team abuse, webhook spoof, duplicate event and SSRF tests PASS.

## Required engineering closure

- Check current code first, avoid rebuilding already verified capabilities.
- Implement backend policy, migrations, error states, frontend journeys and tests together.
- Confirm no hidden scope bypass and no leakage between members, teams, projects or providers.
- Use actual browser for interactive features with screenshots/traces; give exact commands and outcomes.
- Report changed paths, migration IDs, commit SHA, tested environments, PASS/FAIL, risks and follow-up work.
- Never claim deployment/real integration or completed feature without observed evidence.
