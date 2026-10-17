# STR Platform v1.0 — Technical Architecture

**Status:** recommended architecture for engineering approval, not evidence of existing implementation.  
**Goal:** one institutional platform, clear modular boundaries, practical integration readiness.

## 1. Topology

```text
Browser (Arabic RTL / English, public + member + admin)
            |
        HTTPS/Proxy
            |
     Next.js Application (TypeScript)
      |       |          |          |
   Identity  Members  Projects   Integrations
      |       |          |          |
      +-------+----------+----------+
             | internal service contracts
         PostgreSQL   Object Storage
             |
       Background Worker (same codebase)
             |
       Integration Adapter / outbox
             |
   Independent services (future; not bundled)
   Academy / Engineering apps / member tools / external APIs
```

**Recommendation:** modular monolith, not microservices. Public pages, workspaces, admin and REST handlers delivered from one project. Integration worker may run as separate process/container of **same repo and version**. Durable PostgreSQL job/outbox avoids mandatory Redis/Kafka on day one.

## 2. Proposed stack (freeze after G01 feasibility)

- **Next.js + TypeScript** for web and backend route handlers.
- **PostgreSQL** as transactional store; Prisma for schema/migrations if suitability is verified.
- **Auth.js** or equivalently secure standards-compliant auth; email password hashing with a modern supported algorithm, email verification, Google OIDC and secure account linking.
- **Zod** for input/schema contracts; an explicit authorization service for object-level access.
- **Tailwind CSS + accessible UI components** with RTL, i18next/next-intl or equivalent.
- **S3-compatible object storage** for evidence/files; signed URLs scoped to permissions.
- **Vitest** for unit/integration and **Playwright** for real browsers.
- Structured JSON logs, request correlation IDs; OpenTelemetry if needed to expose actual traces.
- Docker Compose staging with reverse proxy, TLS, DB backups. No premature Kubernetes, graph database, heavy orchestration or separate Python service without demonstrated need.

## 3. Module boundaries

- `identity`: user, credentials, email verification, Google sub linking, sessions, authentication audit.
- `profiles`: profile details, skills, portfolio, consent/visibility.
- `proposals`: immutable revisions of project charters, reviewer decisions, stewardship assignment.
- `teams`: **only through approved project authorization**, membership invitations and permissions.
- `opportunities`: lifecycle, applications, reviews.
- `projects`: milestones, tasks, deliverables, revisions, acceptance.
- `organizations`: partners, representatives, partnership proposals.
- `contributions`: contributions, rights metadata and agreement references.
- `communications`: contextual threads and notifications.
- `governance`: moderator cases, approvals, audits, resource grants/suspensions.
- `impact`: derived measures with explicit source/evidence.
- `integrations`: registry, connection state, capability policy, job execution and events.

**Boundaries enforced in code**, not just folder names. Route → authenticated actor → authorization policy → module service → repository/transaction. Modules reference each other through explicit services/read models; avoid circular imports and ad hoc queries over others' tables.

## 4. Authentication and authorization

Email registration requires verification. Google OpenID Connect uses standard `state`, `nonce`, PKCE as appropriate and validates issuer/audience/expiry. Google external user ID `sub` is immutable linkage key. Existing account association requires securely authenticated proof of ownership; never silently merge just because emails match. Credential resets and account-linking events audited. Rate-limit relevant abuse paths and avoid leaking account existence.

Use hybrid **RBAC + resource-scoped checks (ABAC)**. Roles are not solely global: `actor`, `resourceOwner`, `projectMembership`, `teamMembership`, `assignedSteward`, `grantScope`, `approvalStatus`, `projectStatus`. Central `authorize(actor, action, resource)` remains fail-closed. Governance decisions retain author/reason/timestamp. Sensitive actions requiring dual control are a configurable policy, not automatically assumed for every CRUD action.

## 5. Project → team gate

Create a `ProjectProposal` before a team exists. Proposals include charter **revisions** and reviewer actions. Only an atomic `approveProjectProposal` transition may create an operational `Project` plus corresponding `Team`, with **Team Lead** and **STR Steward** assignments and minimum resource grants. Idempotence is essential: retries cannot generate duplicate teams. Approval should fail if no steward is assigned, charter is missing, approver lacks scope, resource policy is unmet, or proposal is not reviewable. Subsequent scope upgrades require a revision and approval. Suspending a project revokes tool grants and stops new jobs; treat running jobs according to documented cancellation policy.

## 6. Integration baseline

First release implements real **registry + capability definitions + connections + auth policy + jobs + events + audit**, with one internal **mock provider** demonstrating synchronous accepted job → background processing → signed/verified event → final status. External provider OAuth/token storage is abstracted; implement only methods exercised by safe mock test rather than pretending all providers work. Secure credentials encrypted at rest via secret/key-manager interface; keys never returned to clients. Provider registration and capabilities are reviewed before enabling. See `04-Integrations-Contracts.md`.

## 7. Transactional integrity / failure

- PostgreSQL constraints and transactional updates for project/team approvals, assignments, applications and grants.
- State changes check expected version / current status and reject invalid transitions.
- Outbox pattern for integration dispatch and notifications: commit state + outbox atomically, worker retries idempotently.
- Job statuses (`queued`, `running`, `succeeded`, `failed`, `cancelled`) and explicit timeout recovery; no false success on accepted requests.
- Event receipts unique by provider/event ID, authenticated and timestamp checked; replay/deduplication.
- Pagination and indexed access for listing profiles/projects/opportunities.
- Soft-delete/retention strategy with legal exceptions, no undeclared indefinite retention.

## 8. Environments & deployment

Local development with compose or isolated processes; staging separate from production; no prod credentials in staging. Components: web container, worker container from same image, PostgreSQL, object store endpoint, mail service, reverse proxy/TLS. Explicit migrations, health/readiness checks, DB and object backup/restore test, recovery runbook, rotation of signing secrets, dependency scanning, structured logs. Production domain/config intentionally unspecified until approved.

## 9. Security priorities

OWASP access controls, object-level authorization, session fixation and CSRF as applicable, brute-force protection, secure cookie attributes, upload scanning/type/size restrictions, safe object key names, SSRF defense for outgoing connector requests (allowlisted HTTPS destinations, no RFC1918/link-local/metadata/loopback), outbound timeouts, scoped credentials, webhook HMAC or verified mTLS where supported, request-id audit, ownership and licensing checks. No user-submitted code executed by STR application or worker.

## 10. Fitness rules before implementation

G01 verifies current stable versions of chosen packages, license compatibility, auth flows, deployment feasibility and testability. If a choice fails, prepare an ADR with evidence and substitute the simplest viable alternative. **Do not claim stack is finally locked until actual baseline is validated.**
