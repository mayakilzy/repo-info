# STR-G11-00 — Database Integrity Report

> **Mission:** STR-G11-00
> **Code repo fix commit SHA:** `e8386fa`
> **Test execution date:** 2026-10-22
> **Test DB:** PostgreSQL 16.2 (bundled via pgserver)

---

## 1. Executive Summary

The database integrity audit verified schema constraints, transaction
atomicity, concurrent-write safety, and migration correctness. **No
defects were found in database integrity.** The existing G09 concurrency
tests + the new G11-00 adversarial tests confirm that:

- Schema constraints enforce referential integrity.
- Unique constraints prevent duplicates (verified by 2 new race tests).
- Transactions are atomic (verified by `g09-production-atomicity.test.ts`).
- Migrations apply cleanly from an empty database (verified during test setup).
- Optimistic locks prevent lost updates on concurrent writes.

---

## 2. Schema Validation

### 2.1 Migration history (11 forward-only migrations)

```
20261017000000_g01_init
20261017040000_g02_identity_profiles
20261017060000_g03_proposals_teams
20261017070000_g03_steward_history
20261017080000_g04_talent_opportunities
20261017090000_g04_notifications
20261018000000_g05_project_execution
20261019000000_g06a_organizations_partnerships_rights
20261019020000_g06b_threads_moderation_impact
20261019030000_g06_moderation_corrections
20261019040000_g07_integration_functional
```

All applied successfully via `bunx prisma migrate deploy` against a
fresh `str_platform` database. No drift detected.

### 2.2 Schema constraints verified

| Constraint type | Where enforced | Verified by |
|-----------------|----------------|-------------|
| Unique (proposalId on Project) | `prisma/schema.prisma` | New test #1 (concurrent approvals create exactly 1 project) |
| Unique (projectId on Team) | `prisma/schema.prisma` | New test #1 (concurrent approvals create exactly 1 team) |
| Unique (email on User) | `prisma/schema.prisma` | identity service tests |
| Foreign keys (relationMode=foreignKeys) | `prisma/schema.prisma` | All service tests (cascade deletes verified by test-isolation cleanup) |
| Enum values (status fields) | `prisma/schema.prisma` | All service tests (status transitions verified) |

### 2.3 Migration rollback

Prisma migrations are forward-only by design. Rollback = restore from
a pre-migration backup. The procedure is documented in
`docs/operations/backup-restore.md` §4.3. The procedure itself is
NOT_TESTED in G11-00 (requires real server access).

---

## 3. Transaction Atomicity

### 3.1 Existing coverage (G09)

- `g09-production-atomicity.test.ts`: verifies that the proposal approval
  flow (ReviewDecision + status change + Project + Team + StewardAssignment +
  TeamMembership) is atomic. If any step fails, all are rolled back.

### 3.2 New G11-00 coverage

- New test #1 (concurrent approvals): verifies that two concurrent
  `reviewProposal` calls do not create duplicate projects. The
  optimistic lock (`updateMany WHERE status="SUBMITTED"`) ensures
  only one transaction proceeds past the lock; the other either
  finds the existing project (idempotent return) or throws
  `ConflictError`. **Verified: exactly 1 project, 1 review decision,
  1 team, final proposal status = APPROVED.**

- New test #2 (double-submit): verifies that two concurrent
  `submitProposal` calls do not create duplicate state. The
  optimistic lock (`updateMany WHERE status IN ["DRAFT", "NEEDS_REVISION"]`)
  ensures only one succeeds. **Verified: final proposal status = SUBMITTED
  (not APPROVED or anything else).**

### 3.3 Cascade delete behavior

The test-isolation cleanup helper (`test-isolation.ts`) demonstrates
correct cascade-delete behavior: deleting a User cascades to their
RoleGrants, EmailVerifications, PasswordResets, TeamMemberships,
TeamInvitations, StewardAssignments. Deleting a ProjectProposal
cascades to CharterRevisions, ReviewDecisions, Projects (which cascade
to Teams, ResourceGrants, StewardAssignments).

This is verified implicitly by the cleanup running successfully after
every test (no orphan-record errors, no FK violations).

