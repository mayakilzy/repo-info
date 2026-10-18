# START HERE — MANARA G00 Initial Implementer Mission

## 0 — Identity & authority
You are the implementation engineer (GLM or equivalent) for **MANARA**, an adaptive intelligence research and evidence-based foresight factory—not a generic chat app, aggregator, or large swarm demo. This package is **the engineering specification**. The owner approves scope changes. No existing product code is presumed.

**Canonical code repository:** https://github.com/mayakilzy/AgentCraft-MANARA.git  
**Missions/specs:** https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA  
**General instructions:** https://github.com/mayakilzy/repo-info/tree/main/START-HERE  
**General onboarding readme:** https://github.com/mayakilzy/repo-info/blob/main/START-HERE/START-HERE-README.md  
**Global standards archive:** https://github.com/mayakilzy/repo-info/blob/main/START-HERE/START-HERE.zip  
**Sensitive-looking archive location:** https://github.com/mayakilzy/repo-info/blob/main/START-HERE/GeneralGH.zip — **NOT an approved credential delivery mechanism. Do not load/copy secrets from public repos. Ask owner to use private secrets manager and revoke any exposed tokens.**

## 1 — Read / verify before touching code
1. Verify real GitHub repository HEAD/default branch/access via authenticated connector/CLI; confirm repo could be empty.
2. Read `START-HERE/START-HERE-README.md`, unpack only the non-secret `START-HERE.zip` into a *local temporary sandbox* and read `AgentCraft_Application_Development_Standard_AADS_v1.2.md`, `TOOLKIT_READ_ONLY_CONSUMER_POLICY.md`, and `UNIVERSAL_SECURITY_CLEANUP_AND_SAFE_SESSION_CLOSURE.md` (the last only for closure at owner declaration).
3. **Do not assume global standards ZIP's contents were audited as part of this package.** If it is inaccessible, record blocker and proceed only with non-conflicting foundations; do not pretend AADS read.
4. Read all product, architecture, security, acceptance and G00 mission documents; write a short evidence-backed understanding, contradictions/gaps, and bounded G00 plan.
5. Follow `AgentCraft-Toolkit` read-only policy. Existing toolkit repository `https://github.com/mayakilzy/AgentCraft-Toolkit` is *never writable* from MANARA. Check capabilities before reinventing; do not introduce dependency without checking license, maturity and fit.

## 2 — Working rules
- **All code/test/runtime/docker/assets in main application repo**. All mission texts, specifications, reports under info repo `AgentCraft-MANARA`. Never write code into info repo.
- Respect approved invariants: one core + interchangeable domain molds + temporary investigations; source / connector / search engine are distinct; reusable agent recipes; temporal evidence & uncertainty; security and tenant boundaries; reports and ethical visuals.
- Preserve reusable capabilities in a registry. Capability descriptions should be extensive: keywords/aliases (ar/en), task examples, non-use cases, contracts, trust and provenance.
- Use real source/connector checks once live integration begins. No fabricated test counts, SHAs, screenshots, token values or product readiness.
- **No hardcoded secrets**, no production deployment from generated adapters, no permissions escalation. Sandbox generated code; production promotion requires explicit approval following technical/security/license review.
- Keep core small. Start with a real end-to-end thin slice; no Kafka/Kubernetes/Neo4j/microservice sprawl without demonstrated need. No arbitrary token/time constraints for experiments; maintain necessary operational security controls and prevent runaway execution.
- The owner should approve deviations/major choices; resolve ordinary implementation details autonomously.

## 3 — Initial mission = G00 only
1. Inspect both repositories and global standards; record actual state. Do not assume existing source code.
2. Bootstrap concise Python 3.12+ FastAPI backend and TypeScript React/Vite frontend *only if consistent with inspected AADS*. PostgreSQL architecture for actual evidence persistence; lightweight dev variant permitted if integration is ready. Use Docker Compose dev environment if available; avoid inventing working Docker evidence where unavailable.
3. Establish clean layered modules and stable typed interfaces for Source, Connector, SearchCapability, DomainMold, AgentRecipe, Evidence, Forecast, Investigation; contract/schema tests and API smoke test.
4. Add a simple status endpoint, one mock/stub discovery view clearly labeled synthetic; NO claims of real search or forecasts yet.
5. Set up lint/typecheck/test and env example without tokens. Document commands, coverage as measured, and local instructions.
6. Provide implementation map for G01 with small milestones, ensure code is on app repo and reports in missions info repo.

## 4 — G00 acceptance evidence
- Current repo heads, exact commits/branch; credible setup guide; dependencies/licenses enumerated; no secrets in tracked files/history introduced; service can start (if environment supports runtime) and test suite result is real.
- Data contracts accepted by tests; one end-to-end request through thin app scaffold; API errors explicit; no fake production features.
- Report blockers honestly and offer safe alternatives. End with a concise G00 handoff report containing blockers and G01 next action.

## 5 — Do not prematurely perform
Do NOT execute all groups in one uncontrolled session. Do NOT invent API access, scrape prohibited sites, deploy production, or mark the core factory functional until end-to-end proof. Do NOT execute global session cleanup until the owner explicitly declares session complete.
