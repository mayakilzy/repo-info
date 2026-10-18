# Security, Access, Secrets, Rights & Isolation


> **MANARA Foundation v1.0 · 2026-10-18 · Design specification, not implemented software.**
> Canonical source: `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA`.
> Code only: `https://github.com/mayakilzy/AgentCraft-MANARA`.
> General standards: `https://github.com/mayakilzy/repo-info/tree/main/START-HERE`.

## Critical observation at package creation (2026-10-18)
GitHub connector reports **both** `mayakilzy/AgentCraft-MANARA` and `mayakilzy/repo-info` as `public`. A file `repo-info/START-HERE/GeneralGH.zip` is present and the owner describes it as containing credentials/tokens. **Treat any real secrets in a public GitHub artifact or git history as compromised**. Rotate/revoke affected credentials, remove public availability AND inspect commit history; removing file alone does not invalidate exposed secrets. This package intentionally does NOT read, reproduce, validate or include any credential bytes. Location provided solely to explain the hazard, NOT permission to ingest publicly exposed secrets.

## Credential access for GLM
Use GitHub App/OAuth or scoped credentials supplied **privately and ephemerally** through an approved secrets manager or developer environment variables. Minimum repository permissions, branch protections and no token echo in logs. Confirm login and read/write permissions on target repos before mutations. `GeneralGH.zip` is **not** an approved source of secrets. Never depend on ZIP embedded tokens or replicate them. If secrets not available, record access blocker, continue read-only/design checks and report it.

## Source / connector isolation
All discovered/untrusted remote text considered hostile; sanitize prompt injection, enforce SSRF protection including private, loopback/link-local/metadata, DNS rebinding, redirects and protocol restrictions; egress allowlists, secret separation, no arbitrary system commands. Generated connectors tested isolated; review code/dependencies/licenses, establish allowed hosts, enforce bounded operations and approval for prod activation. Prohibit unlicensed extraction/scraping and illicit access.

## Tenant and customer data
Scoped IDs and authorization in every query/update, row-level isolation when practical, no leaked embedding search, no private customer material promoted to global knowledge without permission, private file encryption at rest and appropriate deletion/retention policies. Source rights distinguish reading, analysis, caching, derivative reuse and commercial redistribution.

## Operational discipline
Reproducible dependencies, pinned versions, SBOM/license inventory and security tests. Keep secret-free `.env.example`. No credentials/keys in Markdown, logs, screenshots, ZIP. Generic global closure mission must execute only after owner explicitly marks current session complete.

## Human approval
Owner approves (a) new code/connector production promotions after tests/security/license review, (b) material architecture deviation, (c) customer-facing high-stakes publication and untested forecasting probabilities. Sandboxed automatic creation is encouraged; uncontrolled prod activation is not.
