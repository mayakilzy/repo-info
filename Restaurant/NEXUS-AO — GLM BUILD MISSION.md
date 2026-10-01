# NEXUS-AO — GLM BUILD MISSION

## Mission Identity

You are the principal implementation engineer responsible for building **NEXUS-AO — NEXUS Agentic Operations Architecture**.

The complete and authoritative architecture specification is provided as:

`NEXUS_Agentic_Operations_Architecture_Specification.md`

This file is the **normative engineering contract** for this mission.

Your task is to transform that specification into a **real, executable, tested, reusable software architecture**.

You are not being asked to design a new architecture.

You are not being asked to build a restaurant application.

You are not being asked to create a conceptual prototype.

You are being asked to **implement NEXUS-AO itself** so that an independent external project can later import and use it as its operational foundation.

---

# 1. AUTHORITY OF THE SPECIFICATION

Treat the supplied NEXUS-AO specification as the primary engineering authority.

Read the **entire document before making architectural implementation decisions or writing core code**.

Do not rely on isolated sections while ignoring later sections.

The complete specification defines:

* architecture;
* boundaries;
* responsibilities;
* technology direction;
* data model;
* transactional rules;
* agent model;
* capability model;
* resource model;
* commitment model;
* workflow semantics;
* authorization;
* events;
* memory;
* MCP;
* A2A;
* observability;
* testing;
* failure handling;
* implementation phases;
* acceptance criteria;
* non-goals;
* and technology constraints.

Later sections of the document may refine or constrain earlier concepts.

Read the entire specification first and build an internal implementation model before beginning substantial implementation.

---

# 2. PRIMARY OBJECTIVE

The final result must be a reusable implementation of NEXUS-AO that can serve as the foundation for multiple future domains.

The architecture must be capable of supporting domain implementations such as:

* restaurants;
* hotels;
* manufacturing;
* maintenance services;
* logistics;
* fulfillment;
* clinics;
* B2B operations;
* and other transactional operational domains.

The core must therefore remain **domain-neutral**.

Do not introduce restaurant-specific concepts into the NEXUS-AO core.

Do not introduce hotel-specific concepts into the NEXUS-AO core.

Do not optimize the core around one domain merely because the first intended deployment is a restaurant.

The future restaurant project will consume NEXUS-AO as an external implementation.

---

# 3. IMPORTANT DISTINCTION

NEXUS-AO consists of a reusable operational substrate.

The future Restaurant Domain will be a consumer of that substrate.

The architecture relationship is:

NEXUS-AO
↓
Domain Pack
↓
Domain Application

For this mission:

* NEXUS-AO = TARGET
* Restaurant Domain = OUT OF SCOPE
* Restaurant UI = OUT OF SCOPE
* Restaurant agents = OUT OF SCOPE
* Restaurant business rules = OUT OF SCOPE
* Restaurant database seed data = OUT OF SCOPE

Do not implement the restaurant during this mission.

---

# 4. DO NOT REDESIGN THE ARCHITECTURE

Do not replace architectural decisions merely because you personally prefer another design.

Do not simplify the architecture by removing important mechanisms merely to make the first implementation easier.

Do not add an unrelated framework because it appears modern.

Do not convert the project into a generic AI framework.

Do not turn NEXUS-AO into a chatbot framework.

Do not turn NEXUS-AO into an LLM wrapper.

Do not turn NEXUS-AO into a collection of prompts.

Implement the architecture defined by the specification.

---

# 5. CONTROLLED ENGINEERING DISCRETION

You are allowed to make implementation-level decisions that are not explicitly specified.

Examples include:

* exact module names where the specification does not mandate them;
* internal helper functions;
* code organization details;
* test fixture structure;
* naming of private implementation details;
* local developer tooling;
* non-architectural refactoring.

However, any decision that changes:

* architectural boundaries;
* public contracts;
* persistence semantics;
* transaction semantics;
* authorization semantics;
* event contracts;
* agent responsibilities;
* external protocols;
* dependency strategy;
* core technology direction;

must not be silently changed.

When such a change appears necessary, record it as an **ADR (Architecture Decision Record)** and explain:

1. the original requirement;
2. the problem encountered;
3. the proposed change;
4. why the change is necessary;
5. alternatives considered;
6. impact on compatibility;
7. tests added to protect the decision.

Prefer resolving implementation problems without changing architecture.

