<!--
Project Signature: Ayman × Nibras
Document: NEXUS Agentic Operations Architecture Specification
Purpose: Canonical reusable architecture for multi-agent transactional operational systems
Status: Engineering Baseline / Build-Ready
Date: 2026-10-01
Authority: This document is the normative architecture reference for projects built on NEXUS.
-->

# NEXUS Agentic Operations Architecture
## Detailed Universal Architecture Specification

**Repository name:** `nexus-agentic-operations-architecture`

**Canonical document:** `NEXUS_Agentic_Operations_Architecture_Specification.md`

**Architecture short name:** **NEXUS-AO**

**Meaning:** **NEXUS — Agentic Operations Architecture**. The name expresses the core purpose of the architecture: connecting intelligent agents to authoritative operational state, capabilities, resources, transactions, integrations, and humans through one controlled execution fabric.

**Document status:** Engineering baseline. This document is normative for implementation unless a later version explicitly supersedes it.

**Reference date:** 2026-10-01.

---

# 0. EXECUTIVE DIRECTIVE

This document defines a reusable, domain-neutral architecture for building **stateful, transactional, multi-agent operational systems**.

A project built on NEXUS-AO MUST NOT be treated as a chatbot with tools, a collection of independent prompts, or a thin LLM wrapper. It is an operational software system in which AI agents provide interpretation, planning, coordination, negotiation, explanation, and bounded decision support while authoritative application services, databases, business rules, authorization, and transactional controls enforce the real-world state.

The architecture MUST support domains in which a request can involve:

- multiple specialized capabilities;
- constrained resources;
- dependencies between tasks;
- concurrent requests;
- commitments and reservations;
- approvals or customer consent;
- side effects;
- partial failure;
- compensation or rollback;
- persistent customer/user preferences;
- historical feedback;
- operational monitoring;
- and continuous improvement.

The architecture MUST be reusable without rebuilding its core for every domain.

The domain-specific project supplies the **Domain Pack**: entities, capabilities, resources, workflows, policies, agents, integrations, UI, terminology, and domain rules. NEXUS-AO supplies the stable operational substrate.

## 0.1 The core execution law

Every material request MUST conceptually follow this lifecycle:

```text
REQUEST
  -> UNDERSTAND
  -> DECOMPOSE
  -> VALIDATE
  -> CAPABILITY CHECK
  -> RESOURCE CHECK
  -> CONFLICT DETECTION
  -> NEGOTIATION
  -> CUSTOMER/USER CONSENT WHEN REQUIRED
  -> COMMIT
  -> EXECUTE
  -> VERIFY
  -> DELIVER
  -> SETTLE
  -> RECORD
  -> LEARN
```

The exact names may be adapted internally, but the safety and transaction semantics MUST remain equivalent.

## 0.2 The most important architectural rule

> **An AI agent may propose, reason, coordinate, and request an action. It is never the authoritative source of truth for operational state.**

The authoritative truth hierarchy is:

1. Transactional database state and domain invariants.
2. Deterministic application/business rules.
3. Authorized tool execution results and external-system confirmations.
4. Versioned domain events and audit records.
5. Explicitly persisted memory records.
6. Retrieved knowledge/context.
7. Current agent/model output.

An LLM response MUST NOT be treated as proof that a resource exists, a reservation is available, a payment succeeded, an inventory quantity is sufficient, or an external action completed.

## 0.3 Non-negotiable implementation rule

The implementation team MUST NOT fill missing architecture with informal assumptions when this document already defines a rule. Where the document is intentionally domain-neutral, the implementation MUST use the default contract defined here and defer only the domain-specific portion to the Domain Pack.

The implementation agent MUST NOT stop and ask the user questions merely because it prefers a different technology or architecture. It SHALL follow this document. If an external dependency makes an implementation genuinely impossible, it must report the concrete blocker and the affected phase rather than silently changing the architecture.

---

# 1. ARCHITECTURE OBJECTIVE

NEXUS-AO exists to provide one reusable foundation for applications whose core business behavior is:

```text
User/Customer request
        |
        v
Interpretation
        |
        v
Coordination among capabilities
        |
        v
Validation against authoritative state
        |
        v
Resource allocation / negotiation
        |
        v
Authorized transaction
        |
        v
Execution through tools/integrations
        |
        v
Verification
        |
        v
Delivery / billing / completion
        |
        v
Memory + feedback + operational learning
```

The architecture should make a new domain primarily a **configuration and specialization exercise**, not a rewrite of the platform.

Examples of compatible domains include:

- Restaurants and hospitality.
- Hotels and guest services.
- Manufacturing and production operations.
- Automotive service centers.
- Clinics and appointment-based services.
- Home maintenance/service dispatch.
- Logistics and fulfillment.
- Laundry and garment services.
- B2B distribution and procurement.
- Education/service operations where tasks and resources must be scheduled and verified.

These examples are illustrative. The architecture is not coupled to any one industry.

---

# 2. DESIGN PRINCIPLES

## 2.1 Domain-neutral core

The core MUST contain concepts that remain valid across domains:

- Actor.
- Agent.
- Capability.
- Resource.
- Request.
- Task.
- Workflow.
- Commitment.
- Reservation.
- Transaction.
- Policy.
- Permission.
- Event.
- Memory.
- Feedback.
- Integration.
- Audit record.

Restaurant-specific concepts such as table, dish, kitchen station, or waiter MUST NOT be hard-coded into the universal core.

## 2.2 Deterministic core, probabilistic edge

LLMs are probabilistic. Business invariants cannot be.

Therefore:

- language understanding may be probabilistic;
- intent classification may be probabilistic;
- planning suggestions may be probabilistic;
- agent negotiation may be probabilistic within constraints;
- domain authorization, resource allocation, commitments, financial state, inventory state, and transaction invariants MUST be deterministic.

## 2.3 Proposal versus commitment

The architecture MUST explicitly distinguish:

- **Proposal:** a possible action/result that is not yet authoritative.
- **Hold:** a temporary protected resource allocation.
- **Consent:** explicit user/customer approval where policy requires it.
- **Commitment:** an authoritative obligation created by the system.
- **Execution:** the actual side effect.
- **Verification:** evidence that execution succeeded.

Agents MUST never blur these states.

## 2.4 No silent substitution

If a requested capability or item is unavailable, the system MUST NOT silently replace it with something else when the replacement materially changes the request, price, risk, or expected outcome.

The system may propose an alternative, but the policy engine determines whether confirmation is required.

## 2.5 No long database transactions across human or model interaction

Database transactions MUST be short-lived. A transaction MUST NOT remain open while waiting for:

- an LLM response;
- another agent;
- a user/customer response;
- an external human;
- a network dependency with unpredictable latency.

Use durable state, holds, workflow state, and idempotency rather than keeping a transaction open.

## 2.6 Explicit authority

Every agent and tool MUST have a declared authority boundary.

An agent MUST know:

- what it can read;
- what it can propose;
- what it can execute;
- what requires approval;
- what it cannot access;
- what budget it may consume;
- what entities it may mutate.

## 2.7 Composability

Capabilities MUST be exposed through stable contracts so that agents, workflows, APIs, UIs, integrations, and external systems can reuse them.

MCP is the preferred standardized model/tool integration boundary. A2A is the preferred external agent-to-agent interoperability boundary when independent agent systems must collaborate.

## 2.8 Progressive enhancement

A deployment MUST be able to run with fewer advanced components.

Reference capability levels:

- **L0:** core transactional application + one orchestrator.
- **L1:** MCP tools/resources.
- **L2:** persistent RAG/memory.
- **L3:** A2A interoperability.
- **L4:** dynamic sub-agent factory.
- **L5:** advanced durable workflow runtime and distributed event infrastructure where justified by scale.

Adding a level MUST provide measurable value. No component is introduced only because it is fashionable.

---

# 3. SYSTEM BOUNDARIES

NEXUS-AO is divided into six major planes.

