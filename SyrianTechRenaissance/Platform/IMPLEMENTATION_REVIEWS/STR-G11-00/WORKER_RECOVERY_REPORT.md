# STR-G11-00 — Worker Recovery Report

> **Mission:** STR-G11-00
> **Code repo fix commit SHA:** `e8386fa`
> **Test execution date:** 2026-10-22

---

## 1. Executive Summary

The worker recovery audit verified the outbox worker's behavior under
failure conditions. **No new defects were found.** The existing G09 +
G10-01V tests provide strong coverage of worker lifecycle. The G11-00
audit confirmed the existing coverage is sound and did not identify
gaps that require remediation.

---

## 2. Worker Architecture (recap)

The STR worker (`src/worker/index.ts` + `src/modules/integrations/outbox-worker.ts`):
- Polls the `OutboxEvent` table for undelivered events.
- Atomically claims an event via `updateMany WHERE dispatchedAt=null AND (claimedAt=null OR claimedAt < threshold)`.
- Finds the corresponding `IntegrationJob`, atomically claims it via `updateMany WHERE status="queued"`.
- Calls `adapter.executeJob()`.
- Writes the result conditionally (`updateMany WHERE status="running" AND claimedBy=workerId`).
- Marks the outbox event as dispatched (after processing completes).

Lease mechanism:
- 60-second threshold (`RECOVERY_THRESHOLD_MS = 60000`).
- On startup, `recoverAbandonedJobs()` re-queues any `IntegrationJob` with `status="running"` and `claimedAt < (now - 60s)`.
- Also recovers any `OutboxEvent` with `dispatchedAt=null` and `claimedAt < (now - 60s)`.

Graceful shutdown:
- `AbortSignal` + `cancellableSleep` (G10-01 FINAL HARDENING).
- SIGTERM/SIGINT triggers `abortController.abort()`.
- Loop exits after current iteration (no new job claimed after abort).
- 30-second forced-exit timer as last-resort safeguard.

---

## 3. Test Coverage

### 3.1 Existing coverage (G09 + G10-01V)

| Test file | Tests | What it verifies |
|-----------|-------|------------------|
| `g09-outbox-reliability.test.ts` | 10 | Concurrent lease attempts, crash after OutboxEvent claim, crash after IntegrationJob claim, crash after result write, no lost events, permanent failure handling, lease expiration, sync recovery, concurrent webhook receipts, duplicate event with valid HMAC |
| `g10-01v-worker-shutdown.test.ts` | (count varies) | AbortSignal-based graceful shutdown, cancellableSleep no timer leaks, in-flight job completes naturally |
| `g07-webhook-worker.test.ts` | 4 | Worker processes a queued job via OutboxEvent, worker does NOT overwrite a cancelled job (conditional update), recovers abandoned jobs (worker crash recovery), marks timed-out jobs |
| G10-02 integration CI | B1-B5, C1-C4 | Health/readiness endpoints, DB outage behavior, worker startup, job processing, SIGTERM graceful shutdown (exit 0), worker restart |

### 3.2 New G11-00 coverage

None specifically for worker recovery (the existing coverage is strong).
However, the new adversarial test #1 (concurrent proposal approvals)
exercises a related code path: the `approveProposalAtomically` function
uses the same `updateMany WHERE status=...` optimistic-lock pattern
as the worker. The test confirms the pattern is sound.

---

## 4. Failure Scenarios Verified

### 4.1 Worker crash before claiming a job

**Scenario:** Worker polls, finds a job, but crashes before claiming it.

**Result:** Job remains `queued`, OutboxEvent remains `dispatchedAt=null`.
Next worker start polls and finds the same job. No data loss.

**Verified by:** `g09-outbox-reliability.test.ts` (implicit — the "no lost events" test).

### 4.2 Worker crash after claiming OutboxEvent but before claiming IntegrationJob

**Scenario:** Worker claims OutboxEvent (sets `claimedAt`), crashes before
claiming the IntegrationJob.

**Result:** OutboxEvent has `claimedAt` set but `dispatchedAt=null`. After
60s, `recoverAbandonedOutboxEvents()` resets `claimedAt=null`, allowing
re-claim. IntegrationJob is still `queued` (untouched).

**Verified by:** `g09-outbox-reliability.test.ts` test "crash after OutboxEvent claim: recovery re-queues and job completes".

### 4.3 Worker crash after claiming IntegrationJob but before executing

**Scenario:** Worker claims OutboxEvent + IntegrationJob (sets `claimedAt`
on both, sets IntegrationJob `status="running"`), crashes before
`adapter.executeJob()`.

**Result:** After 60s, `recoverAbandonedJobs()` resets both: OutboxEvent
`claimedAt=null`, IntegrationJob `status="queued"`, `claimedAt=null`.
Next worker start re-processes from scratch.

**Verified by:** `g09-outbox-reliability.test.ts` test "crash after IntegrationJob claim: recovery re-queues both, job completes".

### 4.4 Worker crash after result write but before marking OutboxEvent dispatched

**Scenario:** Worker calls `adapter.executeJob()`, writes the result
(sets IntegrationJob `status="succeeded"`), crashes before marking
OutboxEvent `dispatchedAt`.

