<!--
Project Signature: Ayman × Nibras
Document: NEXUS Restaurant Domain Specification
Purpose: Normative restaurant-domain implementation specification built on NEXUS-AO
Status: Engineering Baseline / Build-Ready
Date: 2026-10-01
Authority: This document is normative for the Restaurant Domain Pack. NEXUS-AO remains authoritative for universal architecture rules.
Parent Architecture: NEXUS Agentic Operations Architecture (NEXUS-AO)
Repository Name: nexus-restaurant-domain
Canonical File: NEXUS_Restaurant_Domain_Specification.md
-->

# NEXUS Restaurant Domain Specification
## Universal Restaurant Operating System — Domain Pack

**Architecture:** NEXUS-AO

**Domain short name:** `NEXUS-RESTAURANT` / `NEXUS-RST`

**Document type:** Normative Domain Pack / Build Specification

**Document status:** Build-ready engineering baseline

**Reference date:** 2026-10-01

**Repository:** `nexus-restaurant-domain`

**Canonical document:** `NEXUS_Restaurant_Domain_Specification.md`

**Owner signature:** Ayman × Nibras

---

# 0. EXECUTIVE BUILD DIRECTIVE

This document defines the complete **restaurant domain implementation** for the NEXUS-AO architecture.

The development model MUST treat:

```text
NEXUS-AO
    = universal architecture

NEXUS-RESTAURANT
    = restaurant-specific domain behavior
```

as two different authority layers.

The implementation MUST NOT redesign NEXUS-AO while implementing this document.

The implementation MUST NOT replace the existing Swarm Engine orchestration layer with a new orchestration framework merely because another framework is available.

The implementation MUST NOT invent restaurant business rules that are unspecified when a rule is already defined here.

Where this document uses terms defined by NEXUS-AO, the NEXUS-AO definition is authoritative.

Where this document defines restaurant-specific behavior, this document is authoritative for that behavior.

Where a conflict is discovered:

1. Security and legal constraints win.
2. NEXUS-AO universal invariants win.
3. This Restaurant Domain Specification wins for restaurant-specific semantics.
4. Implementation details may be changed only through an explicit ADR and MUST NOT silently drift.

The final system is not a chatbot that happens to accept food orders.

It is a **transactional, multi-agent restaurant operating system** with AI as an intelligent interaction and coordination layer over deterministic operational state.

---

# 1. SYSTEM MISSION

The restaurant system SHALL provide one operational platform capable of supporting restaurants ranging from:

```text
Very small restaurant
  - 1–2 tables
  - few menu items
  - one service station

through

Medium restaurant
  - multiple sections
  - multiple kitchen/bar stations
  - reservations
  - delivery
  - inventory

through

Large / premium restaurant
  - large dining room
  - high order concurrency
  - multiple specialist stations
  - advanced reservations
  - complex menus and modifiers
  - multiple payment modes
  - multi-channel ordering
  - multi-branch operation
```

The platform MUST use the same core domain model at all scales.

Scaling a restaurant down MUST be a configuration change wherever possible, not a separate implementation.

The architecture MUST also be suitable for later extraction of restaurant-domain patterns into other NEXUS domains.

---

# 2. PRIMARY PRODUCT POSITION

The system SHOULD be positioned technically as:

> **An Agentic Restaurant Operating System built on NEXUS-AO.**

It is not merely:

- an AI ordering bot;
- a QR menu;
- a POS replacement;
- a voice ordering assistant;
- a waiter chatbot;
- a collection of restaurant agents.

It is the coordinated operating layer connecting:

```text
Customers
Staff
Agents
Menu
Orders
Tables
Reservations
Kitchen
Inventory
Payments
Delivery
Memory
Feedback
Operations
Integrations
Audit
Analytics
```

through authoritative transactional state.

---

# 3. RESTAURANT DOMAIN BOUNDARY

## 3.1 Included in this Domain Pack

The Restaurant Domain owns the semantics of:

- restaurant and branch configuration;
- dining areas and tables;
- guests and parties;
- reservations;
- menu and menu versions;
- menu categories and subcategories;
- menu items;
- item modifiers and modifier groups;
- availability schedules;
- customer ordering;
- order lifecycle;
- per-guest order attribution;
- kitchen production tasks;
- beverage production tasks;
- dessert/fruit production tasks;
- inventory requirements and inventory visibility;
- resource allocation;
- kitchen/bar capacity;
- bills and bill items;
- discounts and promotions;
- payments and settlements;
- refund requests;
- delivery orders and pickup orders;
- customer preferences;
- customer memory;
- feedback;
- loyalty records when enabled;
- operational monitoring;
- restaurant-domain notifications;
- restaurant-domain reports and analytics;
- restaurant integrations.

## 3.2 Explicitly outside this Domain Pack

The following remain NEXUS-AO responsibilities:

- universal request lifecycle;
- universal capability framework;
- universal resource framework;
- universal authorization model;
- universal audit primitives;
- universal event/outbox architecture;
- universal agent lifecycle;
- universal MCP/A2A infrastructure;
- universal observability;
- universal workflow abstractions;
- universal memory infrastructure.

This domain supplies restaurant-specific configurations and policies for those mechanisms.

---

# 4. CORE RESTAURANT DESIGN PRINCIPLES

## 4.1 Customer intent is not a commitment

When a customer says:

> "I want three Russian salads."

the system SHALL interpret that as a request, not as a committed order.

The order becomes authoritative only after validation, required consent, and transaction commit.

## 4.2 Agent output is not operational truth

An agent saying:

> "We have three portions."

is not authoritative.

The Food domain service MUST verify the actual item availability and relevant resources.

## 4.3 No silent substitution

If requested ingredients, modifiers, items, capacity, or timing are unavailable, the system MUST NOT silently substitute when the substitution materially changes:

- product identity;
- ingredients;
- allergens;
- dietary characteristics;
- price;
- quantity;
- requested timing;
- or customer expectation.

The system MUST propose alternatives and obtain customer consent when policy requires it.

## 4.4 One table may contain many independent guest orders

A table is not equivalent to one customer.

The data model MUST support:

```text
Table 7
  Party: 4 guests

  Guest A
    Soup
    Salad: no salt

  Guest B
    Steak
    Dessert: low syrup

  Guest C
    Salad
    Tea

  Guest D
    Vegetarian meal
```

All items may contribute to one table bill while remaining attributable to individual guests.

## 4.5 Delivery and dine-in are different fulfillment modes

The same menu/order primitives may be reused, but fulfillment policy MUST distinguish:

- dine-in;
- takeaway/pickup;
- delivery;
- pre-order for reservation;
- staff/manual order;
- external channel order.

## 4.6 Restaurant staff remains part of the operational loop

The system MUST support human confirmation at operational points where the physical world cannot be verified automatically.

Example:

```text
Agent creates kitchen task
      ↓
Kitchen prepares dish
      ↓
Human waiter or station confirms delivery
      ↓
System marks task delivered
```

The system MUST NOT claim physical delivery solely because an agent generated a command.

---

# 5. SCALE PROFILES

The implementation MUST support three reference deployment profiles without changing domain semantics.

## 5.1 Profile S — Small Restaurant

Recommended characteristics:

- one branch;
- low concurrency;
- PostgreSQL;
- pgvector;
- Swarm Engine;
- MCP boundary;
- OpenTelemetry;
- synchronous internal calls where safe;
- event outbox persisted in PostgreSQL;
- NATS optional;
- Temporal disabled unless required;
- OpenFGA disabled unless authorization complexity requires it;
- A2A disabled unless an external agent integration is needed.

## 5.2 Profile M — Medium Restaurant

Add as justified:

- NATS JetStream;
- dedicated workers;
- OpenTelemetry Collector;
- Redis for non-authoritative caching/short-lived coordination;
- more formal background processing;
- external POS/KDS/payment integrations;
- stronger notification workers.

## 5.3 Profile L — Large / Multi-Branch

May add:

- Temporal for durable long-running workflows;
- OpenFGA for complex relationship-based authorization;
- multiple worker pools;
- branch-local integrations;
- centralized management;
- A2A for independent external agent collaboration;
- branch and central operations analytics;
- high-availability PostgreSQL deployment.

No scale profile may bypass transaction integrity.

---

# 6. RESTAURANT ACTORS

The system models at least these actor classes:

```text
CUSTOMER
GUEST
WAITER
KITCHEN_STAFF
BAR_STAFF
MANAGER
CASHIER
RESTAURANT_ADMIN
SYSTEM_OPERATOR
EXTERNAL_PARTNER
AGENT
```

A person may act in multiple contexts.

Authorization MUST be based on actor identity, role, tenant/branch scope, object scope, and action risk as defined by NEXUS-AO.

---

# 7. RESTAURANT AGENT ROSTER

The implementation MUST begin with a controlled set of specialist agents.

It MUST NOT create an agent for every database table or feature.

## 7.1 Master Waiter Agent

**Role:** primary customer-facing orchestration agent.

Responsibilities:

- understand natural language requests;
- support multilingual conversation;
- manage the conversation state;
- identify party/table/reservation context;
- decompose requests;
- invoke specialist capabilities;
- collect proposals;
- communicate conflicts;
- request user/customer consent when required;
- summarize final order before commit;
- provide status;
- hand off to human staff when required.

The Master Waiter MUST NOT directly manipulate authoritative database state through model-generated SQL.

It MUST invoke typed commands/tools.

## 7.2 Food Agent

Owns conversational coordination for:

- food menu discovery;
- food item explanation;
- food modifiers;
- ingredient-related capability checks;
- preparation constraints;
- food production requests.

It MUST delegate final transactional mutations to domain services.

## 7.3 Beverage Agent

Owns:

- beverage menu discovery;
- beverage modifiers;
- hot/cold/size options;
- beverage preparation requests;
- beverage station capability checks.

## 7.4 Dessert Agent

Owns:

- dessert discovery;
- dessert modifiers;
- portion options;
- sweetness/syrup/cream modifiers where supported;
- dessert production coordination.

## 7.5 Fruit Agent

Owns:

- fruit item discovery;
- fruit plate/modifier configuration;
- availability checks;
- fruit preparation coordination.

This agent is distinct only where the restaurant's operation justifies it. The deployment MAY map fruit functionality into another specialist agent without altering the domain contract.

## 7.6 Reservation Agent

Owns:

- reservation search;
- table/party compatibility checks;
- time-slot availability;
- booking proposals;
- deposits;
- modification/cancellation workflows;
- no-show state handling.

## 7.7 Accounting / Payment Agent

Owns conversational coordination for:

- bill explanation;
- split bill requests;
- payment method selection;
- payment status communication;
- receipt delivery;
- refund request routing.