```text
+---------------------------------------------------------------+
|  EXPERIENCE PLANE                                            |
|  Web / Tablet / Mobile / Voice / Staff UI / External APIs   |
+-------------------------------+-------------------------------+
                                |
+-------------------------------v-------------------------------+
|  AGENT PLANE                                                  |
|  Master Agent / Specialist Agents / Supervisors / Subagents  |
+-------------------------------+-------------------------------+
                                |
+-------------------------------v-------------------------------+
|  ORCHESTRATION PLANE                                          |
|  Swarm Engine / Routing / Handoffs / Budgets / Agent State   |
+-------------------------------+-------------------------------+
                                |
+-------------------------------v-------------------------------+
|  OPERATIONAL CORE                                             |
|  Commands / Rules / Transactions / Resources / Commitments   |
|  Requests / Tasks / Policies / Memory / Events / Audit        |
+-------------------------------+-------------------------------+
                                |
+-------------------------------v-------------------------------+
|  INTEGRATION PLANE                                            |
|  MCP / A2A / POS / Payments / ERP / KDS / Delivery / APIs   |
+-------------------------------+-------------------------------+
                                |
+-------------------------------v-------------------------------+
|  DATA + INFRASTRUCTURE PLANE                                 |
|  PostgreSQL / pgvector / Object Storage / Event Transport    |
|  Cache / Observability / Secrets / Deployment                |
+---------------------------------------------------------------+
```

## 3.1 Experience Plane

Responsible for presenting and collecting information. It MUST NOT independently implement core business invariants.

Typical technologies:

- React.
- TypeScript.
- Vite for the reference web application.
- Responsive design.
- WebSocket or Server-Sent Events where streaming is required.
- Voice adapters as optional channels.

The UI may optimistically display a proposed operation, but authoritative completion must come from backend state/events.

## 3.2 Agent Plane

Contains AI personas/roles specialized for tasks.

Agents are not domain databases. They are controlled computational actors.

## 3.3 Orchestration Plane

NEXUS-AO assumes the existing Swarm Engine is the primary reusable agent-orchestration runtime for interactive projects.

Swarm Engine responsibilities include:

- agent routing;
- segment-based execution;
- handoffs;
- streaming;
- telemetry;
- MCP bridge;
- optional RAG;
- optional A2A;
- optional sub-agent factory.

The universal architecture MUST integrate with Swarm Engine through an explicit adapter/port so that the Operational Core never becomes tightly coupled to UI-specific orchestration code.

The operational core must remain usable if a future project substitutes another agent runtime.

## 3.4 Operational Core

This is the heart of NEXUS-AO.

It owns:

- commands;
- domain state transitions;
- invariants;
- resources;
- reservations and holds;
- commitments;
- task creation;
- policy evaluation;
- authorization checks;
- idempotency;
- event publication;
- audit records;
- persistence of durable memory.

## 3.5 Integration Plane

Provides controlled connectors to:

- payment providers;
- POS systems;
- KDS/KOT systems;
- inventory systems;
- ERP/accounting platforms;
- messaging services;
- delivery systems;
- calendars;
- telephony/voice;
- external APIs;
- external agent systems.

Integrations MUST be adapters. Domain code MUST NOT directly depend on vendor-specific SDK behavior.

## 3.6 Data and Infrastructure Plane

Reference components:

- PostgreSQL 18 as transactional database.
- pgvector for initial vector search.
- S3-compatible object storage such as MinIO when self-hosting.
- NATS JetStream for durable event streaming at distributed scale.
- Redis as optional ephemeral cache/rate-limit/session acceleration layer.
- OpenTelemetry for traces, metrics, and logs.
- OpenTelemetry Collector as the telemetry aggregation layer.

The system must be deployable without all optional infrastructure in small environments.

---

# 4. REFERENCE TECHNOLOGY STACK

The following is the default implementation stack. A project SHOULD NOT replace these choices without an architectural decision record (ADR) explaining the concrete reason.

| Concern | Default | Rule |
|---|---|---|
| Agent orchestration | Swarm Engine | Reuse; do not rebuild unnecessarily |
| Frontend | React + TypeScript + Vite | Reference web client |
| Backend API | Python 3.11 + FastAPI | Stable, explicit service layer |
| Validation/contracts | Pydantic v2 + JSON Schema | Typed boundary contracts |
| ORM/data access | SQLAlchemy 2.x | Domain-independent persistence adapter |
| Migrations | Alembic | Versioned schema evolution |
| Database | PostgreSQL 18 | Transactional source of truth |
| Vector search | pgvector | Start in same transactional database |
| Event transport | NATS JetStream | Distributed/durable event transport |
| Local/small deployment events | PostgreSQL outbox + worker | Avoid mandatory message broker for tiny installs |
| Cache | Redis | Optional; never source of truth |
| Object storage | S3-compatible / MinIO | Files/media/documents |
| External agent interoperability | A2A 1.0 | Use where separate agent systems collaborate |
| Model/tool interoperability | MCP 2026.07.28-compatible | Tools/resources/prompts boundary |
| API contract | OpenAPI 3.1 | REST contract |
| Observability | OpenTelemetry | Mandatory instrumentation boundary |
| Durable workflow | Native state machine initially; Temporal when justified | Avoid premature platform complexity |
| Authorization | App policy layer first; OpenFGA adapter when needed | Fine-grained relationship authorization |
| Testing | Pytest + contract tests + integration tests + Playwright | Deterministic plus end-to-end |
| Packaging | Docker + Compose for dev/small deployments | Kubernetes optional at scale |
| CI/CD | GitHub Actions or equivalent | Automated checks required |

### 4.1 Why PostgreSQL is the default source of truth

PostgreSQL provides mature transactional semantics, concurrency controls, row-level locking, and application-controlled advisory locks. These are directly relevant to preventing race conditions around shared resources such as inventory, capacity, reservations, and commitments.

The implementation MUST use explicit concurrency controls where needed rather than assuming that two concurrent agents cannot ask for the same resource.

### 4.2 Why pgvector is the default initial RAG store

pgvector keeps embeddings alongside transactional data and supports exact and approximate nearest-neighbor search. This makes it an effective default for the first reusable implementation without requiring a separate vector database.

A separate vector database may be introduced only when scale, isolation, or query requirements justify it.

### 4.3 Why NATS JetStream is the reference distributed event transport

NATS JetStream provides persistence, replay, consumer management, and at-least-once delivery semantics. It is suitable for fan-out operational events, background agents, and scalable workers.

The core architecture MUST still define a transactional outbox so that event creation is tied safely to committed domain state.

### 4.4 Why Temporal is not mandatory on day one

Temporal is appropriate for long-running, failure-resistant workflows where execution must continue through service restarts and other failures. However, NEXUS-AO should begin with a clear explicit state machine and durable workflow records. Temporal becomes an implementation upgrade when the complexity of long-running workflows justifies it.

### 4.5 Why OpenTelemetry is mandatory

Agent systems are difficult to debug because one user request may produce model calls, agent handoffs, tool calls, database operations, external calls, retries, and background jobs. The platform must preserve correlation across this whole chain.

NEXUS-AO therefore mandates distributed tracing and structured telemetry from the beginning.

---

# 5. CORE DOMAIN MODEL

The universal core MUST define the following concepts.

## 5.1 Actor

An actor is any entity that can initiate or participate in a request.

Types include:

- human user;
- customer;
- staff member;
- service operator;
- agent;
- system;
- external organization/service.

Minimum fields:

```yaml
id: UUID
kind: enum
name: string
status: enum
metadata: object
created_at: timestamp
updated_at: timestamp
```

## 5.2 Agent

An agent is an AI or computational actor with a declared role and bounded authority.

Required manifest:

```yaml
agent_id: string
version: string
name: string
role: string
capabilities: [CapabilityRef]
read_scopes: [Scope]
write_scopes: [Scope]
tool_refs: [ToolRef]
memory_scopes: [MemoryScope]
model_policy: ModelPolicy
risk_policy: RiskPolicy
budget_policy: BudgetPolicy
max_concurrency: integer
supports_streaming: boolean
supports_a2a: boolean
status: active|draining|disabled|error
```

## 5.3 Capability

A capability is a typed business operation the system knows how to perform.

Required fields:

```yaml
id: string
version: string
name: string
description: string
input_schema: JSONSchema
output_schema: JSONSchema
preconditions: [RuleRef]
required_resources: [ResourceRequirement]
side_effect_class: none|low|medium|high|critical
authorization_scope: string
requires_consent: boolean
supports_dry_run: boolean
supports_compensation: boolean
idempotency_required: boolean
timeout_ms: integer
retry_policy: RetryPolicy
```

## 5.4 Resource

A resource is anything constrained by capacity, availability, quantity, exclusivity, or ownership.

Examples across domains:

- physical asset;
- employee/staff member;
- room;
- table;
- machine;
- inventory quantity;
- service slot;
- delivery slot;
- budget;
- payment limit;
- compute worker;
- external API quota.

Required model:

```yaml
id: UUID
type: string
capacity: number|null
unit: string|null
location_id: UUID|null
status: available|reserved|occupied|maintenance|disabled
constraints: object
version: integer
```

## 5.5 Resource Hold

A resource hold is a temporary protected allocation before commitment.

Required fields:

```yaml
hold_id: UUID
resource_id: UUID
quantity: number
request_id: UUID
expires_at: timestamp
status: active|consumed|released|expired
created_by: actor_id
```

Holds MUST have finite expiry unless explicitly converted into a commitment.

## 5.6 Request

A request is the authoritative record of what an actor asked the system to accomplish.

```yaml
request_id: UUID
actor_id: UUID
channel: web|mobile|voice|staff|api|agent|other
raw_input: text|structured
normalized_intent: object
status: RequestStatus
priority: enum
created_at: timestamp
correlation_id: UUID
```

The original user statement MUST be retained for audit/context unless privacy policy forbids retention.

## 5.7 Task

A task is an executable unit created from a request or workflow.

```yaml
task_id: UUID
request_id: UUID
capability_id: string
assigned_agent_id: string|null
status: TaskStatus
input: object
result: object|null
required_resources: [ResourceRequirement]
depends_on: [task_id]
retry_count: integer
created_at: timestamp
started_at: timestamp|null
completed_at: timestamp|null
```

## 5.8 Commitment

A commitment is a durable operational promise made by the system.

It MUST exist only after all required conditions are satisfied.

```yaml
commitment_id: UUID
request_id: UUID
status: proposed|committed|executing|fulfilled|cancelled|failed|compensating|compensated
terms: object
resource_holds: [hold_id]
consent_record_id: UUID|null
authority_actor_id: UUID
created_at: timestamp
```

## 5.9 Workflow

A workflow is a durable state machine coordinating tasks, waits, retries, deadlines, and compensation.

The workflow MUST be resumable from persisted state.

## 5.10 Event

Every significant state transition MUST be represented as a versioned event.

Canonical event envelope:

```json
{
  "event_id": "uuid",
  "event_type": "request.created",
  "schema_version": "1.0",
  "occurred_at": "timestamp",
  "tenant_id": "uuid",
  "aggregate_type": "request",
  "aggregate_id": "uuid",
  "aggregate_version": 7,
  "correlation_id": "uuid",
  "causation_id": "uuid|null",
  "actor": {
    "kind": "human|agent|system|external",
    "id": "string"
  },
  "payload": {}
}
```

## 5.11 Memory

Memory is persisted information intended for future reasoning.

It is not the same thing as transactional state.

Memory types:

- semantic preference;
- factual profile;
- interaction summary;
- learned operational pattern;
- domain knowledge;
- policy/context;
- episodic history reference.

Memory MUST have provenance, scope, confidence, lifecycle, and deletion semantics.

## 5.12 Feedback

Feedback is an observation from a user, operator, sensor, system, or evaluation process.

Feedback MUST NOT automatically overwrite durable preferences on first occurrence.

The system SHOULD use repeated evidence/confidence rules before promoting an observation into a strong persistent preference.

---

# 6. STATE MACHINES

## 6.1 Request lifecycle

Canonical states:

```text
RECEIVED
  -> INTERPRETED
  -> PLANNED
  -> VALIDATING
  -> CAPABILITY_CHECKED
  -> RESOURCE_CHECKED
  -> NEGOTIATING
  -> AWAITING_CONSENT
  -> COMMITTING
  -> COMMITTED
  -> EXECUTING
  -> VERIFYING
  -> DELIVERED
  -> SETTLED
  -> LEARNED
```

Alternative terminal/error states:

```text
REJECTED
CANCELLED
EXPIRED
FAILED
COMPENSATING
COMPENSATED
PARTIALLY_FULFILLED
```

Not every request must traverse every state. The implementation may skip states that are not applicable, but it must never skip a mandatory safety gate for the relevant risk class.

## 6.2 Task lifecycle

```text
PENDING
-> READY
-> CLAIMED
-> RUNNING
-> SUCCEEDED
```

Failure transitions:

```text
RUNNING -> RETRY_PENDING
RUNNING -> FAILED
FAILED -> COMPENSATING
FAILED -> ABANDONED
```

## 6.3 Resource lifecycle

Resource states are domain-specific but MUST distinguish availability from temporary hold and actual consumption.

Example:

```text
AVAILABLE
-> HELD
-> COMMITTED
-> IN_USE
-> RELEASED
```

## 6.4 Agent lifecycle

```text
REGISTERED
-> HEALTHY
-> BUSY
-> DRAINING
-> DISABLED
```

Dynamic sub-agents MUST automatically expire unless explicitly promoted to permanent status.

---

# 7. COMMAND / QUERY / EVENT MODEL

The Operational Core SHOULD follow CQRS-inspired separation even if a separate read database is not yet required.

## 7.1 Commands

Commands request state changes.

Examples:

- `CreateRequest`
- `ReserveResource`
- `ReleaseHold`
- `CreateTask`
- `CommitRequest`
- `StartTask`
- `CompleteTask`
- `CancelCommitment`
- `RecordConsent`
- `RecordFeedback`
- `SetPreference`

Every command MUST pass through validation and authorization.

## 7.2 Queries

Queries read state and MUST have no side effects.

## 7.3 Events

Events describe completed facts.

A command is an intention. An event is an observed state change.

The system MUST NOT publish an event claiming success before the corresponding authoritative state change has committed.

---

# 8. TRANSACTIONAL SAFETY

This section is mandatory.

## 8.1 Idempotency

Any side-effecting operation that may be retried MUST support an idempotency key.

The minimum key components should be:

```text
tenant + operation_type + client/request id + logical attempt key
```

Repeated requests using the same idempotency key MUST return the same logical result or a deterministic status rather than performing the side effect twice.

## 8.2 Optimistic concurrency

Entities with concurrent mutation MUST include a version number.

An update MUST fail or retry if the version changed unexpectedly.

## 8.3 Pessimistic locking

Where resource uniqueness is critical, the application MUST use the appropriate database row locks, advisory locks, unique constraints, or serializable transaction semantics.

Examples:

- double booking;
- overselling inventory;
- assigning one exclusive worker to two tasks;
- issuing two payment captures;
- consuming the same one-time reservation.

## 8.4 Consistent lock ordering

When multiple resources must be locked, the implementation MUST establish a deterministic global ordering to reduce deadlocks.

The system MUST retry safe transactions when deadlocks occur.

## 8.5 Outbox pattern

Domain state change and event creation MUST be atomically linked.

Recommended flow:

```text
BEGIN
  update authoritative tables
  insert outbox event
COMMIT

outbox worker
  -> publish event to NATS/other transport
  -> mark outbox record published
```

This prevents the failure mode where the database commits but the event is lost.

## 8.6 No transaction around user consent

Do not keep a SQL transaction open while asking a user to confirm something.

Instead:

```text
validate
-> create expiring hold / proposal
-> persist awaiting-consent state
-> ask user
-> on response open a new transaction
-> verify hold still valid
-> commit or release
```

## 8.7 Monetary state

Financial amounts MUST use exact decimal representations, not floating-point values.

Every monetary operation MUST record:

- currency;
- amount before;
- amount after;
- reason;
- actor;
- authorization scope;
- correlation/request ID;
- external provider reference where applicable.

---

# 9. AGENT ARCHITECTURE

