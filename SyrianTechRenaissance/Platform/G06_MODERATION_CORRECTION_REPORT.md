# STR Platform — G06 Final Moderation Correction Report

> **Mission:** G06 — Institutional Functions and Governance
> **Status:** ✅ Correction complete — CI green (#119) — NOT YET MERGED
> **Report date:** 2026-10-18 (Europe/Istanbul)
> **Author:** GLM (Lead Development AI)
> **Trigger:** MASTER's "G06 — FINAL MODERATION CORRECTION" directive

---

## 1. Purpose

Per MASTER's directive, two functional issues in the moderation system were identified and corrected before merge:

1. **USER_SUSPENDED status inconsistency**: The action suspended the user but left the complaint in `ESCALATED` status (the default branch), creating a governance record contradiction.
2. **CONTENT_REMOVED no visibility enforcement**: The decision was recorded but the content remained visible. No removal flag or read-path enforcement existed.

---

## 2. Correction 1 — USER_SUSPENDED → RESOLVED_SUSPENDED

### Problem
In `decideComplaint()`, the status mapping used a default branch that sent `USER_SUSPENDED` to `ESCALATED`:
```typescript
// OLD: USER_SUSPENDED fell into the default (ESCALATED)
if (action === "WARNING") newStatus = "RESOLVED_WARNING";
else if (action === "CONTENT_REMOVED") newStatus = "RESOLVED_REMOVED";
else if (action === "DISMISS") newStatus = "RESOLVED_DISMISSED";
else newStatus = "ESCALATED"; // USER_SUSPENDED landed here!
```

### Fix
- Added `RESOLVED_SUSPENDED` to the `ModerationStatus` enum (terminal status)
- `USER_SUSPENDED` now maps to `RESOLVED_SUSPENDED` (not `ESCALATED`)
- `ESCALATED` is now reserved for the `ESCALATE` action only (complaints awaiting later processing)
- Atomicity preserved: account suspension + decision record + complaint status change + audit event all in one transaction

### Migration
- `ALTER TYPE "ModerationStatus" ADD VALUE IF NOT EXISTS 'RESOLVED_SUSPENDED'`

### Test
- Updated existing test to expect `RESOLVED_SUSPENDED` (not `ESCALATED`)
- Added new test: *"USER_SUSPENDED complaint does NOT appear in the open escalation queue"* — verifies the complaint is in `RESOLVED_SUSPENDED`, not `ESCALATED`

---

## 3. Correction 2 — CONTENT_REMOVED Visibility Enforcement

### Problem
The decision was recorded but no actual hiding occurred:
```typescript
// OLD: no visibility enforcement
if (action === "CONTENT_REMOVED" && complaint.threadId) {
  // For now, we preserve the message body (no separate removedAt field)
  // A future schema change could add ThreadMessage.removedAt if needed.
}
```

### Fix
- Added `removedAt` + `removedById` fields to `ThreadMessage` model
- Added `targetMessageId` to `ModerationComplaint` (explicit message targeting instead of relying on `threadId` alone)
- `decideComplaint()` now sets `removedAt` + `removedById` on the target message atomically within the same transaction
- `getThread()` in `communications/threads.ts` now enforces visibility:
  - **Admins + moderators**: see the original body (for audit) with `removedAt` indicator
  - **Regular users** (lead, steward, member): see `"[removed — content hidden by moderation decision]"` placeholder — they know a message was removed but cannot see the content
- The original body is **preserved in the DB** for authorized auditors — never deleted

### Migration
- `ALTER TABLE "ThreadMessage" ADD COLUMN "removedAt" TIMESTAMP(3)`
- `ALTER TABLE "ThreadMessage" ADD COLUMN "removedById" TEXT`
- `ALTER TABLE "ModerationComplaint" ADD COLUMN "targetMessageId" TEXT`
- FK constraints + indexes

### Test
- Replaced existing CONTENT_REMOVED test with comprehensive test:
  - Creates a project + thread + message (the offending content)
  - Files a complaint targeting the specific message (`targetMessageId`)
  - Moderator decides `CONTENT_REMOVED`
  - Verifies: `removedAt` is set on the target message
  - Verifies: original body is preserved in DB (not deleted)
  - Verifies: lead (regular participant) sees `"[removed]"` placeholder
  - Verifies: admin sees the original content (for audit)

---

## 4. Schema Changes Summary

### New enum value
- `ModerationStatus.RESOLVED_SUSPENDED` — terminal status for USER_SUSPENDED decisions

### New fields
| Model | Field | Type | Purpose |
|---|---|---|---|
| `ThreadMessage` | `removedAt` | `DateTime?` | When the message was removed by moderation |
| `ThreadMessage` | `removedById` | `String?` | Who removed it (FK to User) |
| `ModerationComplaint` | `targetMessageId` | `String?` | Explicit message targeting for CONTENT_REMOVED |

### New back-relations
- `User.messagesRemoved` — ThreadMessage[] (for users who removed messages)
- `ThreadMessage.complaintTargetMessage` — ModerationComplaint[] (complaints targeting this message)

---

## 5. Migration

- **Path**: `prisma/migrations/20261019030000_g06_moderation_corrections/migration.sql`
- **Operations**: 1 ALTER TYPE (ADD VALUE) + 3 ALTER TABLE (ADD COLUMN) + 3 indexes + 2 FK constraints
- **Applies cleanly** on PostgreSQL 17 (verified on CI run #119)

---

## 6. CI Verification (Run #119)

| Field | Value |
|---|---|
| Run number | `#119` |
| GitHub internal run id | `39088966014` |
| Branch | `feat/g06-institutional-functions-governance` |
| Head SHA | `a9ec307` |
| Status | `completed` |
| Conclusion | `success` |
| Typecheck · Lint · Unit Tests | 17/17 ✅ — 212/212 unit tests |
| Playwright E2E | 17/17 ✅ — 30 passed + 2 flaky (G03 + G05 email-timing; no G06 failures) |
| Run URL | https://github.com/mayakilzy/SyrianTechRenaissance-Platform/actions/runs/39088966014 |

### CI iteration for corrections (6 commits)
1. `0828bcc` — Initial correction (schema + service + tests)
2. `551dd93` — Fix: separate steward for reviewProposal (separation of duties)
3. `71f669e` — Fix: complainant is lead (not the target member, to avoid self-complaint)
4. `75e3dbf` — Fix: align assertion with actual message body
5. `0e11fb0` — Fix: robust team membership creation
6. `a9ec307` — Fix: use leadId for visibility check (confirmed participant)

---

## 7. Files Changed in This Correction

| File | Lines | Change |
|---|---|---|
| `prisma/schema.prisma` | +49/-16 | Added RESOLVED_SUSPENDED, removedAt/removedById on ThreadMessage, targetMessageId on ModerationComplaint, back-relations |
| `prisma/migrations/20261019030000_g06_moderation_corrections/migration.sql` | +36 | New migration for the above |
| `src/modules/moderation/service.ts` | +34/-20 | USER_SUSPENDED → RESOLVED_SUSPENDED, CONTENT_REMOVED sets removedAt, targetMessageId support |
| `src/modules/communications/threads.ts` | +15 | getThread visibility enforcement for removed messages |
| `src/modules/moderation/__tests__/g06-moderation.test.ts` | +133/-16 | Updated USER_SUSPENDED test + added escalation queue test + comprehensive CONTENT_REMOVED visibility test |

**Total**: 5 files, +230/-37 lines

---

## 8. What Was NOT Changed

- ❌ No source code rebuilt — only the two specific moderation issues were fixed
- ❌ No scope expanded — no new features added
- ❌ No G07 work started
- ❌ No merge to `main`
- ❌ No production seed.ts modified
- ❌ No credentials changed

---

## 9. Request to MASTER

Per MASTER's "G06 — FINAL MODERATION CORRECTION" directive, GLM has:

1. ✅ Fixed USER_SUSPENDED → complaint status is now `RESOLVED_SUSPENDED` (not `ESCALATED`)
2. ✅ Fixed CONTENT_REMOVED → actual visibility enforcement with `removedAt` on target message
3. ✅ Added unit tests proving: complaint NOT in escalation queue after USER_SUSPENDED + content hidden from regular users but visible to admins
4. ✅ Ran full CI: run #119, both jobs green, 212/212 unit + 30 E2E + 2 flaky
5. ✅ Provided final SHA (`a9ec307`) + CI results + run URL
6. ✅ Did NOT rebuild G06, did NOT expand scope, did NOT start G07

**GLM requests MASTER's review of the corrected moderation evidence and explicit authorization to merge `feat/g06-institutional-functions-governance` at SHA `a9ec307` to `main`.**

---

**Reported by:** GLM (Lead Development AI)
**Status:** G06 MODERATION CORRECTION COMPLETE — CI green #119 on `a9ec307`. Awaiting MASTER's explicit merge authorization.