Financial truth MUST remain in payment/billing services and payment-provider confirmations.

## 7.8 Customer Feedback Agent

Owns optional post-service feedback collection.

It MUST:

- remain concise;
- avoid repetitive questioning;
- avoid requiring the customer to remember table/date information when context is already known;
- distinguish explicit feedback from inferred sentiment;
- create structured feedback records;
- feed the Operations layer.

## 7.9 Operations Agent

Owns restaurant operational monitoring.

It monitors:

- station queues;
- delays;
- capacity saturation;
- negotiation failures;
- repeated unavailable-item requests;
- payment failures;
- reservation pressure;
- recurring customer complaints;
- workload patterns.

It MAY recommend or create temporary specialist agents only when NEXUS-AO sub-agent policies are satisfied.

It MUST NOT spawn agents merely because spawning is technically possible.

---

# 8. NON-AGENT CORE SERVICES

The following capabilities MUST remain primarily deterministic services rather than conversational agents:

- menu service;
- table service;
- reservation service;
- order service;
- modifier validation;
- availability service;
- inventory service;
- resource service;
- kitchen task service;
- billing service;
- payment adapter;
- discount/promotion engine;
- tax calculation;
- notification service;
- audit service;
- feedback persistence;
- customer preference persistence;
- analytics pipeline.

This separation is mandatory because these services enforce invariants.

---

# 9. RESTAURANT DOMAIN ENTITY MODEL

The minimum domain model SHALL include the following entities.

## 9.1 Restaurant

```text
Restaurant
- id
- legal_name
- display_name
- tenant_id
- timezone
- currency
- default_language
- supported_languages
- status
- created_at
- updated_at
```

## 9.2 Branch

```text
Branch
- id
- restaurant_id
- code
- name
- address
- timezone
- opening_hours
- contact_channels
- service_modes
- status
```

## 9.3 Dining Area

```text
DiningArea
- id
- branch_id
- name
- area_type
- floor
- section
- status
```

## 9.4 Table

```text
Table
- id
- branch_id
- dining_area_id
- code
- capacity_min
- capacity_max
- position_metadata
- attributes
- status
```

Examples of attributes:

- near_window;
- near_lake;
- outdoor;
- accessible;
- quiet;
- high_table;
- family_area.

Attributes are data, not hard-coded business logic.

## 9.5 Guest

```text
Guest
- id
- customer_id_nullable
- display_name
- contact_reference
- consent_state
- created_at
```

## 9.6 Customer

A persistent customer identity may exist independently of a single visit.

Minimum concepts:

```text
Customer
- id
- tenant_id
- identity_reference
- preferred_language
- communication_preferences
- memory_status
- loyalty_status_optional
- created_at
- updated_at
```

Sensitive data MUST be minimized.

## 9.7 Party

Represents people dining together for a specific occasion.

```text
Party
- id
- branch_id
- guest_count
- lead_customer_id_nullable
- table_assignment_nullable
- service_context
- status
```

## 9.8 Reservation

```text
Reservation
- id
- branch_id
- party_id
- scheduled_start
- scheduled_end
- requested_guest_count
- assigned_table_id_nullable
- table_constraints
- deposit_required
- deposit_status
- status
- source
- notes
```

## 9.9 Menu

```text
Menu
- id
- branch_id
- name
- channel
- locale_set
- version
- status
- effective_from
- effective_until_nullable
```

## 9.10 Menu Category

Supports arbitrary depth where useful, but UI SHOULD normally expose a manageable hierarchy.

```text
MenuCategory
- id
- menu_id
- parent_id_nullable
- name_by_locale
- display_order
- status
```

## 9.11 Menu Item

```text
MenuItem
- id
- menu_id
- category_id
- sku
- name_by_locale
- description_by_locale
- price
- currency
- tax_class
- prep_time_estimate
- availability_status
- image_reference
- ingredient_references
- allergen_references
- nutrition_metadata_optional
- station_type
- status
```

## 9.12 Modifier Group

```text
ModifierGroup
- id
- menu_item_id
- name_by_locale
- min_selections
- max_selections
- required
- display_order
```

## 9.13 Modifier

```text
Modifier
- id
- modifier_group_id
- name_by_locale
- price_delta
- inventory_requirements
- operational_effects
- allergen_effects
- status
```

## 9.14 Order

```text
Order
- id
- branch_id
- party_id_nullable
- table_id_nullable
- customer_id_nullable
- reservation_id_nullable
- channel
- fulfillment_mode
- currency
- subtotal
- discounts_total
- tax_total
- service_charge_total
- total
- status
- version
- created_at
- updated_at
```

## 9.15 Order Line

Each line MUST support per-guest attribution.

```text
OrderLine
- id
- order_id
- guest_id_nullable
- menu_item_id
- quantity
- base_unit_price
- modifier_total
- line_total
- requested_preferences
- production_status
- billing_status
```

## 9.16 Kitchen Task

```text
ProductionTask
- id
- order_id
- order_line_id
- station_type
- station_id_nullable
- priority
- requested_at
- started_at_nullable
- completed_at_nullable
- delivered_at_nullable
- status
- dependency_ids
- notes
```

## 9.17 Inventory Item

```text
InventoryItem
- id
- branch_id
- sku
- name
- unit
- on_hand
- reserved
- available
- reorder_point
- safety_stock
- cost
- status
```

`available` MUST be computed or transactionally maintained according to the inventory model. It MUST NOT be guessed by an agent.

## 9.18 Resource

Resources are physical or logical operational capacities.

Examples:

- kitchen station;
- grill station;
- fryer;
- oven;
- bar station;
- dessert station;
- table;
- waiter capacity;
- delivery slot;
- reservation slot.

## 9.19 Bill

```text
Bill
- id
- order_id
- subtotal
- discount_total
- tax_total
- service_charge_total
- total
- paid_total
- due_total
- status
```

## 9.20 Payment

```text
Payment
- id
- bill_id
- provider
- method
- amount
- currency
- provider_reference
- status
- idempotency_key
- created_at
- completed_at_nullable
```

Raw card information MUST NOT be stored.

## 9.21 Feedback

```text
Feedback
- id
- customer_id_nullable
- guest_id_nullable
- order_id_nullable
- category
- rating_nullable
- text_nullable
- sentiment_optional
- confidence_optional
- explicitness
- created_at
```

## 9.22 Preference

```text
CustomerPreference
- id
- customer_id
- preference_type
- value
- source
- confidence
- consent_state
- last_confirmed_at
- created_at
- updated_at
```

A preference must not be promoted to a high-confidence persistent preference solely from one ambiguous interaction.

---

# 10. STATE MACHINES

Every major entity with lifecycle behavior MUST use an explicit state machine.

## 10.1 Reservation states

```text
REQUESTED
    ↓
PENDING_VALIDATION
    ↓
PROPOSED
    ↓
AWAITING_CONFIRMATION
    ↓
CONFIRMED
    ↓
CHECKED_IN
    ↓
SEATED
    ↓
COMPLETED
```

Alternative terminal states:

```text
CANCELLED
EXPIRED
NO_SHOW
REJECTED
```

No arbitrary state jumps are permitted.

## 10.2 Order states

```text
DRAFT
    ↓
VALIDATING
    ↓
AWAITING_CONSENT
    ↓
COMMITTING
    ↓
CONFIRMED
    ↓
IN_PROGRESS
    ↓
READY
    ↓
DELIVERED
    ↓
SETTLED
    ↓
CLOSED
```

Possible terminal/exception states:

```text
CANCELLED
PARTIALLY_CANCELLED
REJECTED
FAILED
```

## 10.3 Production task states

```text
CREATED
QUEUED
ACCEPTED
IN_PROGRESS
READY
DELIVERED
CANCELLED
FAILED
```

## 10.4 Payment states

```text
INITIATED
PENDING_PROVIDER
AUTHORIZED
CAPTURED
FAILED
CANCELLED
REFUND_PENDING
REFUNDED
PARTIALLY_REFUNDED
```

The implementation MUST not infer `CAPTURED` from a client-side success page. It requires authoritative provider confirmation.

---

# 11. MENU AND CATALOG SPECIFICATION

The restaurant menu is an operational product catalog, not merely a display page.

## 11.1 Menu hierarchy

Support:

```text
Menu
  └── Category
        └── Subcategory
              └── Item
                    └── Modifier Groups
                          └── Modifiers
```

The hierarchy MUST support localization.

## 11.2 Item availability

A menu item can be unavailable because of:

- manual disablement;
- time schedule;
- branch configuration;
- channel restriction;
- inventory shortage;
- station outage;
- temporary operational suspension.

The UI MAY show a simplified reason to the customer.

The internal system MUST record the authoritative reason.

## 11.3 Preparation estimate

Each item may expose:

- baseline preparation time;
- current dynamic estimate;
- station queue delay;
- dependency delay.

The displayed estimate MUST be based on an explainable calculation or explicitly identified as an estimate.

## 11.4 Ingredients and allergens

Ingredients must be represented structurally when the restaurant wants ingredient-aware capability checks.

Allergen-critical behavior MUST be deterministic and MUST NOT depend on an LLM's memory.

## 11.5 Menu versioning

Published menu versions MUST be immutable.

Changes create a new effective version.

Active orders reference the menu/item price/version context relevant at commit time.

---

# 12. CUSTOMER IDENTITY, GUESTS, AND PERSONALIZATION

## 12.1 Anonymous customer flow

A guest MUST be able to order without creating a persistent account when business policy permits.

## 12.2 Identified customer flow

Identified customers may have:

- language preference;
- communication preference;
- recurring food preferences;
- recurring beverage preferences;
- recurring seating preferences;
- explicitly saved dietary preferences;
- loyalty information;
- prior order context.

## 12.3 Preference lifecycle

The intended loop is:

```text
Preference
   ↓
Order
   ↓
Experience
   ↓
Feedback
   ↓
Preference refinement
   ↓
Future order
```

## 12.4 Preference confidence

Initial default confidence levels MUST be explicit.

Suggested initial policy:

```text
Observed once, explicit:
    medium confidence

Observed repeatedly and consistently:
    high confidence

Inferred without explicit confirmation:
    low confidence

Customer explicitly confirms saved preference:
    high confidence
```

The actual numeric values MUST live in configuration, not code constants.

## 12.5 Sensitive preference handling

The system MAY support sensitive dietary information, but must minimize it.

For example, if a customer says:

> "No salt for medical reasons."

the order needs only the operational instruction required to fulfill the request unless the customer explicitly consents to storing additional sensitive context.

The default persisted preference SHOULD be:

```text
preference = no_salt
```

not:

```text
medical_condition = ...
```

---

# 13. DINING TABLE AND SEATING MANAGEMENT

## 13.1 Table states