## 9.1 Agent types

NEXUS-AO recognizes these generic categories:

### Master / Coordinator Agent

Interprets the user request, orchestrates specialist capabilities, communicates status, requests consent, and keeps the user experience coherent.

It MUST NOT directly bypass Operational Core rules.

### Specialist Agent

Owns expertise for a bounded capability domain.

Examples are domain-specific, such as scheduling, inventory, finance, quality, or fulfillment.

### Supervisor Agent

Monitors other agents and system-level patterns. It may recommend corrective actions or trigger bounded operations according to policy.

### Ephemeral Sub-Agent

Created for temporary workload or specialization gaps.

Every ephemeral agent MUST have:

- parent agent;
- purpose;
- scope;
- tools;
- time-to-live;
- budget;
- permissions;
- retirement condition.

### Human Escalation Agent / Interface

Represents workflows that require staff or human review.

## 9.2 Agent registration

Every agent MUST register a machine-readable manifest.

The registry MUST expose health, capability, version, authority, and capacity information.

## 9.3 Agent messages

Agent messages MUST be structured wherever they affect system behavior.

Use a schema such as:

```json
{
  "message_type": "capability_result",
  "request_id": "uuid",
  "task_id": "uuid",
  "status": "available|unavailable|proposed|failed",
  "result": {},
  "constraints": [],
  "alternatives": [],
  "evidence_refs": [],
  "requires_consent": false
}
```

Natural-language text MAY be included for presentation, but business decisions must consume structured fields.

---

# 10. CAPABILITY SYSTEM

The capability system is one of the defining parts of NEXUS-AO.

## 10.1 Capability registry

The registry MUST support discovery of:

- capability name;
- description;
- input/output schema;
- required resources;
- preconditions;
- policy constraints;
- side-effect class;
- authorization;
- execution handler;
- compensation strategy;
- version.

## 10.2 Capability check

Before a commitment is made, the orchestrator MUST ask the capability system whether the requested operation is currently possible.

An agent saying “I can do that” is not capability verification.

Capability verification MUST be grounded in actual registered operations and current state.

## 10.3 Capability composition

Capabilities may be composed into a workflow.

For example:

```text
A
 -> B + C
 -> D
 -> verify B and C
 -> D
```

The system MUST represent dependencies explicitly.

## 10.4 Capability versioning

A capability change that modifies input/output semantics MUST create a new schema/version or an explicitly backward-compatible version.

Historical events MUST remain interpretable under their recorded schema version.

---

# 11. RESOURCE AND CAPACITY MANAGEMENT

## 11.1 Resource requirements

Every task that consumes a constrained resource MUST declare the requirement explicitly.

Example:

```yaml
resource_type: service_slot
quantity: 1
location: location-7
window:
  start: 2026-10-01T14:00:00Z
  end: 2026-10-01T15:00:00Z
exclusive: true
```

## 11.2 Resource availability

Availability MUST be computed from authoritative state, not model memory.

## 11.3 Reservations versus holds

A hold is provisional and expiring.

A reservation/commitment is authoritative.

The implementation MUST never confuse the two.

## 11.4 Resource conflicts

If two requests compete for the same exclusive resource, the system MUST resolve according to deterministic policy:

1. Hard constraints.
2. Authorization/priority rules.
3. Time constraints.
4. Customer/user commitments already made.
5. Business-configured priority.
6. Explicit human resolution if no automatic rule applies.

The LLM may help explain or negotiate but may not override hard constraints.

---

# 12. NEGOTIATION ENGINE

Negotiation is not casual agent conversation. It is a structured constraint-resolution process.

## 12.1 Negotiation inputs

A negotiation record MUST identify:

- requested outcome;
- hard constraints;
- soft preferences;
- resources;
- deadlines;
- cost constraints;
- authority;
- unacceptable substitutions;
- fallback options.

## 12.2 Negotiation result

Possible outputs:

```text
ACCEPT
REJECT
PROPOSE_ALTERNATIVE
PARTIAL_ACCEPT
WAIT
REQUIRES_HUMAN
```

## 12.3 Agent disagreement

Two agents MUST NOT resolve a material conflict merely by choosing the last speaker.

The conflict must become a structured negotiation or escalation record.

## 12.4 Customer/user consent

Consent is required when the selected resolution materially changes:

- price;
- requested product/service;
- timing beyond configured tolerance;
- privacy or sensitive information use;
- financial commitments;
- high-risk actions;
- explicitly rejected preferences.

The exact categories are domain-configurable but MUST preserve the principle.

---

# 13. POLICY AND GUARDRAIL ENGINE

The policy engine evaluates actions before execution.

## 13.1 Risk classes

Default classes:

- **R0 — Read only:** search, display, calculate.
- **R1 — Low side effect:** notes, temporary context, non-sensitive preference proposal.
- **R2 — Moderate side effect:** create/cancel ordinary operational task, change schedule within limits.
- **R3 — High side effect:** financial adjustment, price change, significant operational commitment.
- **R4 — Critical:** irreversible financial actions, destructive bulk changes, high-impact external actions.

## 13.2 Approval policy

Default behavior:

```text
R0 -> automatic
R1 -> automatic if authorized
R2 -> automatic only under explicit policy
R3 -> confirmation/dual control when configured
R4 -> explicit human approval required
```

The implementation MUST make this configurable per capability and tenant/domain.

## 13.3 Policy decision record

Every denied, approved, or escalated side-effecting action MUST record:

- policy version;
- actor;
- agent;
- capability;
- target;
- decision;
- reason codes;
- timestamp;
- correlation ID.

---

# 14. MCP INTEGRATION

NEXUS-AO SHOULD implement MCP-compatible tool and resource servers/clients.

The 2026-07-28 MCP specification defines standardized primitives for tools, resources, and prompts, and current MCP architecture is stateless at the protocol level with explicit request metadata. Tool execution may be model-controlled, but implementations are expected to preserve security and human-control mechanisms.

## 14.1 MCP role in NEXUS

MCP is the preferred boundary for exposing operational capabilities to agents when the capability naturally maps to tool/resource semantics.

Examples:

- `get_resource_availability`
- `create_hold`
- `release_hold`
- `search_customer_memory`
- `get_inventory`
- `request_payment`
- `create_task`
- `get_workflow_status`

## 14.2 Tool definition requirements

Every tool MUST define:

- name;
- title/description;
- JSON Schema input;
- output schema where feasible;
- authorization scope;
- risk class;
- idempotency requirements;
- timeout;
- side-effect classification;
- audit behavior;
- compensation behavior if relevant.

## 14.3 Tool execution gate

MCP tool invocation MUST pass through the NEXUS authorization/policy layer before side effects.

The model must never bypass the policy layer by calling vendor APIs directly.

## 14.4 Tool discovery

The agent should receive only the tools necessary for the current task where practical.

Mission-scoped tool exposure reduces unnecessary context, cost, attack surface, and accidental invocation.

---

# 15. A2A INTEGRATION

A2A is the interoperability boundary for independent agent systems.

The currently released A2A specification is 1.0. A2A is designed for agents to discover capabilities and collaborate across agent-system boundaries without forcing them to expose their internal implementation details.

## 15.1 Use A2A for

- cross-organization agent collaboration;
- external specialized agents;
- independent agent deployments;
- future federated systems.

## 15.2 Do not use A2A for

Every internal function call.

Internal services should use direct typed APIs, commands, event messages, or MCP where appropriate.

Using A2A for everything would add unnecessary network/protocol complexity.

## 15.3 A2A adapter

The architecture MUST keep A2A behind an adapter so the core remains independent of protocol-specific transport details.

---

# 16. RAG AND KNOWLEDGE

## 16.1 RAG is not transaction state

RAG supplies contextual knowledge. It does not replace the operational database.

A retrieved document cannot prove that a resource is currently available.

## 16.2 Initial RAG implementation

Use PostgreSQL + pgvector for the first reference implementation.

Required metadata:

```yaml
document_id
chunk_id
source
source_version
tenant_id
permissions
created_at
updated_at
content_hash
embedding_model
embedding_version
```

## 16.3 Retrieval pipeline