**Result:** IntegrationJob is `succeeded` (terminal state). OutboxEvent
has `dispatchedAt=null`. On next worker start, the recovery loop finds
the OutboxEvent. The `processNextOutboxEvent` function finds the
IntegrationJob, sees `status !== "queued"`, and marks the OutboxEvent
as dispatched WITHOUT re-executing the job.

**Verified by:** `g09-outbox-reliability.test.ts` test "crash after result write: NO re-execution, outbox gets dispatched".

### 4.5 Worker crash DURING `adapter.executeJob()` — NOT TESTED

**Scenario:** Worker calls `adapter.executeJob()`, the adapter starts
executing (potentially with external side effects), worker crashes
mid-execution.

**Result:** IntegrationJob is `running` with `claimedAt` set. After
60s, `recoverAbandonedJobs()` resets it to `queued`. Next worker start
re-processes. **The adapter may have partially applied side effects.**

**Status:** NOT_TESTED. This is the known limitation carried from G10-03.

**Why it's staging-safe:** Staging uses the mock adapter, which is
idempotent (re-running it with the same `idempotencyKey` produces the
same result without duplicating side effects). No real external
integrations are wired yet.

**Why it's a production blocker:** When real adapters (Google Drive,
Slack, email, etc.) are wired, each MUST be:
1. Made idempotent (re-running with the same idempotencyKey produces
   the same result without duplicating side effects).
2. Tested for crash-during-execution recovery.
3. Documented for its specific recovery semantics.

This is tracked in DEFECT_REGISTER.md as FOLLOW-UP-3.

### 4.6 Job timeout

**Scenario:** Job's `timeoutAt` passes while still `running`.

**Result:** `checkTimeouts()` marks the job as `timed_out` with
`retryable=true`. The outbox event remains `dispatchedAt=null`, so
the next worker start will re-process.

**Verified by:** `g07-webhook-worker.test.ts` test "marks timed-out jobs".

### 4.7 Permanent failure (retryable=false)

**Scenario:** Adapter returns `retryable=false` (e.g., invalid payload).

**Result:** Job marked `failed` with `retryable=false`. Outbox event
marked dispatched (no retry).

**Verified by:** `g09-outbox-reliability.test.ts` test "permanent failure (retryable=false): job marked failed, outbox dispatched".

### 4.8 Graceful shutdown (SIGTERM)

**Scenario:** SIGTERM received mid-poll.

**Result:**
1. `AbortController.abort()` fires.
2. If sleeping in `cancellableSleep`, the sleep returns immediately.
3. Loop checks abort at top of next iteration, exits.
4. If a job is in-flight, it completes naturally (the abort does not
   interrupt `adapter.executeJob()`).
5. Worker logs `outbox.worker.shutdown.complete` and exits 0.
6. 30-second forced-exit timer as last-resort safeguard (only fires
   if `adapter.executeJob()` takes >30s to return after abort).

**Verified by:** `g10-01v-worker-shutdown.test.ts` + G10-02 CI C3
(strict SIGTERM test: exit code 0 + 3 specific log messages).

### 4.9 Worker restart

**Scenario:** Worker exits (cleanly or via crash), then restarts.

**Result:** On startup, runs `recoverAbandonedJobs()` which re-queues
any stale claims. Then enters the normal polling loop.

**Verified by:** G10-02 CI C4 (worker restart enters polling loop again).

---

## 5. Idempotency Analysis

### 5.1 What IS idempotent

- **OutboxEvent claim:** `updateMany WHERE dispatchedAt=null AND (claimedAt=null OR claimedAt<threshold)`.
  Re-claiming an already-claimed event is a no-op (the WHERE clause fails).
- **IntegrationJob claim:** `updateMany WHERE status="queued"`. Re-claiming
  a running job is a no-op.
- **Result write:** `updateMany WHERE status="running" AND claimedBy=workerId`.
  Re-writing a completed job's result is a no-op (the WHERE clause fails
  because status is no longer "running").
- **Mock adapter execution:** `getMockAdapter().executeJob()` is idempotent
  (re-running with the same idempotencyKey returns the same result).

### 5.2 What is NOT guaranteed idempotent (production blocker)

- **Real adapter execution:** When real adapters (Google Drive, Slack,
  email) are wired, each adapter's `executeJob()` must be made
  idempotent. The platform does NOT currently provide a generic
  idempotency-key-based deduplication mechanism at the adapter level
  (the `idempotencyKey` field exists on `IntegrationJob` but is not
  enforced by the worker).

**Recommendation:** Before wiring any real adapter, add a pre-execution
check: `SELECT result FROM IntegrationJob WHERE idempotencyKey=? AND status="succeeded"`.
If a result exists, return it without re-executing. This is a
FOLLOW-UP-4 item.

---

## 6. Conclusion

Worker recovery is well-tested for the mock-adapter scenario. The
lease mechanism, conditional result writes, and graceful shutdown all
work as designed. The only NOT_TESTED scenario is "crash DURING
adapter.executeJob()", which is staging-safe (mock adapter is
idempotent) but a production blocker once real adapters are wired.

**No new defects found.** No remediation needed in G11-00.
