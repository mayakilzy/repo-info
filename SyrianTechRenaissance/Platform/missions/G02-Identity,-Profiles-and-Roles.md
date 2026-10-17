# G02 — Identity, Profiles and Roles

**الهوية والملفات المهنية والصلاحيات**  
**Repository for implementation:** `mayakilzy/SyrianTechRenaissance-Platform`  
**Docs/evidence:** `mayakilzy/repo-info/SyrianTechRenaissance/Platform`  
**Status:** PLANNED — NOT STARTED

## Purpose and boundary

Deliver this group as part of the **institutional STR Platform only**. Do not develop STR Academy or Engineering Ecosystem. Preserve all approved product principles, especially STR-GOV-TEAM-01 and secure integrations.

## Work scope

- Email/password signup with verification, reset, safe password hashing, rate limiting and account enumeration defenses.
- Google OIDC with secure state/nonce/PKCE as applicable; safe providerSub binding and deliberate existing account linking (no automatic unsafe email merge).
- Sessions, sign-out, expiry and CSRF/cookie hardening per auth library.
- Professional profiles, portfolio, skills, contact visibility, ownership checks and profile completeness rules.
- Resource-scoped authorization service with regression tests; role grants cannot be escalated by self-service.

## Acceptance evidence

Browser: register/verify/login/reset, sign in Google in configured test environment, no unsafe merge, privacy, expired sessions and unauthorized edits all verified. Fake OAuth must not be called success.

## Required engineering closure

- Check current code first, avoid rebuilding already verified capabilities.
- Implement backend policy, migrations, error states, frontend journeys and tests together.
- Confirm no hidden scope bypass and no leakage between members, teams, projects or providers.
- Use actual browser for interactive features with screenshots/traces; give exact commands and outcomes.
- Report changed paths, migration IDs, commit SHA, tested environments, PASS/FAIL, risks and follow-up work.
- Never claim deployment/real integration or completed feature without observed evidence.