```text
query
 -> normalize
 -> permission filter
 -> semantic/hybrid retrieval
 -> rerank if configured
 -> evidence package
 -> agent context
```

## 16.4 Evidence requirement

When an agent makes a statement based on retrieved knowledge, the response context should preserve source references.

## 16.5 Memory versus RAG

Use memory for facts about actors/preferences/previous interactions that are intentionally persisted.

Use RAG for external/domain knowledge and documents.

Use the transactional database for current state.

These three must remain conceptually separate.

---

# 17. MEMORY ARCHITECTURE

Memory is a first-class component because repeated interaction creates cumulative value.

## 17.1 Memory categories

### Preference memory

Example generic form:

```yaml
subject_id: actor-123
preference: "prefers option X"
strength: 0.82
source_count: 7
last_confirmed_at: timestamp
scope: domain/service
sensitivity: normal|sensitive
user_control: editable|deletable
```

### Episodic memory

Stores references to past interactions, outcomes, and important episodes.

### Semantic memory

General knowledge about the user/customer or operational context.

### Operational memory

Repeated patterns detected by the operations layer.

## 17.2 Memory confidence

The system SHOULD distinguish:

- observed once;
- repeated;
- explicitly confirmed;
- stale;
- contradicted;
- revoked.

## 17.3 Memory governance

Users/customers must have controls to:

- view;
- edit;
- delete;
- revoke consent for stored preferences;
- correct incorrect information.

Sensitive preferences MUST have stricter access controls.

---

# 18. EVENT-DRIVEN OPERATIONS

## 18.1 Event categories

Minimum categories:

```text
request.*
task.*
workflow.*
resource.*
commitment.*
agent.*
tool.*
policy.*
memory.*
feedback.*
integration.*
audit.*
```

## 18.2 Event consumers

Consumers may include:

- analytics;
- operations monitoring;
- feedback analysis;
- notifications;
- audit pipelines;
- billing reconciliation;
- background agents;
- dashboards.

## 18.3 At-least-once delivery

Consumers MUST be idempotent.

Do not assume exactly-once delivery from the transport.

## 18.4 Event replay

The event model should support replay where operationally useful.

Replay MUST NOT accidentally re-execute irreversible side effects. Replaying a projection is not the same as replaying a command.

---

# 19. OBSERVABILITY

OpenTelemetry is mandatory for the reference implementation.

## 19.1 Trace hierarchy

A typical trace should look like:

```text
user.request
  ├─ agent.interpretation
  ├─ agent.handoff
  ├─ capability.check
  ├─ resource.check
  ├─ policy.evaluate
  ├─ tool.call
  │    ├─ database.query
  │    └─ external.http
  ├─ task.execution
  ├─ verification
  └─ response.delivery
```

## 19.2 Required correlation IDs

All operations should propagate:

- `trace_id`;
- `span_id`;
- `request_id`;
- `correlation_id`;
- `causation_id`;
- `tenant_id`;
- `agent_id` when applicable;
- `workflow_id` when applicable;
- `task_id` when applicable.

## 19.3 Metrics

Mandatory baseline metrics:

### System

- request rate;
- error rate;
- latency;
- queue depth;
- workflow duration;
- event lag.

### Agent

- model calls;
- token usage if available;
- cost estimate;
- handoffs;
- tool calls;
- tool failures;
- retries;
- task success rate;
- average reasoning/response latency.

### Operational

- resource utilization;
- failed commitments;
- negotiation failures;
- approval rates;
- cancellation rates;
- compensation count;
- SLA violations.

## 19.4 Sensitive data

Do not place raw secrets, payment credentials, authentication tokens, or unnecessary sensitive personal data in traces or logs.

Use redaction and attribute allowlists.

---

# 20. AUTHORIZATION AND SECURITY

## 20.1 Multi-tenant boundary

Every tenant-owned operational entity MUST carry tenant scope or be reachable through a guaranteed tenant relationship.

Tenant isolation MUST be enforced server-side.

The client must never be trusted to provide a safe tenant boundary.

## 20.2 Authorization layers

Authorization operates at three levels:

1. **Identity:** who is acting?
2. **Relationship/policy:** what may this actor access?
3. **Action authority:** may this actor/agent perform this operation on this resource now?

## 20.3 Agent authorization

Agents MUST be treated as principals with explicit permissions.

OpenFGA may be used where relationship-based or fine-grained authorization becomes significant, especially for multi-tenant or complex object relationships.

## 20.4 Secrets

Secrets MUST NOT be embedded in prompts, source code, event payloads, or database records that do not require them.

Use environment variables for development and a proper secret-management adapter for production.

## 20.5 Prompt injection defense

External documents and tool outputs MUST be treated as untrusted content.

The system MUST distinguish:

- instructions from trusted system policy;
- user requests;
- retrieved content;
- tool output;
- third-party text.

Retrieved text MUST NOT silently alter the agent's authority.

---

# 21. HUMAN-IN-THE-LOOP

Human intervention is a normal architectural capability, not a failure mode.

## 21.1 Human intervention triggers

Examples:

- high-risk action;
- unresolved resource conflict;
- policy ambiguity;
- external system disagreement;
- fraud/suspicion condition;
- customer complaint;
- irreversible action;
- low-confidence interpretation in a consequential workflow.

## 21.2 Intervention record

A human decision MUST record:

- actor;
- role;
- decision;
- reason;
- affected request/task/commitment;
- timestamp;
- policy version.

## 21.3 Resume behavior

After human action, the workflow must resume from a durable state rather than relying on conversational memory.

---

# 22. ERROR HANDLING AND COMPENSATION

## 22.1 Error taxonomy

Minimum categories:

- validation error;
- authorization error;
- capability unavailable;
- resource unavailable;
- external dependency failure;
- timeout;
- transient database conflict;
- model failure;
- policy rejection;
- user cancellation;
- irreversible external failure.

## 22.2 Retry policy

Only operations known to be retry-safe may be automatically retried.

Every retry policy MUST specify:

- max attempts;
- backoff;
- jitter;
- retryable error classes;
- idempotency behavior.

## 22.3 Compensation

When a multi-step workflow partially succeeds, the system should execute compensating actions where supported.

Compensation is not guaranteed rollback of the physical world. It is a new controlled action intended to restore an acceptable logical/business state.

## 22.4 Partial completion

The system MUST explicitly represent partial completion.

It must never tell the user “completed” when only part of the commitment succeeded.

---

# 23. DYNAMIC SUB-AGENT FACTORY

Dynamic agents are allowed but controlled.

## 23.1 Spawn criteria

An agent MAY be spawned only when one or more of these conditions are met:

- sustained workload exceeds policy threshold;
- current agent lacks a needed specialization;
- a task requires isolation;
- parallelism materially reduces latency;
- domain complexity justifies a dedicated context.

The system MUST NOT spawn agents merely because doing so is technically possible.

## 23.2 Sub-agent contract

Every spawned sub-agent MUST specify:

```yaml
purpose
parent_agent
allowed_tools
allowed_scopes
input_schema
output_schema
ttl
max_cost
max_concurrency
termination_condition
promotion_policy
```

## 23.3 Promotion

An ephemeral agent may be promoted to permanent status only through an explicit rule or operator action backed by evidence of recurring value.

---

# 24. WORKFLOW ENGINE

## 24.1 Initial implementation

Implement workflows as durable application state machines with persisted state.

A workflow record MUST contain:

- workflow ID;
- definition version;
- current state;
- pending tasks;
- deadlines;
- retries;
- waiting reason;
- correlation IDs;
- compensation state.

## 24.2 Temporal upgrade trigger

Temporal SHOULD be introduced when the project demonstrates a real need for:

- very long-running workflows;
- cross-service durable execution;
- complex timers/signals;
- restart-resistant workflows beyond what the current engine provides;
- operational tooling around workflow histories.

Do not add Temporal solely because it is a recognized technology.

---

# 25. API CONTRACTS

## 25.1 REST

The reference backend exposes a versioned REST API under `/api/v1`.

Minimum groups:

