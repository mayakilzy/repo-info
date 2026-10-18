# Unified Capability Contract v1.0


> **MANARA Foundation v1.0 · 2026-10-18 · Design specification, not implemented software.**
> Canonical source: `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA`.
> Code only: `https://github.com/mayakilzy/AgentCraft-MANARA`.
> General standards: `https://github.com/mayakilzy/repo-info/tree/main/START-HERE`.

## Contract approach
An engine needs **extensive contextual documentation** akin to AgentCraft-Toolkit: stable ID, full description, multilingual aliases/keywords, many diverse positive user intents, deliberately negative use cases, output/input types, trust, license, source, relationship graph, lifecycle and operational tests. **Long docs stored once; retrieve cards via lexical/semantic shortlist before deep loading**.

## Suggested fields
- identity: `id`, `kind`, `version`, `display_name`, `description_long`, `author`, `schema_version`.
- discovery: `domains`, `subdomains`, `tags`, `keywords_ar`, `keywords_en`, `synonyms`, `task_intents`, `positive_examples[]`, `negative_examples[]`, `coverage_geographies`, `languages`.
- capabilities: `search_purposes`, `data_types`, `temporal_coverage`, `freshness_policy`, `forecast_relevance`, `output_schema`, `quality_contract`.
- execution: `connector_ids`, `input_schema`, `limits_and_pagination`, `credentials_ref` (never raw secret), `allowed_hosts`, `timeout_policy`, `retry_semantics`, `idempotency`, `health_checks`.
- governance: `source_license`, `data_reuse_rights`, `commercial_rights`, `personal_data_policy`, `tests`, `approved_by`, `security_review`, `owner_tenant`, `status`, `last_verified_at`.
- graph: `uses_connector`, `complements`, `specializes`, `replaces`, `conflicts_with`.

## Example: patent innovation search engine
**Appropriate:** trace patents related to sodium-ion batteries; compare prosthetic neural-interface filings; identify desalination inventions; analyze robotics patent filing trends; research intellectual-property activity in building materials; compare patent assignees in precision agriculture; identify patent families linked to a claimed breakthrough; find prior filings around an engineering design.

**Inappropriate:** treating patent filing as proof the invention works; assuming a granted patent is regulatory clearance; concluding market availability from claims; inferring clinical efficacy; unrestricted republication of patent figures; presenting applicant name as confirmed manufacturer; assuming each patent family is an independent invention count without deduplication.

## JSON-schema requirements
Versioned JSON Schema / Pydantic contracts, validation at ingestion and output boundary, strict required fields, typed timestamps and measurements/units; schema migrations and compatibility tests. `examples/capability_patent_intelligence.yaml` illustrates, not running software.

## Retrieval strategy and quality
1. Fast metadata/tag, location, data-type, access-rights, readiness filtering.
2. Hybrid full-text + embedding search only for candidates within authorization scope.
3. Rerank candidate engine *use-case examples* and **negative use cases** against query and gap analysis.
4. Validate current approved status and freshness; use engine or create candidate; report missing coverage.
5. Evaluate retrieval using benchmark queries and correct/missing/unneeded engine precision/recall, not subjective LLM confidence.