At minimum:

```text
AVAILABLE
HELD
RESERVED
OCCUPIED
SERVICE_PENDING
CLEANING
OUT_OF_SERVICE
```

## 13.2 Table assignment

Assignment MUST consider:

- capacity;
- requested number of guests;
- table status;
- reservation conflicts;
- dining area constraints;
- customer preferences;
- operational policy;
- duration estimates.

## 13.3 Preference-aware seating

Customer requests such as:

- near window;
- outdoor;
- quiet area;
- accessible area;
- near a specified feature;

must be modeled as constraints/preferences, not hidden agent memory.

The Reservation Agent can rank candidates, but the final allocation is authoritative domain state.

---

# 14. RESERVATION SYSTEM

## 14.1 Reservation request

Example:

> "I am Ayman. Table for four at 14:00."

The system MUST derive:

```text
party size = 4
requested time = 14:00
customer identity = known/anonymous
branch = resolved
preferences = optional
```

Then it MUST validate availability.

## 14.2 Reservation with pre-order

Supported flow:

```text
Reservation request
    ↓
Table proposal
    ↓
Customer confirmation
    ↓
Optional deposit
    ↓
Pre-order proposal
    ↓
Capability/resource validation
    ↓
Customer confirmation
    ↓
Pre-order commitment
```

The system MUST NOT promise that a pre-order will be ready before the reservation time without checking production capacity and item constraints.

## 14.3 Deposits

Deposit requirements are policy-driven.

Deposit collection uses the Payment adapter.

Payment provider failure MUST leave reservation state consistent and retryable.

## 14.4 No-show

No-show rules MUST be configurable by restaurant/branch.

They may include:

- grace period;
- automatic release;
- deposit retention policy;
- customer notification;
- operational logging.

---

# 15. ORDERING MODEL

## 15.1 Channels

The order system SHALL support these channel identifiers:

```text
TABLET
WAITER
MOBILE_WEB
MOBILE_APP
VOICE
PHONE
QR
POS_IMPORT
DELIVERY_PARTNER
API
ADMIN
```

Additional channels may be registered through configuration.

## 15.2 Fulfillment modes

```text
DINE_IN
TAKEAWAY
DELIVERY
PREORDER
```

## 15.3 Order composition

An order MAY contain multiple lines, each with:

- guest attribution;
- menu item;
- quantity;
- modifiers;
- preparation preferences;
- notes;
- requested timing;
- production dependencies.

## 15.4 Per-guest modifications

The system MUST support line-level modifiers.

Example:

```text
Table 7

Guest 1:
  1 x Kunafa
  Modifier: low syrup

Guest 2:
  1 x Kunafa
  Modifier: extra cream

Guest 3:
  1 x Kunafa
  Standard
```

These MUST NOT collapse into one undifferentiated quantity if modifier semantics differ.

## 15.5 Order amendment

Once an order is committed, a modification is a new transaction against the current order state.

It MUST revalidate:

- item availability;
- modifiers;
- inventory impact;
- production capacity;
- price;
- bill impact;
- customer consent where required.

---

# 16. RESTAURANT REQUEST / NEGOTIATION EXAMPLE

This scenario is mandatory in the test suite.

Customer says:

> "I want Russian salad with mustard seeds."

The system MUST NOT answer:

> "Yes, no problem."

unless the capability/resource checks verify availability.

Required behavior:

```text
Customer
  ↓
Master Waiter
  ↓
Food Agent
  ↓
Ingredient / inventory capability check
  ↓
Mustard seeds unavailable
  ↓
Food Agent returns:
  unavailable + alternatives if any
  ↓
Master Waiter asks customer
  ↓
Customer chooses:
  alternative / remove ingredient / cancel
  ↓
Final validation
  ↓
Commit
```

A silent substitution is a defect.

---

# 17. KITCHEN / KOT / KDS DOMAIN

The restaurant platform MUST provide a kitchen operational representation even when the actual kitchen uses physical/manual processes.

## 17.1 Kitchen Order Ticket

Every committed production-relevant order line MUST generate a structured production task or equivalent KOT record.

The task includes:

- order;
- table/fulfillment context;
- guest attribution when useful;
- item;
- modifiers;
- timing;
- priority;
- station;
- dependencies.

## 17.2 Kitchen Display System

KDS MAY be:

- native UI;
- integrated third-party KDS;
- printer workflow;
- hybrid.

The domain contract remains the same.

## 17.3 Kitchen task priority

Priority may depend on:

- customer requested time;
- reservation departure risk;
- order age;
- table dependency;
- course sequencing;
- operational SLA.

Agents may recommend priorities; deterministic policy decides actual priority where required.

## 17.4 Course sequencing

Support optional courses:

```text
STARTER
MAIN
DESSERT
BEVERAGE
```

or restaurant-defined course categories.

Orders may specify:

- fire immediately;
- fire after previous course;
- target serving time.

## 17.5 Delivery confirmation

Production completion and customer delivery are different states.

```text
PREPARED
   ≠
DELIVERED
```

The system MUST preserve this distinction.

---

# 18. SPECIALIST PRODUCTION FLOWS

## 18.1 Food

```text
Food request
  ↓
Menu validation
  ↓
Modifier validation
  ↓
Ingredient availability
  ↓
Station capacity
  ↓
Customer consent if alternative required
  ↓
Commit
  ↓
Kitchen task
  ↓
Preparation
  ↓
Ready
  ↓
Delivery confirmation
```

## 18.2 Beverage

Same pattern, with beverage-specific:

- temperature;
- size;
- milk/sugar/add-ons;
- bar station capacity.

## 18.3 Dessert

Support:

- portion;
- syrup;
- cream;
- toppings;
- temperature/service timing.

## 18.4 Fruit

Support:

- fruit composition;
- portion;
- exclusions;
- timing;
- availability.

---

# 19. INVENTORY AND STOCK CONTROL

Inventory is an authoritative operational subsystem.

## 19.1 Inventory requirements

Menu items SHOULD reference ingredient/resource requirements where the restaurant expects automatic availability checks.

Example:

```text
Russian Salad
  potatoes: 150 g
  peas: 50 g
  mayonnaise: 40 g
  carrots: 30 g
  mustard seeds: 5 g
```

The exact bill-of-materials structure is configurable.

## 19.2 Reservation of stock

For committed or appropriately held orders, inventory MAY create a reservation/hold.

The system MUST distinguish:

```text
ON_HAND
RESERVED
AVAILABLE
CONSUMED
WASTED
ADJUSTED
```

## 19.3 Preventing overselling

The system MUST use transactional concurrency control for stock-consuming commits.

The LLM MUST never calculate final stock availability and commit it directly.

## 19.4 Low-stock signals

Operations monitoring SHOULD emit:

- low-stock events;
- unavailable-item events;
- repeated stock conflict events;
- reorder recommendations.

## 19.5 Procurement integration

A later deployment may integrate purchasing/procurement systems.

The restaurant domain MUST expose a clean integration boundary rather than hard-coding one provider.

---

# 20. PRICING, TAX, DISCOUNTS, AND PROMOTIONS

## 20.1 Price authority

The price at order commit is authoritative.

Conversational text MUST not define price.

## 20.2 Price version

Each committed line MUST preserve the applied price context sufficient for audit.

## 20.3 Discounts

Discounts MUST be represented as structured rules or explicit adjustments.

The system MUST record:

- discount type;
- amount/rate;
- eligibility basis;
- source;
- actor;
- approval requirement where applicable.

## 20.4 Promotions

Promotions may be:

- item-level;
- category-level;
- order-level;
- customer-specific;
- time-based;
- channel-specific.

No promotion may override a financial safety policy.

---

# 21. BILLING AND PAYMENT

## 21.1 Bill generation

The bill SHALL be derived from authoritative order state.

It MUST not be generated from the assistant's conversational summary.

## 21.2 Split bill

Support:

- split by guest;
- split by item;
- split by amount;
- mixed payment methods.

Example:

```text
Table 7 total = 180

Guest A = 50
Guest B = 40
Guest C = 60
Guest D = 30
```

## 21.3 Payment methods

The adapter model SHOULD support:

```text
CARD
CASH
BANK_TRANSFER
DIGITAL_WALLET
ONLINE_PAYMENT
RESTAURANT_ACCOUNT
```

Actual methods depend on deployment.

## 21.4 Payment idempotency

Every externally submitted payment mutation MUST carry an idempotency key.

A retry MUST NOT create a second charge.

## 21.5 Payment failure

Example:

```text
Payment initiated
  ↓
Provider timeout
  ↓
System status = PENDING_PROVIDER / UNKNOWN
  ↓
Provider status query
  ↓
Confirmed success OR confirmed failure
```

Never assume failure merely because the first HTTP request timed out.

## 21.6 Refunds

Refunds are high-risk financial actions.

They require policy-controlled authorization and auditable execution.

---

# 22. CUSTOMER-FACING EXPERIENCES

## 22.1 Fixed table tablet

The primary in-restaurant experience MAY be a fixed tablet locked to the restaurant application.

Required capabilities:

- menu browsing;
- item photos;
- prices;
- preparation estimates;
- category navigation;
- conversational text;
- voice input;
- voice output;
- current table context;
- active order status;
- bill status;
- feedback.

## 22.2 Voice interaction

Voice flow:

```text
Microphone
   ↓
Speech recognition
   ↓
Master Waiter intent/session
   ↓
NEXUS orchestration
   ↓
Typed domain actions
   ↓
Text response
   ↓
Text-to-speech
```

Speech recognition and speech synthesis providers MUST be adapters.

## 22.3 Mobile customer app

The mobile experience SHOULD support:

- reservation;
- table preferences;
- pre-order;
- order tracking;
- saved preferences;
- customer-controlled memory;
- loyalty when enabled;
- payment;
- receipt;
- feedback.

## 22.4 Staff UI

The staff UI SHOULD expose:

- tables;
- reservations;
- active orders;
- kitchen queues;
- beverage queues;
- tasks requiring confirmation;
- exceptions;
- payment status;
- operational alerts.

The staff UI MUST NOT expose raw internal agent reasoning.

---

# 23. MULTILINGUAL RESTAURANT OPERATION

The system SHALL separate:

```text
Display language
Conversation language
Stored business data language
```

A customer may speak Russian, use an English menu, and receive a receipt in another configured language.

Translations MUST NOT alter the canonical identifier of items/modifiers.

Example:

```text
canonical item id = ITEM-00127

English = Russian Salad
Arabic  = سلطة روسية
Russian = Оливье
```

Agents operate on canonical IDs, not names alone.

---

# 24. CUSTOMER FEEDBACK SYSTEM

## 24.1 Purpose

Feedback is not only a rating feature.