---

# 6. NO AVOIDABLE QUESTIONS

Do not stop implementation to ask questions that can be answered by:

* the architecture specification;
* normal engineering reasoning;
* established conventions;
* the repository state;
* existing code;
* official documentation of the selected technology;
* or a safe implementation default.

The purpose of supplying the architecture specification is precisely to eliminate unnecessary design discussion.

If a reasonable implementation decision is possible from the available information, make it and document it.

Do not repeatedly ask for permission to perform normal implementation work.

---

# 7. EXCEPTION: REAL BLOCKERS

Do not invent certainty.

If you encounter a genuine blocker that makes implementation impossible or unsafe, do not guess silently.

Classify it as one of:

### A. Specification conflict

Two requirements contradict one another.

### B. Missing mandatory requirement

A required behavior cannot be derived safely from the specification.

### C. External dependency failure

A required technology, package, service, or environment is unavailable.

### D. Security or data-integrity risk

Proceeding would create a meaningful risk of corrupting state, bypassing authorization, breaking transaction safety, or violating a core invariant.

### E. Implementation defect

The specification is coherent, but the current implementation approach is incorrect.

For each blocker, document the exact evidence and the smallest safe resolution.

Do not conceal blockers.

Do not invent undocumented behavior simply to make tests pass.

---

# 8. PHASE-DRIVEN IMPLEMENTATION

Follow the implementation phases defined by the NEXUS-AO specification in order.

Do not jump randomly between advanced features.

Do not implement optional infrastructure before the foundational contracts are stable.

The implementation order must move from:

foundation
→ domain-neutral core
→ persistence
→ transactional semantics
→ capabilities/resources/commitments
→ orchestration
→ events
→ integrations
→ agents
→ observability
→ advanced protocols
→ hardening

Use the exact phase structure and acceptance gates in the specification as the authoritative ordering.

---

# 9. PHASE GATES ARE MANDATORY

At the end of every implementation phase:

1. Run the required tests.
2. Run all relevant existing regression tests.
3. Verify the phase acceptance criteria individually.
4. Verify that no earlier capability has regressed.
5. Review the generated implementation against the specification.
6. Record the result in a checkpoint report.
7. Only then proceed to the next phase.

A phase is not complete because its code exists.

A phase is complete only when:

**Implementation + Tests + Acceptance Criteria + Regression Safety + Checkpoint = PASS**

---

# 10. CHECKPOINT REPORTING

After each phase, produce a concise but technically complete checkpoint report.

Every checkpoint must contain:

* phase number;
* phase name;
* implemented components;
* files/modules created;
* files/modules modified;
* tests created;
* tests executed;
* test result;
* acceptance criteria status;
* known limitations;
* ADRs created, if any;
* unresolved issues;
* dependency changes;
* database/schema changes;
* architectural compliance statement.

Do not claim PASS when an acceptance criterion is not actually verified.

Use:

* PASS
* FAIL
* BLOCKED
* NOT APPLICABLE

Do not use vague statuses such as “mostly done” or “looks good”.

---

# 11. TESTING PHILOSOPHY

Testing must prove behavior, not merely code coverage.

The implementation must include appropriate tests for:

* unit behavior;
* contract behavior;
* integration behavior;
* persistence behavior;
* transactional behavior;
* concurrency;
* authorization;
* failure handling;
* retry behavior;
* idempotency;
* event behavior;
* agent boundaries;
* protocol adapters;
* observability;
* and end-to-end workflows.

Where the architecture defines an invariant, write a test that would fail if that invariant were broken.

Where the architecture defines a lifecycle, test the lifecycle.

Where the architecture defines a state transition, test valid and invalid transitions.

---

# 12. TRANSACTIONAL SAFETY IS NON-NEGOTIABLE

The implementation must never depend on an LLM to enforce financial, inventory, reservation, resource, or concurrency invariants.

AI agents may propose operations.

Authoritative application services and transactional persistence must enforce operations.

Pay particular attention to:

* race conditions;
* double booking;
* duplicate commitments;
* overselling;
* concurrent resource allocation;
* inconsistent state after failure;
* duplicate event processing;
* retry-induced duplication;
* partial completion;
* compensation;
* idempotency.

Concurrency tests are mandatory where resource contention exists.

---

# 13. AGENTS MUST NOT BECOME THE DATABASE