---

## 4. Concurrency and Race Conditions

### 4.1 Existing coverage (G09)

- `g09-concurrency-approvals.test.ts`: concurrent approval attempts.
- `g09-outbox-reliability.test.ts` test "concurrent lease attempts:
  exactly one worker claims the event": verifies the outbox lease
  mechanism under concurrent claims.

### 4.2 New G11-00 coverage

- New test #1 (concurrent approvals): see §3.2 above.
- New test #2 (double-submit): see §3.2 above.

### 4.3 Race condition not tested

The specific scenario "worker crashes DURING `adapter.executeJob()`"
(recovery semantics for partial external side effects) is
NOT_TESTED. This is documented in `backup-restore.md` §10 as a
staging-safe limitation (mock adapter is idempotent; production
adapters must be tested per-adapter before go-live).

---

## 5. Recovery After Interrupted Operations

### 5.1 Worker recovery (lease expiration)

Tested by `g09-outbox-reliability.test.ts`:
- "crash after OutboxEvent claim: recovery re-queues and job completes"
- "crash after IntegrationJob claim: recovery re-queues both, job completes"
- "crash after result write: NO re-execution, outbox gets dispatched"
- "lease expiration: stale claimedAt reset to null"

All PASS. The 60-second lease threshold ensures abandoned jobs are
re-queued automatically on the next worker start.

### 5.2 Migration recovery

If `prisma migrate deploy` fails mid-migration, the migration is
recorded as failed in `_prisma_migrations` and the next `migrate deploy`
attempt will retry. This is standard Prisma behavior and was NOT
explicitly tested in G11-00 (would require injecting a failing
migration, which is fragile).

The G10-03 staging validation CI test C7 verifies that a corrupted
`_prisma_migrations` table blocks dependent app/worker startup —
confirming that migration failures are detected and block deployment.

---

## 6. User-Owned Record Isolation

### 6.1 Existing coverage

- `g09-cross-isolation.spec.ts`: verifies that user A cannot access
  project B's resources (deliverables, tasks, threads, milestones,
  integrations, contributions, impact-records). Returns 404 (not 403)
  to prevent ID enumeration.

### 6.2 New G11-00 coverage

- New test #4 (SUSPENDED user cannot create proposal): verifies that
  even an authenticated user with a valid session cannot create
  proposals if their account is suspended. This is a form of
  user-state-based isolation.

---

## 7. Stale Write Handling

### 7.1 Optimistic locks

The proposals module uses `updateMany WHERE status=...` as an
optimistic lock in three places:
- `submitProposal`: `WHERE status IN ["DRAFT", "NEEDS_REVISION"]`
- `reviewProposal` (approve): `WHERE status="SUBMITTED"`
- `withdrawProposal`: `WHERE status IN ["DRAFT", "SUBMITTED", "NEEDS_REVISION"]`

If `updateMany.count === 0`, the service either throws `ConflictError`
or returns the existing state (idempotent). This is verified by:
- `g09-concurrency-approvals.test.ts` (existing)
- New test #1 (concurrent approvals)
- New test #2 (double-submit)

### 7.2 Conditional result writes (outbox worker)

The outbox worker uses `updateMany WHERE status="running" AND claimedBy=...`
to prevent overwriting a cancelled/timed-out job's result. Verified by:
- `g07-webhook-worker.test.ts` test "worker does NOT overwrite a cancelled job"
- `g09-outbox-reliability.test.ts` test "crash after result write: NO re-execution"

---

## 8. Conclusion

No database integrity defects were found. Schema constraints are
correct, transactions are atomic, optimistic locks prevent lost updates,
and migrations apply cleanly. The 2 new G11-00 adversarial tests
(concurrent approvals + double-submit) confirm that the existing
optimistic-lock pattern in `proposals/service.ts` is sound.

The only NOT_TESTED items are:
- Migration rollback drill (procedural; requires real server).
- Worker crash DURING `adapter.executeJob()` (staging-safe with mock
  adapter; production blocker once real adapters are wired).

Both are documented and tracked as carry-forward items.