```text
/auth
/actors
/agents
/capabilities
/resources
/requests
/tasks
/workflows
/commitments
/memory
/feedback
/events
/integrations
/health
```

## 25.2 Streaming

The system SHOULD provide SSE for:

- agent output;
- workflow state updates;
- task progress;
- tool activity when safe to expose;
- notifications.

WebSocket may be used where bidirectional low-latency interaction requires it.

## 25.3 Structured errors

Every API error MUST return:

```json
{
  "code": "RESOURCE_UNAVAILABLE",
  "message": "Human-readable explanation",
  "details": {},
  "request_id": "uuid",
  "retryable": false
}
```

---

# 26. DIRECTORY / REPOSITORY STANDARD

The reference implementation SHOULD follow this layout:

```text
nexus-agentic-operations/
|
+-- README.md
+-- LICENSE
+-- ARCHITECTURE_VERSION
+-- pyproject.toml
+-- package.json
|
+-- docs/
|   +-- NEXUS_Agentic_Operations_Architecture_Specification.md
|   +-- adr/
|   +-- domain-integration-guide.md
|   +-- security-model.md
|   +-- deployment-guide.md
|
+-- schemas/
|   +-- events/
|   +-- commands/
|   +-- api/
|   +-- agent-manifests/
|   +-- capability-manifests/
|   +-- tool-manifests/
|
+-- backend/
|   +-- app/
|   |   +-- api/
|   |   +-- domain/
|   |   +-- application/
|   |   +-- infrastructure/
|   |   +-- agents/
|   |   +-- workflows/
|   |   +-- policies/
|   |   +-- memory/
|   |   +-- integrations/
|   |   +-- observability/
|   |   +-- main.py
|   +-- migrations/
|   +-- tests/
|
+-- frontend/
|   +-- src/
|   +-- tests/
|
+-- mcp/
|   +-- servers/
|   +-- clients/
|
+-- a2a/
|   +-- adapters/
|   +-- cards/
|
+-- deploy/
|   +-- docker/
|   +-- compose/
|   +-- production/
|
+-- scripts/
+-- examples/
+-- fixtures/
```

## 26.1 Clean Architecture rule

Dependencies point inward toward domain/application contracts.

Infrastructure MUST implement interfaces rather than becoming the domain.

LLM SDKs, MCP SDKs, payment SDKs, external APIs, and database clients belong at infrastructure/integration boundaries.

---

# 27. DOMAIN PACK MODEL

Every application built on NEXUS-AO must keep domain-specific material separate.

A Domain Pack contains:

```text
Domain Pack
|
+-- domain entities
+-- domain terminology
+-- capabilities
+-- resource types
+-- business rules
+-- workflows
+-- agents
+-- tool mappings
+-- integrations
+-- UI components
+-- policies
+-- test scenarios
+-- seed data
```

The universal core should not be modified merely to add a new domain feature.

If a feature is genuinely reusable, it must first be proven to be domain-neutral and then introduced into the core through an ADR and versioned architecture update.

---

# 28. REFERENCE EXECUTION FLOW

This is the canonical implementation pattern.

```text
1. User submits request.
2. Experience layer creates Request record.
3. Orchestrator receives Request ID.
4. Master Agent interprets request.
5. Agent creates a structured plan.
6. Capability Registry validates required capabilities.
7. Operational Core checks authoritative state.
8. Resource Manager computes availability.
9. Conflicts are detected.
10. Specialists negotiate feasible options.
11. Policy Engine evaluates proposed action.
12. Consent gate asks user when required.
13. A short transaction revalidates conditions.
14. Holds are converted into commitments.
15. Tasks are dispatched.
16. Tools execute through authorized adapters.
17. Results are verified.
18. Events are persisted and published.
19. User receives status and result.
20. Feedback and memory are recorded according to policy.
21. Operations layer observes the workflow and updates metrics/patterns.
```

Every step must be traceable to the originating request.

---

# 29. REFERENCE FAILURE FLOW

Example:

```text
Customer request
   |
   v
Capability available? ---- NO ----> propose alternative / reject
   |
  YES
   |
Resource available? ------ NO ----> negotiation / wait / alternative
   |
  YES
   |
Consent required? -------- YES ---> ask user
   |                                  |
  NO                                  +-- reject -> release holds
   |                                  |
   +----------------------------<-----+
   |
Commit
   |
Execute
   |
External system fails
   |
Retryable? -- YES --> retry with idempotency
   |
   NO
   |
Compensation possible? -- YES --> compensate
   |
   NO
   |
Partial failure / human escalation
```

---

# 30. TESTING STRATEGY

Testing is part of the architecture, not a later activity.

## 30.1 Unit tests

Required for:

- business rules;
- policy rules;
- state transitions;
- resource allocation;
- pricing calculations;
- authorization decisions;
- idempotency handlers.

## 30.2 Contract tests

Required for:

- API schemas;
- event schemas;
- MCP tools;
- A2A adapters;
- integration interfaces.

## 30.3 Integration tests

Must test PostgreSQL transactions, locking, outbox, event delivery, and external adapter behavior.

## 30.4 Concurrency tests

Mandatory scenarios:

- two requests for one exclusive resource;
- multiple inventory consumers;
- concurrent payment attempt;
- duplicate webhook;
- duplicate command;
- lost event retry;
- stale optimistic-concurrency version;
- deadlock retry.

## 30.5 Agent behavior tests

Agent tests MUST validate structured outcomes, not exact wording.

Test questions such as:

- Did the agent call the correct capability?
- Did it avoid unauthorized tools?
- Did it ask for consent when required?
- Did it avoid claiming success before verification?
- Did it preserve user constraints?
- Did it produce a structured failure when a resource was unavailable?

## 30.6 End-to-end tests

The test harness MUST exercise complete workflows through the UI/API and verify final database state plus event/audit state.

## 30.7 Chaos/failure tests

At higher maturity levels test:

- agent worker crash;
- message redelivery;
- database restart;
- external API timeout;
- partial integration outage;
- stale holds;
- network partition between non-critical components.

---

# 31. SECURITY TESTING

Mandatory tests include:

- tenant isolation;
- authorization bypass attempts;
- tool scope escalation;
- prompt injection through retrieved content;
- malicious tool output;
- replay of side-effecting requests;
- forged webhook;
- duplicated payment callback;
- exposure of hidden memory;
- unauthorized access to sensitive preferences.

The system should assume every external content source is potentially hostile.

---

# 32. PERFORMANCE AND SCALE MODEL

NEXUS-AO is designed to scale from a tiny deployment to a large multi-location operation.

## 32.1 Small deployment

Minimum practical stack:

```text
Frontend
Backend API
PostgreSQL + pgvector
Background worker
Object storage if needed
```

NATS, Redis, Temporal, and OpenFGA can remain disabled if not justified.

## 32.2 Medium deployment

Add:

- NATS JetStream;
- Redis where useful;
- dedicated workers;
- OpenTelemetry Collector;
- multiple agent workers;
- background analytics.

## 32.3 Large deployment

May add:

- Temporal;
- dedicated event-processing workers;
- read replicas;
- separate search infrastructure;
- stronger authorization service;
- dedicated integration gateways;
- regional deployment;
- advanced rate limiting;
- workload-based sub-agent pools.

The domain model must remain the same.

---

# 33. COST CONTROL

Agent systems can become expensive if every task is sent to a large reasoning model.

NEXUS-AO therefore requires model-routing policy.

## 33.1 Model classes

At minimum define:

- lightweight/fast model for classification, extraction, simple routing;
- general model for normal reasoning;
- high-capability model for complex negotiation/planning where necessary.

## 33.2 Token/context control

Agents MUST receive only the context required for the active mission.

The platform should avoid:

- sending every database record into context;
- exposing every tool on every turn;
- duplicating long histories;
- re-sending unchanged documents.

## 33.3 Budget telemetry

Every model interaction should record, where the provider exposes it:

- input tokens;
- output tokens;
- cached tokens;
- latency;
- model identifier;
- estimated cost.

---

# 34. DATA RETENTION

The system MUST define retention by data class.

Recommended classes:

```text
transactional records -> long-term operational retention
financial records      -> domain/legal policy
audit records          -> immutable retention policy
telemetry              -> bounded retention
conversation raw text  -> configurable / privacy governed
memory                 -> user-controlled lifecycle
vector embeddings      -> delete when source is deleted where policy requires
temporary holds        -> short TTL
```

Deletion must propagate to derived stores where applicable.

---

# 35. VERSIONING

NEXUS-AO requires version identifiers for:

- architecture;
- database schema;
- event schemas;
- capability contracts;
- tool contracts;
- agent manifests;
- workflow definitions;
- memory schemas.

## 35.1 Semantic compatibility

Breaking changes MUST increment a major version.

Backward-compatible additions should use minor versions.

Bug/security fixes use patch versions.

## 35.2 Migration rule

A new architecture version must include:

- migration notes;
- compatibility statement;
- changed contracts;
- tests;
- impact assessment.

---

# 36. DECISION AUTHORITY / ARCHITECTURAL HIERARCHY

When implementation choices appear to conflict, use this priority order:

```text
1. Safety and data integrity
2. Transactional correctness
3. Explicit requirement in this document
4. Domain Pack rules
5. Security and authorization
6. Maintainability
7. Performance
8. Cost optimization
9. Developer convenience
10. Novelty / fashion
```

A technically exciting solution that weakens data integrity is rejected.

---

# 37. THINGS THE IMPLEMENTATION MUST NOT DO

The implementation MUST NOT:

1. Put business truth inside prompts.
2. Let the LLM directly mutate the database without controlled commands.
3. Trust an LLM statement that an action succeeded.
4. Hold database transactions while waiting for users or models.
5. Use conversation history as the only durable workflow state.
6. Allow unrestricted tool access to every agent.
7. Silently replace a user request with a different material outcome.
8. Make irreversible actions idempotency-free.
9. Treat Redis/cache/vector stores as the authoritative source of current operational state.
10. Make the architecture dependent on one model vendor.
11. Introduce Kubernetes, Temporal, a separate vector database, a separate graph database, or another large subsystem without demonstrated need.
12. duplicate generic capabilities inside multiple domain agents.
13. create permanent sub-agents without evidence and policy.
14. expose secrets to model context unnecessarily.
15. mark workflows complete without verification.

---

# 38. ENGINEERING GUIDANCE FOR THE DEVELOPMENT MODEL

This section is intentionally direct. A coding agent receiving this document should use it as an implementation contract.

## 38.1 Operating mode

The development model SHALL:

- read the entire document before modifying code;
- build from the bottom of the architecture upward;
- preserve domain neutrality;
- create tests alongside each capability;
- use typed contracts rather than implicit dictionaries where practical;
- keep implementation decisions traceable;
- avoid speculative features;
- prefer the smallest implementation that satisfies the architecture.

## 38.2 Do not ask avoidable questions

Do not ask whether to use another framework when the document has chosen one.

Do not ask whether database state should be authoritative: PostgreSQL is authoritative by design.

Do not ask whether the LLM may bypass transaction checks: it may not.

Do not ask whether MCP/A2A are the primary interoperability boundaries: they are defined above.

Do not ask whether the project should add unrelated product features: domain features belong in the Domain Pack.

When a detail is domain-specific, implement the universal contract and create an explicit extension point for the Domain Pack.

## 38.3 When a conflict is discovered

Use this sequence:

```text
identify conflict
-> locate authoritative rule
-> prefer higher-priority rule
-> implement deterministic behavior
-> add regression test
-> document an ADR only if the conflict requires a permanent architecture change
```

## 38.4 No silent architecture drift

The implementation MUST NOT quietly replace:

- PostgreSQL with an arbitrary database;
- Swarm Engine with a different orchestration runtime;
- MCP with proprietary tool wiring;
- A2A with an ad-hoc external agent protocol;
- the outbox with direct best-effort event emission.

Alternative technology is allowed only through an ADR and compatibility layer.

---

# 39. IMPLEMENTATION PHASES

The architecture should be built in controlled phases. Each phase has a gate. Do not jump ahead merely because code can be generated faster than architecture can be verified.

## Phase 0 — Reconnaissance and Baseline

Deliver:

- architecture repository initialized;
- version marker;
- project signature;
- current tool/runtime inventory;
- dependency policy;
- ADR mechanism;
- local development instructions;
- baseline CI.

Acceptance:

- clean checkout works;
- tests run;
- lint/type checks run;
- no unknown architectural dependency remains.

## Phase 1 — Contracts and Schemas

Implement:

- IDs;
- common result/error model;
- command schemas;
- event envelope;
- agent manifest;
- capability manifest;
- tool manifest;
- resource requirements;
- request/task/workflow schemas.

Acceptance:

- all schemas validate;
- schema versioning works;
- contract tests exist.

## Phase 2 — PostgreSQL Operational Core

Implement:

- database models;
- Alembic migrations;
- tenant boundaries;
- request/task/resource/hold/commitment tables;
- optimistic concurrency;
- relevant row/advisory locks;
- idempotency store;
- audit records.

Acceptance:

- concurrent reservation tests pass;
- duplicate commands do not double-apply;
- stale versions fail safely;
- transaction boundaries are short.

## Phase 3 — Command and Policy Layer

Implement:

- command bus;
- query service;
- policy engine;
- authorization checks;
- risk classes;
- consent records;
- structured errors.

Acceptance:

- unauthorized operations fail;
- high-risk operations cannot bypass policy;
- approvals are durable.

## Phase 4 — Event and Outbox Infrastructure

Implement:

- outbox table;
- publisher;
- idempotent consumers;
- event replay tools;
- NATS adapter where deployment requires it.

Acceptance:

- committed state always generates corresponding outbox event;
- consumer redelivery is safe;
- replay does not repeat destructive side effects.

## Phase 5 — Workflow Engine

Implement:

- durable workflow records;
- explicit state machine;
- retries;
- deadlines;
- waiting state;
- compensation hooks.

Acceptance:

- process restart resumes workflow correctly;
- human consent does not hold DB transaction;
- partial failure is represented accurately.

## Phase 6 — Swarm Engine Adapter

Integrate the existing Swarm Engine as the agent orchestration layer.

Implement:

- request-to-agent routing;
- agent manifest registration;
- structured handoffs;
- execution context;
- budget policy;
- trace propagation;
- Operational Core command access through tools/typed services.

Acceptance:

- agent cannot bypass policy;
- structured task handoff works;
- streaming is separated from authoritative state.

## Phase 7 — MCP Layer

Implement:

- secure tool registry;
- tool schemas;
- tool authorization;
- audit hooks;
- resource exposure;
- tool invocation telemetry;
- human confirmation integration.

Acceptance:

- tools are discoverable;
- unauthorized tools are invisible/blocked as policy requires;
- side effects pass through the command/policy gate.

## Phase 8 — RAG and Memory

Implement:

- pgvector;
- document ingestion;
- chunk metadata;
- permission-aware retrieval;
- memory store;
- preference confidence;
- deletion/correction APIs.

Acceptance:

- current state never depends on vector retrieval;
- memory can be corrected/deleted;
- retrieval respects permissions.

## Phase 9 — Observability

Implement:

- OpenTelemetry tracing;
- metrics;
- structured logs;
- correlation IDs;
- model/tool spans;
- dashboards/diagnostic views.

Acceptance:

- one request can be traced end-to-end;
- agent handoffs and tool calls are visible;
- sensitive information is redacted.

## Phase 10 — A2A and External Integrations

Implement A2A and external integration adapters only after the internal core is stable.

Acceptance:

- external agent cannot bypass internal policy;
- adapter failures are isolated;
- external state is verified before commitment.

## Phase 11 — Dynamic Sub-Agent Factory

Implement:

- workload metrics;
- spawn policy;
- TTL;
- budgets;
- scope restrictions;
- promotion policy.

Acceptance:

- no uncontrolled agent explosion;
- expired agents disappear safely;
- spawned agents cannot exceed parent permissions.

## Phase 12 — Production Hardening

Implement:

- deployment profiles;
- backup/restore;
- secrets management;
- rate limits;
- security tests;
- disaster recovery procedures;
- concurrency/chaos tests;
- migration rollback strategy.