It provides structured operational learning.

## 24.2 Feedback collection

The system SHOULD ask lightweight questions such as:

- Was everything as expected?
- How was the food?
- Was the waiting time acceptable?
- Is there anything you'd change?

The survey SHOULD adapt to context and remain short.

## 24.3 Pattern detection

Example:

```text
Many customers:
  "The soup is delicious but too hot."

        ↓
Repeated structured feedback

        ↓
Operations signal:
  recurring temperature complaint

        ↓
Manager recommendation
```

The Operations Agent MAY recommend a process change.

It MUST NOT silently change kitchen standards.

## 24.4 Feedback confidence

The system MUST distinguish:

- explicit customer statement;
- explicit rating;
- inferred sentiment;
- repeated pattern;
- system recommendation.

These are different evidence levels.

---

# 25. CUSTOMER MEMORY

## 25.1 Purpose

Customer memory is a cumulative relationship layer.

The value is not the storage of isolated facts; it is the accumulation of useful, customer-controlled context across visits.

## 25.2 Example

A returning customer may have stored preferences:

```text
Lentil soup:
  extra lemon

Baklava:
  no syrup

Seating:
  quiet area preferred

Language:
  Arabic
```

On a new visit, the Master Waiter may say:

> "Welcome back. Would you like your usual lentil soup with extra lemon?"

This is a proposal, not an automatic order.

## 25.3 Consent

The customer MUST be able to:

- view saved preferences;
- edit them;
- delete them;
- disable personalization;
- clear stored memory.

## 25.4 One comment must not rewrite identity

A single statement such as:

> "Today I don't want lemon."

MUST NOT automatically erase the customer's persistent preference for extra lemon.

It is a current-order override unless the customer explicitly updates the persistent preference.

---

# 26. OPERATIONS INTELLIGENCE

The Operations Agent is a monitoring and improvement capability.

## 26.1 Signals

It monitors:

- order throughput;
- queue length;
- preparation times;
- delivery delays;
- table turnover;
- reservation pressure;
- ingredient conflicts;
- payment failures;
- feedback patterns;
- agent handoffs;
- negotiation failures;
- human intervention rate.

## 26.2 Workload model

Every specialist capability SHOULD expose operational metrics such as:

```text
requests_per_minute
active_tasks
queued_tasks
mean_wait
p95_wait
failure_rate
resource_utilization
handoff_rate
```

## 26.3 Temporary specialist scaling

The system MAY generate temporary sub-agents when measured demand exceeds configured thresholds.

Example policy:

```text
IF
    capability_queue_length >= configurable_threshold
AND
    predicted_wait > configured_sla
FOR
    configured_observation_window
THEN
    propose temporary sub-agent
```

The threshold MUST be configuration, not code.

## 26.4 Permanent promotion

A temporary specialist may be promoted only when:

- demand recurs over a meaningful observation window;
- the capability gap is stable;
- cost is justified;
- human/operator policy permits promotion.

## 26.5 No agent proliferation

The operations system MUST optimize for useful capacity, not agent count.

---

# 27. DELIVERY / TAKEAWAY / ONLINE ORDERING

The same restaurant platform MUST be able to fulfill orders outside the dining room.

## 27.1 Delivery order lifecycle

```text
REQUESTED
  ↓
VALIDATED
  ↓
ACCEPTED
  ↓
PREPARING
  ↓
READY_FOR_PICKUP
  ↓
OUT_FOR_DELIVERY
  ↓
DELIVERED
```

Exception states remain possible.

## 27.2 External aggregators

Third-party delivery systems MUST be integrated through adapters.

Do not embed provider-specific order semantics throughout the core domain.

## 27.3 Dispatch

A future dispatch integration can expose:

- driver availability;
- delivery ETA;
- assignment;
- route state.

The restaurant core stores canonical fulfillment state.

---

# 28. LOYALTY / CUSTOMER RELATIONSHIP

Loyalty is a domain extension that may be enabled per restaurant.

When enabled, the system MAY support:

- points;
- visit counts;
- rewards;
- customer tiers;
- targeted offers;
- redemption history.

Loyalty MUST be modeled as a transactional ledger, not a mutable counter manipulated by agents.

---

# 29. RESTAURANT ANALYTICS

The system MUST expose operational and commercial reporting.

Minimum reporting categories:

```text
Sales
Orders
Average order value
Table utilization
Table turnover
Reservation conversion
No-show rate
Preparation time
Delivery time
Item availability
Inventory usage
Stock conflicts
Payment failures
Refunds
Customer retention
Repeat orders
Preference usage
Feedback themes
Operational bottlenecks
Agent workload
```

Analytics MUST distinguish:

- raw transactional facts;
- derived metrics;
- predictions;
- recommendations.

Predictions and recommendations MUST NOT be stored as facts.

---

# 30. RESTAURANT CAPABILITY REGISTRY

The Restaurant Domain MUST register capabilities with NEXUS.

Minimum capability examples:

```text
restaurant.menu.search
restaurant.menu.item_details
restaurant.menu.availability
restaurant.order.create
restaurant.order.modify
restaurant.order.cancel
restaurant.order.status
restaurant.order.split
restaurant.table.search
restaurant.table.assign
restaurant.reservation.create
restaurant.reservation.modify
restaurant.reservation.cancel
restaurant.reservation.check_in
restaurant.kitchen.task.create
restaurant.kitchen.task.update
restaurant.inventory.check
restaurant.inventory.reserve
restaurant.billing.create
restaurant.billing.split
restaurant.payment.create
restaurant.payment.status
restaurant.payment.refund
restaurant.feedback.create
restaurant.customer.preference.get
restaurant.customer.preference.update
restaurant.customer.memory.clear
restaurant.operations.metrics
restaurant.operations.alerts
```

Every capability MUST have:

- input schema;
- output schema;
- authorization policy;
- risk class;
- idempotency behavior if mutating;
- audit behavior;
- failure contract.

---

# 31. RESTAURANT MCP TOOL SURFACE

MCP is the primary tool exposure boundary for agent-facing operational capabilities where tool semantics are appropriate.

## 31.1 Tool examples

### `restaurant.search_menu`

Input:

```json
{
  "branch_id": "string",
  "query": "string",
  "category_id": "string|null",
  "language": "string"
}
```

Output MUST contain canonical item identifiers and current authoritative availability.

### `restaurant.get_item_details`

Must return:

- item ID;
- localized name;
- description;
- current price;
- modifiers;
- allergen data when available;
- estimated preparation time;
- availability status.

### `restaurant.validate_order`

This tool MUST be read/validation only.

It MUST NOT create a committed order.

### `restaurant.commit_order`

This is a side-effecting tool.

It MUST:

- require authorized context;
- accept an idempotency key;
- revalidate authoritative state;
- execute a short transaction;
- return the committed order ID and version;
- emit the relevant event/outbox records.

### `restaurant.check_reservation_availability`

Read-only availability check.

### `restaurant.commit_reservation`

Side-effecting reservation commit.

### `restaurant.get_bill`

Read-only billing query.

### `restaurant.create_payment`

High-risk side-effecting financial operation.

### `restaurant.record_feedback`

Low-risk mutation subject to privacy policy.

## 31.2 Tool naming

Tool names MUST be stable and domain-oriented.

Do not expose database table names as tool names.

Bad:

```text
postgres_insert_order_line
```

Good:

```text
restaurant.order.add_line
```

---

# 32. A2A USE IN THE RESTAURANT DOMAIN

A2A is not required for ordinary internal specialist-agent communication if the agents live inside the same application boundary.

Internal flow SHOULD use:

- typed service calls;
- Swarm Engine orchestration;
- MCP when tool boundary semantics are appropriate;
- domain events.

A2A SHOULD be used when the restaurant needs to collaborate with an independent external agent system.

Potential examples:

- external delivery agent;
- external procurement agent;
- hotel guest-service agent;
- independent payment/finance agent;
- franchise/central-management agent.

A2A MUST remain behind an adapter.

---

# 33. SWARM ENGINE INTEGRATION

The existing Swarm Engine is the agent orchestration substrate.

The Restaurant Domain MUST integrate specialist agents into Swarm Engine rather than building another internal swarm runtime.

Conceptually:

```text
Restaurant UI
     ↓
Master Waiter
     ↓
Swarm Engine
     ├── Food Agent
     ├── Beverage Agent
     ├── Dessert Agent
     ├── Fruit Agent
     ├── Reservation Agent
     ├── Accounting/Payment Agent
     ├── Feedback Agent
     └── Operations Agent
             ↓
       NEXUS Operational Core
             ↓
  PostgreSQL / Integrations / Hardware
```

Swarm Engine remains responsible for agent turn orchestration, routing, streaming, and agent collaboration patterns.

NEXUS remains responsible for authoritative transactional state.

---

# 34. MASTER WAITER EXECUTION CONTRACT

The Master Waiter MUST implement this domain behavior:

```text
1. Identify context.
2. Understand request.
3. Determine required capability/capabilities.
4. Ask specialist agents for domain analysis when useful.
5. Validate against authoritative state.
6. Collect feasible options.
7. Explain unavailable items or constraints.
8. Ask for customer choice when an alternative needs consent.
9. Present final summary.
10. Commit only after required consent.
11. Report the actual committed state.
12. Track execution.
13. Report actual completion.
```

The Master Waiter MUST distinguish:

```text
"I can probably do this"

from

"This has been verified and committed"
```

Customer language SHALL be clear about that distinction.

---

# 35. STANDARD CUSTOMER REQUEST FLOWS

## 35.1 Browse menu

```text
Customer:
  "What salads do you have?"

Master Waiter
  → menu search
  → filtered food items
  → localized display
  → photos/prices/estimated time
```

No order is created.

## 35.2 Add item

```text
Customer chooses item
  ↓
Modifier discovery
  ↓
Modifier validation
  ↓
Preference application
  ↓
Temporary order draft
```

No commitment yet.

## 35.3 Commit item

```text
Draft
  ↓
Full validation
  ↓
Resource check
  ↓
Policy
  ↓
Consent if required
  ↓
Commit
```

## 35.4 Unavailable modifier

```text
Requested modifier unavailable
  ↓
Alternative search
  ↓
No acceptable alternative?
  → ask customer whether to remove/cancel
```

## 35.5 Kitchen delay

```text
Expected delay detected
  ↓
Operations signal
  ↓
Impact evaluation
  ↓
Customer notification when relevant
  ↓
Alternative timing / item / cancellation options
```

The customer must not be promised a new time unless the operational service verifies it.

## 35.6 Item becomes unavailable after draft

The system must revalidate on commit.

A stale draft MUST NOT bypass current availability.

## 35.7 Payment failure

The bill remains authoritative.

