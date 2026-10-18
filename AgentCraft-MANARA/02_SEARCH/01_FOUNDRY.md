# Search Foundry — Discovery, Build, Validation


> **MANARA Foundation v1.0 · 2026-10-18 · Design specification, not implemented software.**
> Canonical source: `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA`.
> Code only: `https://github.com/mayakilzy/AgentCraft-MANARA`.
> General standards: `https://github.com/mayakilzy/repo-info/tree/main/START-HERE`.

## Prime directive
**Reuse before build:** existing approved engine → specialize query profile → compose engines → reuse connector with new profile → discover vetted source and new connector → invent code only if needed. Agent must not confuse 300 logical engines with 300 separate implementations.

## Discovery channels
Documented public APIs and OpenAPI manifests, scholarly/official domain datasets, data catalogs, vetted GitHub libraries, published MCP tool catalogs, approved extraction from permissible sites. Discovery must capture source identity, owner, date, scope, update cadence, access mode, jurisdiction, license, terms, limits, reliability, data fields and whether source is primary. Deep web is not inherently credible.

## Discover / score / justify
1. Domain-scoping agent extracts research tasks and required data types, not just search keywords.
2. Ask Registry for candidates and coverage; dedupe same URLs/organizations and avoid building duplicate adapters.
3. Search source directories and docs; evidence dossier for each source (URL, ownership, API docs, format, auth, legal status, scientific quality, quotas, sample output).
4. Human or policy review for risky access and commercial restrictions; no access rights inferred from public visibility.
5. Generate a minimal adapter strictly from documented interface and validate schemas; no running arbitrary external install scripts.
6. Sandbox test with real permitted calls, SSRF/redirect defenses, egress allowlist, encrypted secret injection, timeout/retries and rate-limit handling; record real responses and evidence.
7. Registry promotion is owner-approved, version-pinned, reversible; record test matrix and rights decision.

## Sources versus connectors versus engines
Provider `OpenAlex` → Connector `openalex-v1` (endpoint, auth, pagination, normalized works) → many specialized search capabilities (`battery-publications`, `agri-ai`, `robotics-papers`). A new search capability need not generate Python code when a tested connector and filters suffice.

## A real missing-capability example
Waste recycling first request. Mold registry has no recycling mold. Registry maybe has academic/patent tools but no reliable national waste-flow datasets. Foundry finds primary waste statistics sources and technical standards, checks license, builds one or more **new** adapters if not covered. Validator verifies data units/regions/year, originality, cross-referencing. Mold architect creates a temporary recycling investigation recipe; no predetermined completed mold.

## Security and commercial rules
Sandbox generated code unprivileged, no outbound access except allowlisted provider, no filesystem secrets, defense against malicious content or repo prompts, no untrusted dependency installation without review; secrets from vault references, not public ZIP. Strong license vetting for GPL or incompatible licenses, provider redistribution rights. Prohibit anti-bot circumvention, unauthorized credential use and indiscriminate scraping.

## Tests
Contract tests, source sample fixture checks, live opt-in check with real adapter, schema drift, tampered prompt injection, private IP / metadata URL redirects, provider rate-limiting, 429/500/backoff, wrong units and duplicate article identifiers; candidate rollback and quarantine when failed. Explicitly distinguish mocked, live and production evidence.
