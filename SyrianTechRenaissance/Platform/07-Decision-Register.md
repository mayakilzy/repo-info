# STR Platform — Decision Register

| ID | Status | Decision / source of authority |
|---|---|---|
| STR-01 | **Approved** | Politically, religiously, sectarianly, party-neutral Syrian-origin institution open globally |
| STR-02 | **Approved** | Four axes: economic/commercial, developmental, educational, engineering/productive; finance sustainable via real work |
| STR-03 | **Approved** | Current implementation **only main platform**; Academy then engineering tools ecosystem later |
| STR-04 | **Approved** | Independent apps/sites; platform directory and integration hub; member-contributed and external adapters possible later |
| STR-05 | **Approved** | Integration core is **built and tested** from platform v1 baseline; real provider integrations deferred |
| STR-06 | **Approved** | Open member registration email verification **and** Google sign-in |
| STR-GOV-TEAM-01 | **Approved** | Operational team only on approved project charter with appointed team lead and institutional steward; no free team creation |
| STR-07 | **Approved** | Tool/source ownership protected, no transfer of IP or unscoped secret access on integration |
| STR-08 | **Approved** | Real browser role-based testing is required; backend security remains required |
| STR-09 | **Approved** | Platform and Academy separate projects; future engineering workshop inventories existing tools before building new ones |
| STR-10 | **Approved** | Documentation/tasks live in `repo-info/SyrianTechRenaissance/Platform`; code in `SyrianTechRenaissance-Platform` |
| ADR-01 | **Recommended—implementation review** | Modular monolith; Next.js TypeScript PostgreSQL Prisma; no premature microservices |
| ADR-02 | **Recommended—implementation review** | PostgreSQL outbox/background worker in same codebase, S3-compatible object store |
| ADR-03 | **Recommended—implementation review** | Auth.js or proven secure equivalent; OAuth account-link proof and Google OIDC |
| ADR-04 | **Recommended—implementation review** | Standard capability/connector registry + jobs + events, mock integration |
| UX-01 | **Recommended—design approval** | Arabic-first and English, calm institutional design, responsive and accessible |
| GOVERNANCE-02 | **Deferred** | Formal entity, legal contracts, compensation, accounting, impact targets, production hosting details |
| TOOLS-12 | **Deferred** | Historic 12 envisioned capabilities for engineering workshop, not 12 new repos now |

## Integrity note

Do not mark proposed technical choices as founder-approved until acceptance. Latest approved user direction specifically tightened team governance, made Google signup explicit, and required actual integration readiness from inception.