Never allow an agent's conversational state to become the authoritative operational state.

Never rely on:

* model memory;
* prompt state;
* generated text;
* tool-call history;
* or conversation history

as the authoritative source of operational truth.

Authoritative state must live in the appropriate persistence and business-rule layer defined by the architecture.

Agents must consume authoritative state and request controlled state changes.

---

# 14. SWARM ENGINE BOUNDARY

The existing Swarm Engine, where available and specified, must remain an orchestration component.

Do not duplicate Swarm Engine functionality unnecessarily inside NEXUS-AO.

Do not turn NEXUS-AO into a replacement for Swarm Engine.

Do not move authoritative operational state into Swarm Engine.

Maintain the separation:

# Swarm Engine

Agent orchestration

# NEXUS-AO

Operational state, transaction semantics, capabilities, resources, commitments, rules, integrations, authorization, and execution controls.

If the repository contains existing Swarm Engine code or package references, inspect it carefully before implementing overlapping functionality.

Reuse where the specification explicitly requires reuse.

---

# 15. TECHNOLOGY IMPLEMENTATION

Implement the technology direction defined by the specification.

Do not replace:

* PostgreSQL-based transactional persistence;
* OpenTelemetry-based observability;
* MCP integration boundaries;
* A2A integration boundaries;
* pgvector usage where specified;
* event infrastructure where specified;
* authorization boundaries;
* or other explicitly selected technologies

without a documented architectural reason.

Optional infrastructure such as Temporal or OpenFGA must not be introduced merely because it exists.

Respect the architecture's principle of:

**Use a technology when its problem exists.**

Do not create operational complexity without an actual requirement.

---

# 16. DATABASE IMPLEMENTATION

The database schema must reflect the authoritative domain-neutral operational model defined by NEXUS-AO.

Implement:

* primary keys;
* foreign keys;
* unique constraints;
* check constraints where appropriate;
* indexes;
* lifecycle state constraints;
* transaction boundaries;
* timestamps;
* audit metadata;
* correlation identifiers;
* idempotency identifiers where required;
* version/concurrency controls where required.

Do not rely exclusively on application-level validation where the database can enforce an important invariant safely.

Database migrations must be reproducible.

---

# 17. PUBLIC CONTRACTS

Treat public interfaces as contracts.

Examples include:

* service interfaces;
* command interfaces;
* query interfaces;
* event schemas;
* tool definitions;
* agent capability declarations;
* API contracts;
* protocol adapters.

Do not casually change public structures after they are established.

When a contract changes, update:

1. implementation;
2. tests;
3. documentation;
4. compatibility handling where required.

---

# 18. ERROR HANDLING

Every important operation must have explicit handling for:

* invalid input;
* unavailable capability;
* unavailable resource;
* conflicting request;
* authorization failure;
* timeout;
* downstream failure;
* persistence failure;
* duplicate request;
* partial execution;
* cancellation;
* retry;
* compensation.

Do not hide failures behind generic success responses.

Do not convert operational failure into conversational success merely because an agent can produce a reassuring sentence.

---

# 19. OBSERVABILITY

The final architecture must make important execution traceable.

At minimum, preserve useful correlation among:

* request;
* workflow;
* agent;
* tool call;
* database operation where appropriate;
* resource allocation;
* commitment;
* event;
* external integration;
* error;
* and final outcome.

Use OpenTelemetry at the defined architecture boundary.

Observability must be designed so that a future operator can reconstruct:

“What happened?”

“Which component acted?”

“Why was the action taken?”

“What state existed before it?”

“What changed?”

“What failed?”

“What happened next?”

---

# 20. SECURITY AND AUTHORIZATION

Never use “the agent decided it was allowed” as an authorization mechanism.

Authorization must be enforced outside the model.

Respect:

* identity;
* roles;
* permissions;
* resource ownership;
* action scope;
* tenant/domain isolation;
* sensitive data boundaries;
* tool permissions;
* high-risk action controls.

Agents may interpret authorization context, but enforcement must remain deterministic.

---

# 21. MCP IMPLEMENTATION RULE

MCP is an interoperability boundary.

A tool exposed through MCP must still obey:

* authorization;
* validation;
* transactional rules;
* business rules;
* audit requirements;
* idempotency;
* failure handling.

An MCP server must never become an uncontrolled escape hatch around the operational core.

---

# 22. A2A IMPLEMENTATION RULE

