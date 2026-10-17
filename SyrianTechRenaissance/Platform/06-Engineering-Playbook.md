# STR Platform — Engineering Playbook for GLM

## Repository separation (MANDATORY)

**Code**: `https://github.com/mayakilzy/SyrianTechRenaissance-Platform.git` — only GLM coding tasks write here.  
**Docs/tasks**: `https://github.com/mayakilzy/repo-info/tree/main/SyrianTechRenaissance/Platform` — engineering briefs, references, review/evidence notes as permitted.

Do not move documents between repos or change visibility/branch settings unless explicitly approved. The ChatGPT GitHub connector currently had read-only `pull=true/push=false` and a real write attempt to docs repo failed HTTP 403 on 2026-10-17; this is why package is provided for manual upload. No changes were made to actual project repository.

## Mandatory mission loop

1. Read README and authoritative requirements, architecture and current code state.
2. Verify current branch/commit and working tree. Do not overwrite others' work.
3. Report any conflict between code and scope; propose smallest safe change.
4. Implement a **real vertical slice** with migrations, server validation, permissions and user-facing flows.
5. Exercise unit/integration/negative authorization tests, followed by Playwright in an actual browser.
6. Collect evidence: clean commit SHA, commands, test results, screenshots, trace and actual observed behavior, open defects.
7. Commit to appropriate development branch; do not merge/push production releases without approval.
8. Handoff with `DONE`, `PARTIAL`, or `BLOCKED` supported by evidence, not optimistic claims.

## Design guidelines

- 'Small in code, large in capability'. Reuse proven libraries/infrastructure rather than rebuilding browser, containers, queues and auth primitives.
- Do not impose arbitrary token/time caps or artificial retry stop conditions during initial experimentation; still retain sensible security, safety, access and financial guards.
- No fake integrations/placeholder buttons advertised as live.
- Enforce per-resource authorization on backend. Test unauthorized attempts on every main workflow.
- Do not expose private repos, credentials, provider keys or internal tooling to untrusted users.
- Do not grant operational teams unrestricted project creation or access to tools.
- Keep dependencies license-compatible and audited; no unreviewed copy/paste of proprietary competitor code.
- Use tracked migrations and restore-tested backups. Readme must make local/staging startup reproducible.

## Deliverable definition for each mission

- Code + migrations + tests + screenshots/traces as relevant.
- An updated mission evidence report in doc repo (or provided for manual upload) listing commit SHA, exact features, tests including failures, risks and next steps.
- No claim of completion until functional acceptance criteria pass.

## Deployment and release gates

A runbook for staging, secrets, Google OAuth redirect configuration, mail verification, DB migration/backup/restore, HTTPS, structured logs, permissions smoke tests, and E2E browser walkthrough. Founder decides go-live after evidence review. Production domain intentionally unassigned.

## Change control

Functional scope already approved, with specific signed decisions listed in `07-Decision-Register.md`. If new ideas arise, assess whether they fit an existing capability; avoid scope creep. Do not unilaterally build Academy, Engineering Ecosystem, 12 deferred tools or external connectors.
