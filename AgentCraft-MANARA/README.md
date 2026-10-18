# MANARA | منارة — Engineering Foundation & Missions v1.0

> **We research the future, then help you see it.**  
> **نبحث في المستقبل، ثم نجعلك تراه.**

**Status:** Approved product vision translated into a proposed engineering blueprint. No application functionality is claimed implemented. Documents are specifications, examples, and acceptance criteria, not test evidence.

## The four permanent principles
1. Build **one reusable intelligence machine**; domain molds are configured/composed, not cloned source code.
2. **Search Foundry + verified Capability Registry** are core intellectual property; discover/reuse before building.
3. An unknown domain must be served through a **temporary investigation mold**, new source/connector discovery where required, specialist agents on demand, rigorous evidence, forecasting, and a useful finished output.
4. Each investigation leaves **reusable, traceable knowledge and recipes**—with tenant privacy, licenses, security, immutable history and honest uncertainty.

## Source of truth and repositories
- Application code: https://github.com/mayakilzy/AgentCraft-MANARA.git
- Information and missions: https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA
- Global onboarding: https://github.com/mayakilzy/repo-info/tree/main/START-HERE
- Global standard ZIP: https://github.com/mayakilzy/repo-info/blob/main/START-HERE/START-HERE.zip
- Credential-related reference: https://github.com/mayakilzy/repo-info/blob/main/START-HERE/GeneralGH.zip **DO NOT DOWNLOAD OR EXECUTE AS A NORMAL DEPENDENCY.** See `SECURITY/ACCESS_POLICY.md` for mandatory safety precautions. These public repositories are not places for secrets.

## Read order
1. `START-HERE.md` (mission for implementer)
2. Global `START-HERE/START-HERE-README.md` and AADS v1.2 (owner-approved version)
3. `00_PRODUCT/01_CHARTER.md`, `00_PRODUCT/02_USER_JOURNEYS.md`, `01_ARCHITECTURE/01_MASTER.md`
4. `01_ARCHITECTURE/02_CONTRACTS.md`, `02_SEARCH/01_FOUNDRY.md`, `02_SEARCH/02_REGISTRY.md`
5. `03_INTELLIGENCE/*`, `04_OUTPUTS/*`, `SECURITY/*`, `05_ACCEPTANCE/*`
6. `ROADMAP.md` and `MISSIONS/INDEX.md`; execute only G00 initially.

## Delivery contract
Every mission delivers: commit SHA, changed files, real test commands/results, end-to-end evidence where relevant, known limitations, rollback/recovery notes, next mission. Never call mocks a live verification.

## Docs are separate from code
All documents in this ZIP upload to the **info repository subfolder** `AgentCraft-MANARA/` (the ZIP already has this top-level directory). Implementer creates actual code in the **application repository**. Do not commit duplicate specs into the code repo unless a short generated link/index is necessary.