A2A is an interoperability boundary between independent agents/systems.

Do not use A2A as an excuse to fragment every internal function into network services.

Use internal composition where internal composition is sufficient.

Use A2A where independent agent interoperability actually exists or is required by the architecture.

---

# 23. MEMORY

Implement persistent memory only according to the architecture.

Separate:

* operational truth;
* durable user/customer preferences;
* historical events;
* semantic knowledge;
* transient conversational context.

Never mix these categories into a single uncontrolled memory store.

Do not allow semantic memory to override authoritative operational state.

---

# 24. FAILURE AND RECOVERY

The implementation must assume failures will occur.

Design and test:

* process crash;
* request retry;
* worker restart;
* database transaction failure;
* event delivery failure;
* tool failure;
* downstream service timeout;
* duplicate delivery;
* partially completed workflow;
* unavailable integration;
* interrupted agent execution.

The expected behavior after recovery must be deterministic and explainable.

---

# 25. REFERENCE IMPLEMENTATION TEST

Before declaring NEXUS-AO complete, create or maintain a minimal **domain-neutral reference scenario** proving that the architecture can be consumed without embedding restaurant logic.

The scenario should exercise the essential operational chain using generic concepts such as:

* request;
* capability;
* resource;
* commitment;
* workflow;
* execution;
* completion.

This is not a product feature.

It is an architectural conformance test.

Its purpose is to prove:

> NEXUS-AO can actually be used as a reusable architecture by an external domain implementation.

---

# 26. EXTERNAL-CONSUMER VALIDATION

Before final completion, simulate the future second phase.

Create a minimal external consumer project or test fixture that imports the produced NEXUS-AO package/module/API in the manner intended for external domains.

Verify that the consumer can:

1. install/import NEXUS-AO;
2. initialize the architecture;
3. configure a domain-neutral capability;
4. register or consume a resource;
5. create a request;
6. execute the required lifecycle;
7. observe the result;
8. inspect relevant telemetry;
9. shut down cleanly.

Do not solve this by copying NEXUS-AO source files into the consumer.

The goal is to prove actual reuse.

---

# 27. REPOSITORY QUALITY

The final repository must be understandable to another senior engineer who has never participated in this conversation.

Include:

* README;
* architecture overview;
* installation instructions;
* development instructions;
* testing instructions;
* configuration documentation;
* migration instructions;
* package/module information;
* public API documentation where appropriate;
* examples;
* ADR directory;
* checkpoint reports;
* contributor/development notes where useful.

Do not document fictional features.

Documentation must reflect the actual implementation.

---

# 28. CODE QUALITY

Do not optimize prematurely.

Prefer:

* explicit code;
* strong types;
* clear interfaces;
* predictable control flow;
* deterministic business logic;
* small composable modules;
* well-defined boundaries;
* useful error types;
* testable components.

Avoid:

* hidden global state;
* unnecessary abstraction layers;
* speculative frameworks;
* magical auto-registration that obscures behavior;
* duplicated business rules;
* agent-specific shortcuts inside core services;
* excessive metaprogramming;
* premature microservices.

---

# 29. DEPENDENCY DISCIPLINE

Before adding a dependency, establish:

1. the concrete problem it solves;
2. why existing project code cannot solve it adequately;
3. whether the dependency is compatible with the architecture;
4. operational cost;
5. maintenance implications;
6. security implications;
7. whether it creates unnecessary coupling.

Prefer mature, actively maintained technologies.

Do not add libraries simply because they are popular.

---

# 30. GITHUB / SOURCE CONTROL

During implementation:

* keep commits coherent;
* use meaningful commit messages;
* do not commit generated secrets;
* do not commit local credentials;
* do not commit unnecessary build artifacts;
* keep migrations and code synchronized;
* maintain a clean repository history where practical.

Do not push or publish the repository to a remote GitHub repository unless explicitly instructed to do so.

The first objective is to reach a tested local release candidate.

After the architecture passes all final gates, the repository can be prepared for GitHub publication and version tagging.

---

# 31. COMPLETION STANDARD

Do not declare the project complete because:

* the server starts;
* the tests are green;
* the UI renders;
* or the happy path works.

NEXUS-AO is complete only when the implementation satisfies the specification's Definition of Done and demonstrates:

* architectural integrity;
* transactional integrity;
* domain neutrality;
* test coverage of critical invariants;
* failure behavior;
* concurrency safety;
* authorization enforcement;
* observability;
* reusable external consumption;
* reproducible setup;
* and documented limitations.

---

# 32. FINAL SELF-AUDIT

Before declaring completion, perform a systematic audit against the entire specification.

For every normative requirement, determine:

* implemented;
* tested;
* documented;
* or explicitly not applicable.

Do not perform a superficial keyword search.

Inspect actual behavior.

Pay special attention to requirements that are easy to overlook because they are not visible in the UI.

Examples:

* idempotency;
* resource locking;
* rollback/compensation;
* authorization;
* event ordering;
* duplicate events;
* concurrent requests;
* agent boundaries;
* domain neutrality;
* auditability;
* external reuse.

---

# 33. FINAL REPORT

At completion, produce:

## A. Executive Summary

What was built.

## B. Architecture Compliance

How the implementation maps to the specification.

## C. Repository Structure

The final important directories and files.

## D. Technology Inventory

Actual technologies and versions used.

## E. Test Results

Exact test categories and results.

## F. Concurrency / Invariant Results

Important safety tests and outcomes.

## G. Security / Authorization Results

What was enforced and verified.

## H. Observability Results

What can currently be traced.

## I. External Consumer Validation

How reuse was demonstrated.

## J. Known Limitations

Only real limitations.

## K. ADRs

Architecture decisions created during implementation.

## L. Recommended Release Status

One of:

* NOT READY
* RELEASE CANDIDATE
* READY FOR GITHUB
* READY FOR EXTERNAL DOMAIN IMPLEMENTATION

Do not select a status based on optimism.

Select it based on evidence.

---

# 34. IMPORTANT BEHAVIORAL RULE

Do not optimize for producing a large amount of code quickly.

Optimize for producing a **coherent architecture that remains correct when another project consumes it**.

A smaller correct implementation is preferable to a larger implementation containing speculative features.

Likewise, do not interpret “complete architecture” as permission to add every possible modern technology.

Implement what NEXUS-AO actually requires.

---

# 35. DO NOT DRIFT INTO RESTAURANT IMPLEMENTATION

The next project after this one will be the Restaurant Domain.

That is intentionally postponed.

When you encounter a requirement that appears useful specifically for restaurants, do not put it into NEXUS-AO unless it is demonstrably domain-neutral.

Instead classify it as:

`DOMAIN-SPECIFIC — DEFERRED TO RESTAURANT DOMAIN`

The same rule applies to any other industry-specific behavior.

---

# 36. STARTING PROCEDURE

Begin immediately with:

## PHASE 0 — RECONNAISSANCE AND BASELINE

Perform the Phase 0 work specified by the NEXUS-AO architecture document.

During Phase 0:

1. Read the entire architecture specification.
2. Inspect the current repository/workspace.
3. Inspect any existing relevant Swarm Engine code or package available to the project.
4. Inspect the installed development environment.
5. Identify the actual starting state.
6. Map the specification to the existing environment.
7. Identify implementation risks.
8. Establish the baseline test state.
9. Produce the Phase 0 checkpoint report.

Do not begin large-scale implementation before Phase 0 is complete.

Do not redesign the architecture during reconnaissance.

---

# 37. EXECUTION PRINCIPLE

From this point forward, behave as the **principal engineer implementing a predefined architecture**, not as a consultant asking the user to design it interactively.

The user has intentionally delegated implementation-level engineering decisions to you.

Use the specification as your primary source of truth.

Use tests as your evidence.

Use ADRs for genuine architectural decisions.

Use checkpoints to prove progress.

Use regression tests to prevent drift.

Do not silently simplify the architecture.

Do not silently expand the architecture.

Do not fabricate missing requirements.

Do not ask avoidable questions.

Do not stop merely because implementation becomes complex.

Work through the defined phases methodically.

---

# 38. FINAL OBJECTIVE

The final result of this mission is:

**A production-oriented, reusable, domain-neutral implementation of NEXUS-AO that is independently consumable by future domain applications, including the planned Restaurant Domain.**

The next project will import NEXUS-AO.

Therefore, build NEXUS-AO as a real reusable foundation.

Do not build a restaurant disguised as an architecture.

Do not build a demo disguised as infrastructure.

Build the architecture.

Begin with **Phase 0 — Reconnaissance and Baseline**.
