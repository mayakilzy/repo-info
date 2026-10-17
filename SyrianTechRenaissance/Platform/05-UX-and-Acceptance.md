# STR Platform — UX Routes and Browser Acceptance

## Experience goals

Internationally credible institution, not a forum or unverified mock portal. Arabic-first with correct RTL and full English localization; accessible keyboard flows, meaningful focus states, sufficient contrast, mobile-friendly, robust error/empty/loading states. Clear future Academy/Engineering labels **not live**.

## Page map (logical; URLs are suggested)

| Audience | Screens |
|---|---|
| Public | Home, Mission, Principles, Fields, Public Projects, Opportunities, Partnerships, Join, Contact, Academy (coming later), Tools (directory) |
| Auth | Sign up, Verify Email, Sign In, Continue with Google, Password Reset, Account Linking |
| Member | Dashboard, Professional Profile, Privacy & Settings, Notifications, My Applications |
| Talent | Search Talent, Profile Preview respecting visibility |
| Proposals | Create Proposal, Project Charter Editor, Revision History, Review Status |
| Teams | Approved Team Detail, Members/Invitations, Steward & Lead Info, Scope/Permissions |
| Opportunities | Discover, Detail, Apply, Review Applicants |
| Projects | Project Workspace, Milestones, Tasks, Deliverables, Reviews, Contributions |
| Organizations | Partnership Request, Organization Workspace/Representatives |
| Governance | Review Queue, Approvals, Complaints, Suspension/Decision/Audit |
| Integrations | Tool Directory, Provider Detail, Connections, Job History, Admin Provider Approval |
| Reporting | Institution Dashboard, verified Impact Records |

## Primary human journeys

1. **New user:** email registration → confirmation → profile → apply to opportunity → status; repeat login with Google only if linking proof established.
2. **Project governance:** member proposes idea → completes charter with reviewer feedback → reviewer verifies and assigns steward → approves → team and project exist exactly once → lead invites members → steward monitors scope.
3. **Rejected proposal:** denied status recorded with reason, no team workspace, no tool resource grants.
4. **Work handoff:** assigned team member submits deliverable → reviewer accepts or requests changes → contributor is recorded → appropriate evidence referenced.
5. **Institutional partnership:** request → review/decision → role-granted organization access only, no unauthorized data exposure.
6. **Integration simulation:** admin approves mock provider → project gains scoped grant → connector job submitted → async result visible → revoke → new jobs blocked.

## E2E browser matrix (minimum)

Roles: visitor, unverified member, verified member, proposer, team lead, team member, assigned steward, reviewer, admin and unrelated member. Test on desktop/mobile viewport, Arabic RTL and English. Every critical journey has **positive and negative cases**. Use isolated test fixtures/identities; record screenshots, redacted browser traces and API observations.

### Non-negotiable negative cases

- Anonymous/unverified member cannot create/approve operational team.
- Malicious proposal missing charter cannot transition to approved.
- No `Steward` assignment => no team creation.
- Unrelated member cannot read/update private team's data via direct URL/API.
- No escalation by forging role or project IDs.
- Cannot execute revoked connector connection or counterfeit webhook.
- Google account collision never silently merges into another account.
- Project lifecycle cannot skip required reviews.
- UI error displays are meaningful; refresh/back do not corrupt state.

## Acceptance evidence format

For each scenario: `Scenario ID`, `Role`, `Environment URL`, `Commit SHA`, `Steps`, `Observed UI`, `API/DB evidence where permissible`, `Screenshot/trace path`, `Result PASS/FAIL`, `Known limitations`. Terminal unit test count is supplementary, not substitute for lived browser flows. Do not report PASS based only on mocked screenshots.

## UX approval plan

Before visual work, deliver wireframes and navigation model with real states; establish typography, colors, RTL rules, contrast and components. Review with founder; implement design system once; verify Arabic/English screens in browser. No extra modules without documented scope change.