Acceptance:

- documented restore succeeds;
- security tests pass;
- operational runbook exists.

---

# 40. PHASE CHECKPOINT RULE

After every major phase the development model MUST create:

1. a concise completion report;
2. a test report;
3. a list of files changed;
4. any ADRs created;
5. a version/tag or zip snapshot when the host workflow uses file handoffs.

The report MUST state what is complete and what is intentionally deferred.

Do not declare a phase complete because code merely exists. It is complete only when its acceptance criteria pass.

---

# 41. REFERENCE MINIMUM VIABLE CORE

A compliant first implementation must have, at minimum:

```text
PostgreSQL
FastAPI
Pydantic
SQLAlchemy
Alembic
Command layer
Policy layer
Resource model
Request/Task/Workflow model
Commitment model
Idempotency
Outbox
Audit
OpenTelemetry boundary
Swarm Engine adapter
MCP boundary
```

The following are optional at first deployment:

```text
NATS JetStream
Redis
Temporal
OpenFGA
A2A
advanced search
multiple model providers
```

Optional does not mean architecturally ignored. The interfaces must exist so they can be introduced later without redesigning the core.

---

# 42. MINIMUM REFERENCE USER JOURNEY

The first vertical slice should implement one complete request through every important architectural layer.

Example generic service request:

```text
User asks for a service at a specified time.
        |
        v
Master Agent understands request.
        |
        v
Capability Registry confirms service capability.
        |
        v
Resource Manager finds feasible resource(s).
        |
        v
Policy Engine checks constraints.
        |
        v
System proposes verified option.
        |
        v
User confirms when required.
        |
        v
Commitment transaction is created.
        |
        v
Task is created.
        |
        v
Specialist agent executes through authorized tool.
        |
        v
External result is verified.
        |
        v
Task and commitment are completed.
        |
        v
Events + audit + memory/feedback recorded.
```

This vertical slice is the architectural proving ground.

---

# 43. DEFINITION OF DONE — ARCHITECTURE LEVEL

NEXUS-AO is considered implementation-ready when:

- all core entities have typed contracts;
- state transitions are explicit;
- authorization is enforced server-side;
- capability/resource checks are authoritative;
- commits are transactional;
- retries are idempotent;
- outbox/event behavior is reliable;
- workflows survive process restarts;
- agent permissions are bounded;
- MCP tools are policy-controlled;
- RAG is separate from current state;
- memory has lifecycle/consent rules;
- observability spans the request chain;
- concurrency tests cover critical resources;
- domain-specific behavior is isolated in the Domain Pack;
- no major core behavior depends on prompt wording alone.

---

# 44. ARCHITECTURE EXTENSION RULE

A feature may enter the universal core only if all of the following are true:

1. It applies meaningfully to at least two different domains.
2. It can be expressed without domain-specific nouns.
3. It does not weaken transactional integrity.
4. It has a stable contract.
5. It has tests.
6. It does not duplicate existing capabilities.
7. It reduces total system complexity rather than merely moving it.
8. It has an explicit owner and lifecycle.

Otherwise, the feature belongs in the Domain Pack.

This rule exists specifically to prevent architecture bloat.

---

# 45. FINAL DESIGN POSITION

NEXUS-AO is not an “AI architecture” in the narrow sense.

It is an **operational transaction architecture in which AI agents are first-class bounded participants**.

The central innovation is not the existence of multiple agents. Multi-agent systems already exist.

The architectural distinction is the combination of:

```text
Agents
+
Capabilities
+
Resources
+
State
+
Transactions
+
Commitments
+
Negotiation
+
Authorization
+
Human consent
+
Durable workflows
+
Persistent memory
+
Feedback
+
Event-driven operations
+
Observability
+
Interoperability
```

This combination permits an application to behave as an operational system rather than a collection of conversational AI features.

The architecture therefore aims to make intelligence **useful, accountable, auditable, composable, and operationally trustworthy**.

---

# 46. NON-GOALS

NEXUS-AO does not attempt to define:

- a universal UI design system;
- a single LLM vendor;
- a single voice provider;
- a universal business process for every industry;
- an ERP replacement by default;
- a mandatory microservices architecture;
- mandatory Kubernetes;
- mandatory Temporal;
- mandatory graph databases;
- mandatory vector databases outside PostgreSQL;
- an autonomous system with unrestricted real-world authority.

Those choices belong to deployments and Domain Packs.

---

# 47. REFERENCE TECHNOLOGY NOTES (CURRENT AS OF 2026-10-01)

## MCP

The current MCP specification referenced by this architecture is the 2026-07-28 specification. It defines Resources, Prompts, and Tools as core primitives and describes a stateless protocol model in which each request carries protocol/client metadata. Tool servers may expose dynamically changing tools and may restrict visibility according to authorization.

## A2A

The A2A project currently identifies 1.0.0 as its latest released version. A2A is intended for agent interoperability and capability discovery across independent agent systems.

## PostgreSQL

PostgreSQL 18 is a current supported major release. Its documented explicit-locking facilities include row-level locks and advisory locks, which are relevant to NEXUS resource contention and concurrency control.

## pgvector

pgvector provides vector similarity search directly inside PostgreSQL and supports exact and approximate nearest-neighbor operations.

## NATS JetStream

JetStream provides persistent streams, replay, consumers, and at-least-once delivery behavior suitable for distributed event processing.

## Temporal

Temporal provides durable workflow execution using workflow histories and worker processes. NEXUS recommends it as a later upgrade where workflow requirements justify the added operational component.

## OpenTelemetry

OpenTelemetry is the mandatory telemetry boundary. NEXUS should use current OpenTelemetry semantic conventions for AI/agent operations where applicable, while maintaining project-specific correlation attributes.

## OpenFGA

OpenFGA offers relationship-based authorization patterns and explicitly documents use cases for agent authorization, RAG authorization, and MCP authorization. NEXUS treats it as an adapter, not a mandatory dependency for every deployment.

---

# 48. REFERENCES

The following references are normative technology references, not domain requirements.

- Model Context Protocol specification 2026-07-28: https://github.com/modelcontextprotocol/modelcontextprotocol/tree/main/docs/specification/2026-07-28
- MCP tools: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx
- MCP resources: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/resources.mdx
- MCP architecture/changelog: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/architecture/index.mdx
- A2A specification: https://github.com/a2aproject/A2A/blob/main/docs/specification.md
- PostgreSQL 18 explicit locking: https://www.postgresql.org/docs/18/explicit-locking.html
- pgvector: https://github.com/pgvector/pgvector
- NATS JetStream: https://docs.nats.io/reference/2.12/jetstream
- Temporal: https://docs.temporal.io/temporal
- OpenTelemetry traces: https://opentelemetry.io/docs/concepts/signals/traces/
- OpenTelemetry GenAI semantic conventions: https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/
- OpenFGA: https://openfga.dev/docs/fga

---

# 49. CANONICAL IMPLEMENTATION COMMAND

When this architecture is supplied to a development model together with a Domain Pack, the intended instruction is:

> **This document is the normative architecture specification. Build the system according to it. Do not redesign the architecture, do not replace core technology choices without an ADR, do not invent missing domain rules, and do not ask avoidable questions. Implement the phases in order, satisfy every acceptance gate, preserve domain neutrality, reuse the existing Swarm Engine where specified, and treat PostgreSQL/business rules/transactional services as authoritative.**

The Domain Pack then specifies the actual industry/project behavior.

---

# 50. ARCHITECTURE SIGNATURE

**NEXUS-AO**

**Ayman × Nibras**

**Purpose:** A reusable foundation for building intelligent transactional operational systems in which AI agents coordinate real capabilities and resources under deterministic business rules, transaction safety, human consent, auditable execution, persistent memory, and interoperable tooling.

**Architecture status:** Build-ready baseline.

**Next document:** `NEXUS_RESTAURANT_DOMAIN_SPECIFICATION.md` — the restaurant implementation/domain specification. It MUST specialize NEXUS-AO and MUST NOT duplicate/redefine the universal architecture.