The system must recover by checking payment provider state before presenting the bill as unpaid or paid.

---

# 36. GROUP ORDER AND TABLE EXPERIENCE

The UI MUST support a table-level conversation while internally maintaining per-guest context.

Example:

```text
Master Waiter
  └── Table 7
       ├── Guest 1
       ├── Guest 2
       ├── Guest 3
       └── Guest 4
```

A customer may say:

> "My dessert without syrup."

The system must resolve “my” to the current guest identity when known.

If ambiguous, it MUST ask a minimal clarification rather than assigning the request to the wrong guest.

---

# 37. CUSTOMER MEMORY + CURRENT ORDER OVERRIDE

The system must distinguish:

```text
Persistent Preference
        vs
Current Order Override
```

Example:

```text
Stored:
  tea = no sugar

Current order:
  "Today I want sugar."
```

The order becomes:

```text
current_order_preference = sugar
persistent_preference remains no_sugar
```

unless the customer explicitly asks to update the persistent preference.

---

# 38. HUMAN INTERVENTION

Human intervention is part of the design, not an error condition.

Required intervention scenarios include:

- physically unavailable table state;
- kitchen machine failure;
- ambiguous special request;
- high-risk refund;
- manual price adjustment;
- exceptional customer complaint;
- conflicting external payment status;
- system integration outage;
- suspected safety/allergen issue;
- operational shutdown of a station.

Every intervention MUST create an auditable record.

---

# 39. SAFETY / ALLERGEN / DIETARY POLICY

Where the restaurant maintains allergen and dietary data, the system MUST treat these as safety-sensitive domain information.

An LLM MUST NOT invent ingredient safety facts.

For a request involving an allergen or medically sensitive dietary requirement:

```text
Customer request
  ↓
Structured dietary constraint
  ↓
Deterministic menu/ingredient check
  ↓
Restaurant policy
  ↓
Safe response
```

If authoritative ingredient data is missing, the system MUST say that verification is unavailable and route to human staff according to policy.

It MUST NOT make a confident safety claim from generic model knowledge.

---

# 40. RESTAURANT RESOURCE MODEL

The restaurant domain SHOULD model resource pools explicitly.

Examples:

```text
TABLE_CAPACITY
KITCHEN_STATION
BAR_STATION
DESSERT_STATION
OVEN_CAPACITY
GRILL_CAPACITY
WAITER_CAPACITY
DELIVERY_CAPACITY
RESERVATION_SLOTS
INVENTORY_STOCK
```

Each resource has:

- identity;
- type;
- capacity;
- availability state;
- reservation/hold semantics;
- scheduling constraints.

---

# 41. CONCURRENCY INVARIANTS

The following are mandatory invariants.

## 41.1 Table

Two confirmed reservations MUST NOT occupy incompatible time ranges on the same table unless the business rule explicitly allows them and the schedule is transactionally consistent.

## 41.2 Inventory

Available stock MUST NOT become negative unless the restaurant explicitly enables controlled negative inventory.

## 41.3 Payment

The same idempotency key MUST NOT produce two independent financial charges.

## 41.4 Bill

The bill total MUST equal the sum of authoritative bill components under the applicable pricing/tax rules.

## 41.5 Order line

A line marked delivered MUST have passed through valid production states or an explicitly authorized exception path.

## 41.6 Reservation deposit

Deposit status MUST reflect authoritative payment state, not conversational state.

## 41.7 Customer preference

A current order override MUST NOT silently mutate persistent preference.

---

# 42. EVENT MODEL

The restaurant domain SHOULD publish events such as:

```text
restaurant.reservation.requested
restaurant.reservation.confirmed
restaurant.reservation.cancelled
restaurant.table.occupied
restaurant.table.released
restaurant.order.created
restaurant.order.confirmed
restaurant.order.modified
restaurant.order.cancelled
restaurant.order.ready
restaurant.order.delivered
restaurant.inventory.low
restaurant.inventory.conflict
restaurant.production.task.created
restaurant.production.task.started
restaurant.production.task.ready
restaurant.production.task.delivered
restaurant.payment.initiated
restaurant.payment.captured
restaurant.payment.failed
restaurant.payment.refunded
restaurant.feedback.created
restaurant.preference.updated
restaurant.customer.memory.cleared
restaurant.operations.alert.created
restaurant.operations.subagent.spawned
```

Events MUST be versioned and idempotent at consumer boundaries.

---

# 43. NOTIFICATION MODEL

Notifications may be sent through:

- in-app;
- tablet;
- mobile push;
- SMS;
- email;
- WhatsApp or equivalent channel where legally and technically supported;
- staff dashboard;
- voice notification.

Notification content MUST be generated from authoritative state.

Do not send:

> "Your order is ready"

because an agent believes it is ready.

Send it because the authoritative production state is `READY` and the notification policy permits it.

---

# 44. INTEGRATION BOUNDARIES

The system MUST use adapters for external providers.

Potential integration classes:

```text
POS
KDS
Payment Provider
Delivery Provider
SMS
Email
WhatsApp
Voice STT
Voice TTS
Printer
Kitchen Hardware
Accounting/ERP
Inventory Supplier
Customer Identity
Analytics
```

Each adapter MUST map external semantics to canonical NEXUS Restaurant semantics.

---

# 45. POS INTEGRATION

Because mature POS systems already exist in many restaurants, the first commercial strategy SHOULD support operating above or alongside an existing POS rather than requiring immediate replacement.

The adapter MUST define:

- menu synchronization;
- order synchronization;
- item availability synchronization;
- payment status synchronization;
- table synchronization when supported;
- cancellation/void synchronization;
- reconciliation.

External POS state MUST NEVER override a more recent verified internal transaction without an explicit reconciliation policy.

---

# 46. KDS INTEGRATION

A KDS adapter maps canonical production tasks into the external KDS vocabulary.

Required behaviors:

- create task;
- update status;
- receive completion where supported;
- reconcile missing/duplicate task messages;
- preserve canonical task ID.

---

# 47. PAYMENT PROVIDER INTEGRATION

Payment providers are adapters.

The system SHOULD support provider capabilities such as:

```text
authorize
capture
void
refund
status
webhook
```

All provider callbacks MUST be verified and mapped into canonical payment states.

---

# 48. HARDWARE INTEGRATION

Possible hardware includes:

- table tablets;
- receipt printers;
- kitchen printers;
- kitchen screens;
- payment terminals;
- microphones;
- speakers.

Hardware integration MUST remain outside the domain service layer.

The domain layer issues canonical commands; device adapters execute them.

---

# 49. RESTAURANT SECURITY

Minimum requirements:

- tenant isolation;
- branch-level authorization;
- role-based access;
- risk-based authorization for sensitive actions;
- no raw payment credentials in application databases;
- audit logs for financial mutations;
- secure secret storage;
- prompt-injection defense for tool calls;
- tool allowlists;
- user/customer data minimization.

Agents MUST receive only the permissions they require.

Example:

```text
Feedback Agent
  MAY create feedback
  MUST NOT issue refunds

Food Agent
  MAY inspect menu/inventory capability
  MUST NOT modify financial records

Payment Agent
  MAY invoke payment tools within authorized scope
  MUST NOT modify menu inventory
```

---

# 50. TENANCY AND MULTI-BRANCH SUPPORT

The domain model MUST support:

```text
Restaurant
  ├── Branch A
  ├── Branch B
  └── Branch C
```

All branch-scoped objects MUST carry or inherit branch context.

A branch-local agent MUST NOT access another branch's operational records unless explicit policy grants cross-branch access.

Central management MAY access aggregated information.

---

# 51. AUDIT REQUIREMENTS

Audit records MUST exist for at least:

- reservation commit/cancel;
- order commit/modify/cancel;
- price adjustment;
- discount override;
- inventory adjustment;
- payment mutation;
- refund;
- preference update;
- memory deletion;
- manual override;
- agent-initiated side effect;
- human intervention;
- external reconciliation.

The audit record SHOULD include:

```text
who
what
when
where
why/context
before
after
correlation_id
request_id
actor_type
```

---

# 52. COST AND TOKEN CONTROL

The restaurant system is a high-volume operational environment.

The implementation MUST minimize unnecessary model calls.

## 52.1 Do not use LLMs for deterministic work

Do not use an LLM to calculate:

- final arithmetic;
- tax;
- inventory arithmetic;
- authorization;
- table conflict truth;
- payment status;
- state transitions.

## 52.2 Use specialized context

A specialist agent should receive only the context it needs.

Do not send the entire restaurant database state into every agent prompt.

## 52.3 Cache stable knowledge

Menu metadata and static restaurant knowledge MAY be cached.

Operational state must remain authoritative in transactional services.

---

# 53. RAG IN THE RESTAURANT DOMAIN

RAG may be used for non-transactional restaurant knowledge such as:

- restaurant story;
- menu explanations;
- ingredient descriptions;
- preparation descriptions;
- policies;
- dining etiquette;
- branch information;
- staff manuals;
- customer-service knowledge.

RAG MUST NOT be authoritative for:

- current price;
- current inventory;
- table availability;
- reservation truth;
- payment state;
- current order state.

Those require operational queries.

---

# 54. DOMAIN MEMORY VERSUS RAG

Use memory for relationship facts such as:

```text
customer prefers quiet table
customer usually orders lentil soup
customer prefers Arabic
```

Use RAG for restaurant knowledge such as:

```text
The restaurant's history
How a dish is traditionally prepared
Restaurant policy explanations
```

Do not store changing inventory as customer memory or RAG content.

---

# 55. RESTAURANT POLICY ENGINE

The following restaurant policies MUST be represented as policy configuration where possible:

- reservation duration;
- reservation grace period;
- deposit rules;
- cancellation rules;
- discount limits;
- manager approval thresholds;
- refund thresholds;
- table assignment constraints;
- order cancellation windows;
- inventory negative-stock policy;
- allergy handling policy;
- customer memory consent policy;
- notification rules;
- agent action permissions.

Policies MUST be versioned.

---

# 56. RISK CLASSES FOR RESTAURANT ACTIONS

Suggested restaurant action classes:

```text
LOW
  menu search
  status query
  feedback submission

MEDIUM
  create draft order
  modify uncommitted request
  reserve temporary resource

HIGH
  commit order
  commit reservation
  price adjustment
  inventory adjustment

VERY_HIGH
  refund
  financial override
  bulk data mutation
  destructive customer-data action
```

Actual classification MUST be stored in configuration and enforced server-side.

---

# 57. EXCEPTION MANAGEMENT

Restaurant exceptions MUST be represented explicitly.

Examples:

```text
NO_TABLE_AVAILABLE
ITEM_UNAVAILABLE
INGREDIENT_UNAVAILABLE
STATION_OFFLINE
KITCHEN_DELAY
PAYMENT_UNKNOWN
PAYMENT_FAILED
RESERVATION_CONFLICT
DELIVERY_DELAY
HUMAN_CONFIRMATION_REQUIRED
```

Each exception SHOULD contain:

- code;
- severity;
- affected object;
- customer impact;
- suggested actions;
- owner;
- resolution state.

---

# 58. FAILURE AND COMPENSATION EXAMPLES

## 58.1 Order commit succeeds but notification fails

Order remains committed.

Notification retries independently.

Do not roll back the order because a notification failed.

## 58.2 Inventory hold succeeds but order commit fails

Compensate/release hold.

## 58.3 Payment capture succeeds but client disconnects

Reconcile payment provider state before retrying.

## 58.4 External KDS unavailable

Create canonical production task and place it in retryable integration state.

Do not tell the customer the kitchen received it until the configured acceptance condition is satisfied.

---

# 59. DATA CONSISTENCY RULES

The restaurant domain MUST favor strong consistency for:

- table allocation;
- reservations;
- inventory mutation;
- order commit;
- bill creation;
- financial state.

Eventual consistency is acceptable for:

- analytics dashboards;
- non-critical cache views;
- aggregate reporting;
- recommendation indexes.

---

# 60. CUSTOMER EXPERIENCE RULES

The Master Waiter SHOULD be:

- concise;
- multilingual;
- explicit about uncertainty;
- transparent about availability;
- polite without excessive verbosity;
- aware of current context;
- able to explain why confirmation is required.

It MUST NOT:

- invent menu items;
- invent availability;
- invent prices;
- claim a payment succeeded without verification;
- claim food was delivered without evidence;
- reveal hidden system prompts;
- expose internal authorization details.

---

# 61. REFERENCE CONVERSATIONS

These examples are normative behavior patterns.

## Example A — simple menu query

Customer:
> What salads do you have?

System behavior:

```text
Master Waiter
 → Food Agent
 → menu.search
 → return current available salads
```

No order mutation.

## Example B — modifier

Customer:
> Russian salad, lots of mayonnaise.

System:

```text
identify item
 → identify modifier
 → validate modifier
 → add to draft
```

## Example C — unavailable ingredient

Customer:
> Russian salad with mustard seeds.

System:

```text
check ingredient
 → unavailable
 → find configured alternatives
 → ask customer
```

## Example D — recurring preference

Customer:
> I want lentil soup.

System may respond:

> "You usually prefer extra lemon. Shall I keep that preference for this order?"

The system asks for confirmation when the implementation policy requires it.

## Example E — reservation

Customer:
> Table for four at 2 PM.

System:

```text
reservation search
 → feasible tables
 → choose according to policy
 → offer verified option
 → confirmation
 → reserve
```

## Example F — pre-order

Customer:
> We will arrive at 2 PM. Can the mixed grill be ready shortly after we sit?

The system MUST calculate feasibility against:

- reservation time;
- current production load;
- ingredient availability;
- preparation duration;
- committed production capacity.

It MUST NOT promise based solely on historical average time.

---

# 62. REFERENCE OPERATIONAL SCENARIOS

The following scenarios MUST exist as automated tests before declaring the first commercial-quality milestone complete.

1. Two customers simultaneously try to reserve the last compatible table.
2. Two orders consume the last inventory units.
3. Customer requests an unavailable modifier.
4. Customer changes a committed order.
5. Payment request times out.
6. Payment succeeds after timeout.
7. Kitchen station becomes unavailable.
8. One line in a multi-line order is delayed.
9. One guest cancels one item while other guests continue.
10. Customer preference conflicts with current order.
11. Customer deletes all stored preferences.
12. Duplicate payment command arrives.
13. Duplicate order command arrives.
14. External POS sends duplicate order event.
15. KDS integration is unavailable.
16. Customer asks for allergen-sensitive information with incomplete restaurant data.
17. Reservation becomes a no-show.
18. Customer requests a specific seating attribute.
19. Operations detects sustained beverage queue pressure.
20. Temporary specialist agent is proposed, spawned, expires, and leaves no orphaned state.

---

# 63. OBSERVABILITY REQUIREMENTS

All restaurant operations MUST carry correlation context.

Minimum identifiers:

```text
tenant_id
restaurant_id
branch_id
request_id
conversation_id
session_id
order_id
reservation_id
customer_id_when_available
agent_run_id
workflow_id_when_used
payment_id_when_relevant
```

OpenTelemetry MUST capture:

- customer request span;
- orchestration span;
- agent spans;
- domain service spans;
- database operations;
- MCP tool calls;
- external provider calls;
- payment operations;
- production task processing.

Sensitive values MUST be redacted.

---

# 64. PERFORMANCE OBJECTIVES

The implementation MUST define SLOs by deployment profile.

Initial baseline targets SHOULD be configurable and measured rather than assumed.

Example categories:

```text
Customer interaction latency
Order validation latency
Order commit latency
Reservation availability query latency
Payment initiation latency
KDS dispatch latency
Event propagation latency
Voice round-trip latency
```

Performance claims MUST be based on measured telemetry.

---

# 65. API SURFACE

The restaurant backend SHOULD expose domain APIs such as:

```text
GET    /restaurants/{restaurant_id}
GET    /branches/{branch_id}/tables
GET    /menus
GET    /menus/{menu_id}/items
POST   /reservations/validate
POST   /reservations/commit
PATCH  /reservations/{id}
POST   /orders/validate
POST   /orders/commit
PATCH  /orders/{id}
POST   /orders/{id}/cancel
GET    /orders/{id}
GET    /orders/{id}/status
GET    /bills/{id}
POST   /bills/{id}/split
POST   /payments
GET    /payments/{id}
POST   /payments/{id}/refund
POST   /feedback
GET    /customers/{id}/preferences
PATCH  /customers/{id}/preferences
DELETE /customers/{id}/preferences
```

Exact transport, authentication, and versioning follow NEXUS-AO API standards.

---

# 66. REPOSITORY STRUCTURE

Recommended repository structure:

```text
nexus-restaurant-domain/
|
+-- docs/
|   +-- NEXUS_Restaurant_Domain_Specification.md
|   +-- ADR/
|   +-- contracts/
|
+-- apps/
|   +-- api/
|   +-- customer-web/
|   +-- staff-web/
|   +-- tablet-app/
|   +-- mobile-app/
|
+-- packages/
|   +-- restaurant-domain/
|   +-- restaurant-contracts/
|   +-- restaurant-policies/
|   +-- restaurant-mcp/
|   +-- restaurant-events/
|   +-- restaurant-ui/
|   +-- restaurant-integrations/
|
+-- agents/
|   +-- master-waiter/
|   +-- food/
|   +-- beverage/
|   +-- dessert/
|   +-- fruit/
|   +-- reservation/
|   +-- accounting-payment/
|   +-- feedback/
|   +-- operations/
|
+-- migrations/
+
+-- seed/
+
+-- tests/
|   +-- unit/
|   +-- contract/
|   +-- integration/
|   +-- concurrency/
|   +-- agent/
|   +-- e2e/
|   +-- chaos/
|
+-- infra/
|
+-- scripts/
+
+-- .env.example
+-- README.md
```

The actual frontend framework may follow the existing AgentCraft project conventions. The domain packages remain framework-agnostic where possible.

---

# 67. IMPLEMENTATION TECHNOLOGY BASELINE

The implementation SHALL follow the current NEXUS-AO technology baseline unless an ADR explicitly changes it.

## 67.1 Required baseline

```text
Python 3.11 for backend reference implementation
FastAPI for HTTP API
PostgreSQL 18 as transactional source of truth
pgvector for initial vector retrieval where needed
Swarm Engine for agent orchestration
MCP-compatible boundary for agent tools
OpenTelemetry for observability
```

The exact frontend framework may be the project's existing React/Vite stack.

## 67.2 Conditional infrastructure

Use only when justified:

```text
NATS JetStream
Redis
Temporal
OpenFGA
A2A
```

The development model MUST NOT introduce these simply because they are modern.

---

# 68. EXISTING / AVAILABLE IMPLEMENTATION ASSETS

The development model MUST inspect and reuse compatible existing assets before writing replacements.

## 68.1 Swarm Engine

Primary reusable orchestration foundation.

Expected package/reference:

```text
@swarm/webmcp-react
```

Capabilities already relevant to Restaurant:

- multi-agent orchestration;
- segment-based streaming;
- intent routing;
- WebMCP tool registry;
- tool audit log;
- RAG integration boundary;
- A2A integration boundary;
- sub-agent factory;
- telemetry;
- UI support components.

The Restaurant implementation MUST use these capabilities where they satisfy this specification.

## 68.2 Reference open-source restaurant projects

The implementation team SHOULD inspect existing projects for reusable ideas, test scenarios, patterns, and integration lessons before inventing equivalent implementations.

Examples to inspect:

```text
PieroPaialungaAI/RestaurantGPT
Fahad-Almaani/restaurant-ai-agent
UV012/multi-branch-restaurant-ai-agent
```

These repositories are **reference material**, not architectural authorities.

Do not copy their architecture blindly.

The NEXUS-AO contract remains authoritative.

## 68.3 General open-source infrastructure

The team SHOULD reuse mature libraries for:

- database migrations;
- validation;
- OpenTelemetry;
- MCP protocol support;
- payment provider SDKs;
- POS adapters;
- KDS adapters;
- authentication;
- testing.

Prefer established, maintained components over writing protocol implementations from scratch.

---

# 69. WHAT MUST NOT BE BUILT FROM SCRATCH

Unless an existing component cannot satisfy the required contract, do not implement custom versions of:

- MCP protocol mechanics;
- A2A protocol mechanics;
- OpenTelemetry transport/export;
- PostgreSQL transaction semantics;
- payment card handling;
- standard OAuth/OIDC flows;
- generic HTTP infrastructure;
- generic message transport when NATS fits;
- generic durable workflow engine if/when Temporal is justified.

---

# 70. WHAT MUST BE CUSTOM

The following restaurant-specific behavior MUST be custom domain code:

- restaurant rules;
- table allocation rules;
- menu/modifier semantics;
- order semantics;
- production semantics;
- inventory bill-of-materials mapping;
- restaurant resource model;
- reservation policies;
- restaurant pricing rules;
- restaurant-specific customer memory semantics;
- restaurant feedback logic;
- restaurant operations heuristics;
- agent prompts/personas/tool selection policies.

---

# 71. DEVELOPMENT PHASES

The development model MUST build in the following order.

Do not skip ahead merely because an agent UI can be produced quickly.

---

## Phase 0 — Reconnaissance and Repository Baseline

Read:

1. NEXUS-AO specification.
2. This Restaurant Domain Specification.
3. Existing Swarm Engine repository.
4. Existing AgentCraft reusable infrastructure relevant to deployment.
5. Existing restaurant reference repositories listed above.

Produce:

```text
PHASE_0_RECONNAISSANCE_REPORT.md
```

The report MUST identify:

- reusable components;
- missing components;
- compatibility risks;
- dependency constraints;
- implementation decisions already fixed by the specification.

The model MUST NOT redesign the architecture.

### Phase 0 acceptance gate

- all source specifications read;
- architecture/domain boundary understood;
- reusable assets mapped;
- no unresolved architectural ambiguity identified;
- implementation backlog created.

---

## Phase 1 — Domain Contracts and Schemas

Implement:

- entities;
- enums;
- IDs;
- DTOs;
- command schemas;
- query schemas;
- event schemas;
- agent tool contracts;
- state machines;
- policy schemas.

No conversational UI is required yet.

### Acceptance

Every domain entity has typed representation.
Every mutation has a command contract.
Every important lifecycle has explicit states.

---

## Phase 2 — PostgreSQL Operational Core

Implement:

- migrations;
- tenant/restaurant/branch model;
- tables;
- guests/customers;
- menu;
- modifiers;
- reservations;
- orders;
- production tasks;
- inventory;
- bills;
- payments;
- feedback;
- preferences;
- audit records.

Implement transactions and concurrency controls.

### Acceptance

Concurrency tests pass for:

- last-table reservation;
- last-stock consumption;
- duplicate mutation;
- bill consistency.

---

## Phase 3 — Deterministic Domain Services

Implement:

- MenuService
- TableService
- ReservationService
- OrderService
- AvailabilityService
- ResourceService
- ProductionService
- InventoryService
- BillingService
- PaymentService
- FeedbackService
- PreferenceService
- RestaurantPolicyService

These services become the authority used by agents.

### Acceptance

No agent is required to access the database directly.

---

## Phase 4 — Command / Query / Event Boundary

Implement:

- command handlers;
- query handlers;
- domain events;
- outbox;
- event publishing;
- idempotent consumers.

### Acceptance

Committed order state and event history remain consistent after simulated failures.

---

## Phase 5 — Customer and Staff API

Implement:

- reservation APIs;
- menu APIs;
- order APIs;
- billing APIs;
- payment APIs;
- feedback APIs;
- preference APIs;
- operational task APIs.

### Acceptance

A complete non-AI API journey works.

---

## Phase 6 — Swarm Engine Integration

Integrate:

- Master Waiter;
- Food Agent;
- Beverage Agent;
- Dessert Agent;
- Fruit Agent;
- Reservation Agent;
- Accounting/Payment Agent;
- Feedback Agent;
- Operations Agent.

Each agent receives only the capabilities/permissions it needs.

### Acceptance

A natural-language restaurant request successfully traverses:

```text
Customer
 → Master Waiter
 → Swarm Engine
 → specialist
 → deterministic domain service
 → transaction
 → actual result
 → Master Waiter
```

---

## Phase 7 — MCP Tool Layer

Expose typed restaurant capabilities through MCP-compatible tools.

Build policy enforcement before side effects.

### Acceptance

Tool calls are:

- authenticated;
- authorized;
- auditable;
- idempotent where relevant;
- schema validated.

---

## Phase 8 — Customer Memory and Feedback

Implement:

- persistent preferences;
- explicit consent;
- current-order overrides;
- feedback capture;
- preference refinement;
- memory deletion.

### Acceptance

The test suite verifies that one current-order override does not silently overwrite persistent customer memory.

---

## Phase 9 — Kitchen/KDS and Production Operations

Implement:

- KOT;
- KDS domain state;
- production task queue;
- station assignment;
- course sequencing;
- ready state;
- delivery confirmation;
- human intervention.

### Acceptance

A complete dine-in order moves from customer request to verified delivery.

---

## Phase 10 — Payment / POS / External Integrations

Implement adapters for the initially selected deployment providers.

At minimum, the architecture MUST allow:

- payment integration;
- POS integration;
- KDS integration.

### Acceptance

Provider failure and retry tests pass without duplicate financial or operational mutations.

---

## Phase 11 — Operations Intelligence

Implement:

- operational metrics;
- bottleneck detection;
- repeated conflict detection;
- feedback pattern detection;
- workload analysis;
- controlled sub-agent generation.

### Acceptance

The system can identify an actual workload pressure condition and propose a specialist scaling action without creating uncontrolled agent proliferation.

---

## Phase 12 — Voice and Multichannel UX

Implement:

- STT adapter;
- TTS adapter;
- mobile interaction;
- tablet interaction;
- multilingual sessions.

### Acceptance

At least one complete voice ordering flow works end to end.

---

## Phase 13 — Advanced Restaurant Operations

Add, as justified by deployment:

- delivery integrations;
- loyalty;
- multi-branch management;
- advanced promotions;
- franchise/central analytics;
- advanced customer segmentation.

These are not allowed to destabilize the transactional core.

---

## Phase 14 — Production Hardening

Implement:

- security testing;
- concurrency testing;
- failure injection;
- reconciliation jobs;
- backup/restore procedures;
- migration testing;
- telemetry dashboards;
- alerting;
- cost controls;
- operational runbooks.

### Acceptance

Production readiness checklist passes.

---

# 72. FIRST VERTICAL SLICE

The first end-to-end vertical slice MUST be exactly this:

```text
Customer at Table 7
  ↓
"I want Russian salad."
  ↓
Master Waiter
  ↓
Food Agent
  ↓
Menu service
  ↓
Current availability check
  ↓
Modifier prompt
  ↓
Customer chooses modifier
  ↓
Order validation
  ↓
Inventory/resource check
  ↓
Customer confirmation when required
  ↓
Order commit
  ↓
Production task
  ↓
Kitchen status
  ↓
READY
  ↓
Human delivery confirmation
  ↓
DELIVERED
  ↓
Bill update
  ↓
Feedback
  ↓
Memory update if explicitly allowed
```

This is the proving ground.

Do not begin with ten channels, 100 menu items, or a visually elaborate UI.

---

# 73. MINIMUM ACCEPTABLE DEMO DATA

Seed data MUST include:

## Restaurant

```text
1 restaurant
2 branches optional
```

## Tables

At least:

```text
12 tables
multiple capacities
multiple dining areas
at least 2 special attributes
```

## Menu

At least:

```text
6 categories
20+ items
multiple modifiers
at least 5 items with ingredient requirements
at least 3 items with allergen metadata
```

## Customers

At least:

```text
5 identified customers
2 with persistent preferences
1 with a current-order override scenario
```

## Reservations

At least:

```text
10 reservations
multiple overlapping time windows
one no-show scenario
```

## Inventory

At least:

```text
30 inventory items
multiple stock constraints
one scarce ingredient
```

---

# 74. REQUIRED END-TO-END DEMONSTRATIONS

The implementation is not accepted until these scenarios work.

## Demo 1 — Conversational order

Customer orders food through Master Waiter.

## Demo 2 — Per-guest preferences

Four guests at one table place distinct orders and modifiers.

## Demo 3 — Availability conflict

Customer requests unavailable ingredient; system negotiates alternative.

## Demo 4 — Reservation

Customer books a suitable table according to constraints.

## Demo 5 — Pre-order

Reservation includes verified pre-order.

## Demo 6 — Kitchen lifecycle

Order produces KOT/KDS task and reaches delivered.

## Demo 7 — Split bill

Four guests split a bill correctly.

## Demo 8 — Customer memory

Returning customer receives a preference suggestion.

## Demo 9 — Feedback intelligence

Repeated complaint becomes an operations signal.

## Demo 10 — Workload scaling

Operations agent detects sustained station overload and invokes the controlled sub-agent mechanism.

---

# 75. TESTING MATRIX

## Unit tests

Must cover:

- price calculation;
- modifier rules;
- reservation eligibility;
- table compatibility;
- inventory requirements;
- order state transitions;
- payment state transitions;
- preference confidence;
- policy evaluation.

## Contract tests

Must cover:

- REST APIs;
- MCP tools;
- payment adapters;
- POS adapters;
- KDS adapters;
- event schemas.

## Integration tests

Must cover:

- PostgreSQL transactions;
- locking;
- outbox;
- event publishing;
- provider retries;
- Swarm Engine integration.

## Agent behavior tests

Must verify:

- no unsupported promises;
- correct tool selection;
- escalation when uncertain;
- no hallucinated availability;
- no unauthorized mutation;
- correct customer consent flow.

## Concurrency tests

Must deliberately execute conflicting requests simultaneously.

## Failure tests

Must simulate:

- DB restart;
- provider timeout;
- duplicate messages;
- worker crash;
- stale order draft;
- external integration outage.

## End-to-end tests

Must execute the reference vertical slice with real infrastructure components.

---

# 76. AGENT EVALUATION CRITERIA

Agents are evaluated on operational behavior, not prose quality alone.

Minimum evaluation dimensions:

```text
Intent correctness
Tool correctness
State awareness
Authorization compliance
Constraint awareness
Consent correctness
No-silent-substitution behavior
Failure communication
Hallucination avoidance
Latency
Token cost
Customer clarity
```

A fluent agent that creates invalid transactions is considered a failed agent.

---

# 77. RESTAURANT DOMAIN DEFINITION OF DONE

The Restaurant Domain is considered implementation-complete at baseline only when:

1. NEXUS-AO is preserved.
2. Restaurant entities have typed contracts.
3. All critical state transitions are explicit.
4. PostgreSQL is authoritative.
5. Critical mutations are transactional.
6. Table conflicts are prevented.
7. Inventory conflicts are prevented.
8. Payments are idempotent.
9. Agents cannot directly mutate authoritative database state.
10. MCP mutations are authorized.
11. Swarm Engine orchestrates the agents.
12. The Master Waiter can coordinate specialist agents.
13. A complete table order can reach verified delivery.
14. A reservation can be created, modified, cancelled, and checked in.
15. A multi-guest table order can be represented correctly.
16. Bills can be split.
17. Customer preferences are consent-controlled.
18. Feedback is captured.
19. Operations detects measurable issues.
20. Audit records exist for critical mutations.
21. OpenTelemetry traces a customer request across agent/tool/domain/integration boundaries.
22. The failure and concurrency suites pass.
23. The implementation can operate without optional infrastructure when the small deployment profile is selected.
24. Optional technologies are introduced only through documented need.

---

# 78. WHAT THE DEVELOPMENT MODEL MUST NOT DO

The development model MUST NOT:

1. Replace NEXUS-AO.
2. Replace Swarm Engine with an unrelated orchestration platform.
3. Treat the LLM as database truth.
4. Store raw payment card credentials.
5. Allow agents to execute arbitrary SQL.
6. silently substitute unavailable food or modifiers.
7. claim a payment succeeded without authoritative confirmation.
8. claim an order is delivered without configured evidence.
9. let one agent bypass authorization because it is an agent.
10. create dozens of agents for cosmetic architectural complexity.
11. introduce Kubernetes without operational justification.
12. introduce Temporal on day one without a durable-workflow requirement.
13. introduce a separate vector database merely because RAG is present.
14. introduce a separate graph database merely because relationships exist.
15. hard-code one POS vendor throughout the domain.
16. hard-code one payment vendor throughout the domain.
17. make one restaurant's menu semantics part of the universal core.
18. build the polished UI before transaction correctness.
19. ask avoidable architecture questions already answered by the two specifications.
20. silently change a normative requirement.

---

# 79. ARCHITECTURE QUALITY RULE

When choosing between two implementations that satisfy the same contract, prefer the one that:

```text
reduces complexity
+ improves testability
+ preserves transaction integrity
+ reuses existing assets
+ minimizes infrastructure
+ remains domain-portable
+ reduces token/model cost
```

Do not select technology because it is fashionable.

Select it because the restaurant workload requires it.

---

# 80. REUSE BEYOND RESTAURANTS

The Restaurant implementation is intentionally a hard-domain proving ground.

A successful implementation SHOULD allow extraction of reusable patterns for:

```text
Hotels
Manufacturing
Auto Service
Clinics
Home Services
Logistics
Laundry
B2B Distribution
```

The extraction rule is:

```text
If a mechanism is proven to be domain-neutral,
move it toward NEXUS-AO.

If it contains restaurant nouns or assumptions,
keep it here.
```

Do not generalize prematurely.

---

# 81. CURRENT TECHNOLOGY REFERENCE BASELINE

This Domain Specification follows the NEXUS-AO technology reference of 2026-10-01.

The implementation should consult current official documentation before binding exact dependency versions.

Relevant references include:

- NEXUS-AO architecture specification.
- MCP specification and tool/resource documentation.
- A2A specification.
- PostgreSQL explicit locking and transaction documentation.
- pgvector documentation.
- NATS JetStream documentation.
- Temporal documentation.
- OpenTelemetry documentation.
- OpenFGA documentation.
- Swarm Engine repository/package documentation.

Reference implementation repositories to inspect:

- https://github.com/PieroPaialungaAI/RestaurantGPT
- https://github.com/Fahad-Almaani/restaurant-ai-agent
- https://github.com/UV012/multi-branch-restaurant-ai-agent

These references provide implementation ideas and failure lessons. They do not override NEXUS-AO or this specification.

---

# 82. ADR REQUIREMENTS

An ADR is mandatory before changing any of the following:

- PostgreSQL as source of truth;
- Swarm Engine as orchestration layer;
- MCP as primary tool boundary;
- A2A adapter semantics;
- domain state machine;
- payment integration semantics;
- inventory transaction semantics;
- reservation conflict semantics;
- customer memory consent model;
- multi-tenant boundary;
- critical risk policies.

Each ADR MUST state:

```text
Problem
Context
Decision
Alternatives considered
Consequences
Migration plan
Rollback plan
```

---

# 83. BUILD CHECKPOINT RULE

After every major implementation phase, the development model MUST produce:

```text
PHASE_<N>_REPORT.md
```

The report MUST contain:

- implemented scope;
- files/modules created;
- tests executed;
- test results;
- known limitations;
- deviations;
- next phase;
- whether the acceptance gate passed.

A phase MUST NOT be reported as complete when its acceptance gate is not satisfied.

A checkpoint ZIP snapshot SHOULD be created after important milestones.

---

# 84. MASTER RESTAURANT BUILD ORDER

The canonical build order is:

```text
NEXUS-AO
   ↓
Restaurant Contracts
   ↓
PostgreSQL Domain State
   ↓
Deterministic Services
   ↓
Commands / Queries / Events
   ↓
APIs
   ↓
Swarm Engine Agents
   ↓
MCP Tool Boundary
   ↓
Memory + Feedback
   ↓
Kitchen / KDS
   ↓
Payments / POS
   ↓
Operations Intelligence
   ↓
Voice / Mobile / Multichannel
   ↓
Advanced integrations
   ↓
Production hardening
```

Do not reverse this order merely to obtain a visually impressive early demo.

---

# 85. CANONICAL FIRST RELEASE BOUNDARY

The first serious release SHALL focus on:

```text
Master Waiter
Menu
Customers/Guests
Tables
Reservations
Food/Beverage/Dessert/Fruit ordering
Per-guest preferences
Order lifecycle
Kitchen tasks
Inventory checks
Billing
Payment adapter
Feedback
Customer memory
Operations monitoring
Swarm Engine
MCP
OpenTelemetry
```

The first release MAY defer:

- full franchise management;
- complex loyalty programs;
- large-scale delivery marketplace logic;
- advanced AI forecasting;
- cross-company A2A workflows;
- highly specialized procurement automation.

Deferral is not deletion.

---

# 86. CANONICAL PRODUCT TRUTH

The restaurant system is "smart" not because it has the largest number of agents.

It is smart because it can correctly reason over:

```text
Customer intent
        +
Capabilities
        +
Resources
        +
Inventory
        +
Time
        +
Constraints
        +
Commitments
        +
Human intervention
        +
Past preferences
        +
Feedback
        +
Operational learning
```

and then execute a verified transaction.

The system's intelligence therefore emerges from the combination of:

```text
LLM reasoning
+
structured domain state
+
deterministic business rules
+
transactional guarantees
+
agent orchestration
+
operational feedback
```

not from prompting alone.

---

# 87. FINAL IMPLEMENTATION INSTRUCTION TO THE DEVELOPMENT MODEL

When this document is supplied together with the NEXUS-AO specification, the development model SHALL interpret them as follows:

```text
NEXUS-AO = universal architecture authority.
NEXUS Restaurant Domain Specification = restaurant-domain authority.
Existing Swarm Engine = designated agent orchestration foundation.
PostgreSQL = authoritative operational state.
Domain services = authoritative business behavior.
Agents = reasoning, coordination, explanation, and bounded action initiators.
MCP = controlled tool boundary.
A2A = external/inter-system agent interoperability boundary where required.
OpenTelemetry = mandatory observability boundary.
```

The development model MUST:

1. Read both specifications before implementing code.
2. Follow the implementation phases in order.
3. Reuse existing Swarm Engine capabilities.
4. Inspect the referenced open-source projects before reinventing comparable mechanisms.
5. Build deterministic domain services before agent UX.
6. Implement concurrency tests before declaring ordering/reservation/inventory ready.
7. Treat payment and safety-sensitive workflows as high-risk.
8. Preserve customer consent around persistent memory.
9. Keep optional infrastructure optional until evidence requires it.
10. Create checkpoints after important phases.
11. Never silently change architecture.
12. Never ask a question whose answer is already specified here or in NEXUS-AO.
13. When a genuine external blocker exists, report the blocker precisely and continue all independent work rather than redesigning the architecture.
14. Never substitute an LLM-generated belief for authoritative operational state.

---

# 88. FINAL RESTAURANT DOMAIN ACCEPTANCE TEST

A release is accepted only when this complete scenario passes:

```text
A customer opens the restaurant interface.

The Master Waiter identifies the customer/session.

The customer asks in natural language for food.

The Food Agent finds the correct canonical menu item.

The system shows the current item, price, modifiers and relevant preparation information.

The customer selects different modifiers for different guests.

The system validates each modifier.

The system checks inventory and operational capacity.

When a requested ingredient is unavailable, the system does not silently substitute it.

The Master Waiter proposes an alternative and obtains customer consent when required.

The final order is committed transactionally.

The system creates authoritative production tasks.

Kitchen/bar/dessert capabilities process the tasks.

The customer sees actual status, not invented progress.

A human confirms physical delivery where required.

The bill reflects the authoritative order.

Guests may split the bill.

Payment is processed through an adapter with idempotency protection.

The system verifies payment status.

Feedback may be collected.

Customer preferences are updated only according to consent and confidence policy.

Operational signals are emitted.

OpenTelemetry can trace the complete transaction.

The audit history explains who/what/when for critical actions.

A process restart or integration failure does not create duplicate financial or inventory effects.
```

If this scenario works reliably under concurrency and failure injection, the Restaurant Domain has demonstrated that NEXUS-AO is functioning as a real operational architecture rather than a conversational prototype.

---

# 89. DOCUMENT AUTHORITY STATEMENT

This file is the canonical **Restaurant Domain Specification** for projects explicitly built on NEXUS-AO.

It MUST be stored in the restaurant-domain repository and versioned independently from individual restaurant deployments.

Project-specific configuration MUST be layered on top of this document rather than modifying the canonical domain model.

Recommended hierarchy:

```text
NEXUS-AO
    ↓
NEXUS Restaurant Domain Specification
    ↓
Restaurant Deployment Configuration
    ↓
Branch Configuration
    ↓
Menu / Inventory / Policy Data
    ↓
Runtime State
```

This hierarchy prevents individual restaurant customizations from corrupting the reusable domain architecture.

---

# 90. CANONICAL BUILD COMMAND

The following is the intended instruction when this specification is handed to a development model:

> **Read the NEXUS-AO Architecture Specification and this NEXUS Restaurant Domain Specification in full. Treat both as normative engineering documents. Build the Restaurant Domain on top of NEXUS-AO without redesigning the universal architecture. Reuse the existing Swarm Engine as the agent orchestration layer. Implement the deterministic transactional domain core first, using PostgreSQL as the source of truth. Implement explicit state machines, concurrency protection, idempotent mutations, event/outbox behavior, authorization, audit, and observability before relying on agent behavior. Implement specialist restaurant agents only through bounded capabilities and policy-controlled tools. Do not allow any LLM to become the source of truth for menu availability, inventory, tables, reservations, order state, billing, or payment state. Implement the phases in order and satisfy every phase acceptance gate. Inspect compatible open-source restaurant projects and existing internal assets before reinventing components, but never allow external reference implementations to override these specifications. Do not introduce optional infrastructure without a demonstrated requirement. Do not ask avoidable questions: make all decisions already defined here. When a genuine external blocker exists, document it precisely, continue independent work, and do not silently change the architecture.**

---

# 91. SIGNATURE

**Ayman × Nibras**

**Architecture:** NEXUS-AO — NEXUS Agentic Operations Architecture

**Domain:** NEXUS-RESTAURANT

**Document:** NEXUS Restaurant Domain Specification

**Status:** Build-Ready Engineering Baseline

**Date:** 2026-10-01

