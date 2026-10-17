# Syrian Tech Renaissance — Platform v1.0

**Documentation and engineering handoff** | 2026-10-17 | Arabic authoritative | Status: **approved scope / proposed implementation architecture**

## Repository boundaries
- **Development repository (code only):** https://github.com/mayakilzy/SyrianTechRenaissance-Platform.git
- **Tasks and documents repository:** https://github.com/mayakilzy/repo-info/tree/main/SyrianTechRenaissance/Platform
- This package goes into the **documentation repository only**; do not push this package to the development repository.

## Reading order
1. `01-STR-Platform-Product-Spec.md` — approved institutional and functional requirements
2. `02-STR-Platform-Architecture.md` — proposed technology, boundaries and deployment
3. `03-Data-and-Permissions.md` — entities, tenant/resource authorization, team approvals
4. `04-Integrations-Contracts.md` — **real integration-ready core** specification
5. `05-UX-and-Acceptance.md` — routes, UI flows, end-to-end verification
6. `06-Engineering-Playbook.md` — GLM instructions, repository safety, delivery/verification
7. `07-Decision-Register.md` — what is approved, what is proposed, what is deferred
8. `missions/` — ten grouped execution missions (G01–G10)
9. `contracts/` — reference examples and validation schemas

## Critical principles
- Current project is the **STR institutional platform only**. Academy and engineering ecosystem are future **independent products**.
- No free-form operational team creation: every operational team must be backed by an **approved project charter**, named team lead and institutional steward.
- Existing and future tools remain in their own applications/sites, connected through explicit integrations.
- Support email/password + verified email and Google OpenID Connect; prevent unsafe account linking.
- No privileged resources, keys or arbitrary code execution available to unreviewed teams.
- Browser-based role-specific end-to-end evidence is mandatory; unit tests alone never prove delivery.
- Build a **modular monolith**, not a swarm of premature microservices. Technology stack remains a proposal until implementation review.

## Release policy
The package records agreed product scope and a recommended executable architecture, but does not claim that source code exists, that tools have been connected, or that software has been tested. Each mission is a handoff and must be verified in the development repository after GLM executes it.

## Project status at handoff
GitHub documentation repository was readable but connector write access failed with HTTP 403 (push=false). Package therefore intended for manual upload or after reconnecting with content write permissions. The original development repository was not modified.
