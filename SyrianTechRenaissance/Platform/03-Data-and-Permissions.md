# STR Platform — Data Model & Authorization Specification

## Logical entity groups

| Group | Entities and invariants |
|---|---|
| Identity | User, AuthIdentity(provider,providerSub unique), EmailVerification, Session, RoleGrant(scope) |
| Member | MemberProfile, Skill, MemberSkill, PortfolioItem, ProfileVisibility |
| Charter | ProjectProposal, CharterRevision, ReviewDecision, ApprovalRecord |
| Teams | Team(projectId unique for primary team), TeamMembership, TeamInvitation, StewardAssignment |
| Projects | Project, ProjectMember, Milestone, WorkTask, Deliverable, DeliverableReview |
| Opportunities | Opportunity, OpportunityApplication, OpportunityReview |
| Organizations | Organization, OrganizationRepresentative, PartnershipRequest |
| Rights | Contribution, RightsDeclaration, AgreementReference |
| Comms | Notification, ProjectThread, ThreadMessage |
| Governance | AuditEvent, ModerationCase, ResourceGrant, Suspension |
| Integrations | Provider, ProviderCapability, Connection, IntegrationJob, IntegrationEvent, CredentialReference |
| Impact | ImpactRecord, EvidenceReference, MeasurementMethod |

## Relationships and isolation

`User 1—1 MemberProfile`, `User 1—N AuthIdentity`, `User N—M Team via TeamMembership`; `ProjectProposal 1—N CharterRevision`; approval produces `Project 1—N Team` (v1 can limit to one primary team; avoid database constraint if multi-team expected). `Project 1—N WorkTask, Deliverable, ResourceGrant`. Every sensitive row includes project/organization owner reference where appropriate; derive scope from trusted database relationships, not caller-supplied IDs alone.

## Required database invariants

1. `AuthIdentity(provider, providerSub)` globally unique; email normalized carefully but never trusted as sole external identity key.
2. `ProjectProposal` approval creates project/team exactly once under concurrent retries; guard via transaction and unique approved-proposal reference.
3. Operational teams must reference **approved Project**; prevent orphan teams and direct bypass via generic team-create endpoint.
4. Active teams require an active leader and **institutional steward**. A steward reassignment must happen safely before outgoing steward is removed.
5. Approved `CharterRevision` is immutable. Revised scope requires another revision/approval.
6. Role grants scoped to resource and issued by authorized roles. No privilege escalation through self-editing profile/team membership.
7. Contribution attribution and evidence immutable except explicit audited corrections; do not treat it as ownership assignment.
8. Provider credentials stored via `CredentialReference` (never plaintext in exposed queries or audit logs).
9. Integration job belongs to a connection **and** authorized subject; project suspension and grant revocation block subsequent work.
10. Audit logs record actor, action, object, outcome and time; strip secrets and minimize PII.

## Lifecycle state charts

- Proposal: `draft → submitted → needs_revision → submitted → approved | rejected | withdrawn`. Rejection and resubmission policy reviewed by governance.
- Project: `preparation → approved → active → review → completed`, with `paused/cancelled` guarded transitions.
- Opportunity: `draft → review → published → closed/cancelled`.
- Application: `submitted → review → accepted/rejected/withdrawn`.
- Task: `open → in_progress → in_review → accepted/changes_requested`.
- Partnership: `inquiry → assessment → negotiation → approved/closed`.
- Integration: `registered → approved → enabled → suspended/revoked`; Connection has `pending/active/revoked/error`.

## Sample policy matrix

| Action | Member | Project Lead | STR Steward | Admin/Reviewer |
|---|---|---|---|---|
| Submit proposal | Yes if verified | Yes | Yes | Yes |
| Approve own proposal | No | No | No unless independent authorized reviewer policy | Reviewer only, no conflict of interest |
| Create operational team directly | **No** | **No** | **No** | Only through proposal-approval service |
| Invite to approved team | No by default | Yes within charter | Review/escalate | Delegated |
| Request tool capability | Propose only | Within project grant request | Review/escalate | Approve per risk policy |
| Read private project | Only assigned | Assigned | Assigned | Explicit case-limited authority |
| Suspend project/resources | No | Request | Emergency escalate/temporary action as authorized | Authorized governance role |
| Modify another user grants | No | Limited team role grants only | No unrestricted grant | Explicit privileged role |

**All permissions enforced server-side and tested across resources, not only UI.**

## Privacy defaults

Public profile displays opt-in fields; avoid publishing exact contact or whereabouts without authorization. Restrict sensitive attachments via short-lived signed URLs and authorization. Support account export/deletion requests subject to legitimate retention and legal duties. Audit access to restricted documents where useful. Retention terms to be approved before production and reflected in privacy notices.

## Negative testing catalogue

- Anonymous and unverified attempts to approve/create team (403).
- Submitted proposal without charter or steward (422 or conflict; no team created).
- Parallel double approvals (single project/team).
- Cross-team member modifying others' deliverables / invitation / resource grant (403).
- Project lead granting own admin role (403).
- Project suspended but job dispatch attempted (deny).
- Email collision across Google/password providers (require account possession proof; no auto-link).
- Invalid state transitions and malicious file/URL injection rejected.
