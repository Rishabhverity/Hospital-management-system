
---

# ✅ File 3: `docs/DECISIONS.md`

```md
# Decisions Log (Architecture + Product)

This file records decisions made while implementing the system.
Update this every time we choose something that affects:
- data model, API shape, RBAC, policies, workflows, UX, integrations.

---

## Accepted decisions (initial)
| Date | Decision | Status | Rationale | References |
| --- | --- | --- | --- | --- |
| 2025-12-19 | Tech stack: Flask backend + vanilla HTML/CSS/JS frontend | Accepted | Matches repo direction; easy incremental delivery | SRS + Screen Specs |
| 2025-12-19 | Timezone = Asia/Kolkata (IST) for all scheduling and policy windows | Accepted | Prevents inconsistent time calculations | BR-035; NFR-007 |
| 2025-12-19 | Vendor-agnostic integrations for OTP, payments, teleconsult | Accepted | Avoid lock-in; enables swapping providers | SRS External Interfaces |
| 2025-12-19 | Notifications are in-app only for MVP | Accepted | Explicitly stated MVP constraint | SRS + Context Pack |
| 2025-12-19 | RBAC is deny-by-default; server-side enforcement on every sensitive API | Accepted | Security + privacy requirement | NFR-001, BR-033, BR-034 |
| 2025-12-19 | Immutable audit logging for critical actions (policy change, refund approval, overrides, etc.) | Accepted | Compliance + traceability | BR-032; FR-043; NFR-003 |
| 2025-12-19 | Idempotency: payment callbacks and refund initiation must be idempotent | Accepted | Prevent duplicate confirmations/refunds | BR-009, BR-015; FR-017, FR-020 |

---

## Domain decisions (from specs)
### Status enums (must align across DB + API + UI)
**Slot status**:
- AVAILABLE, HELD, BOOKED, BLOCKED  
Notes:
- If HELD then hold_expires_at_utc must be set (DB constraint recommended)

**Appointment status**:
- PENDING_PAYMENT, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW, RESCHEDULED  
Rules:
- Only allowed transitions permitted (reject invalid transitions)

**Refund status** (if enabled):
- PENDING_APPROVAL, INITIATED, COMPLETED, FAILED (extend only if SRS allows)

---

## Soft-delete strategy
- Soft-delete master data: users/patients/doctors/departments/branches/availability rules (and optionally slots)
- Do not soft-delete transactional records: appointments, payments, refunds, audit logs, encounters, prescriptions, consents
- Default queries must exclude soft-deleted rows

Status: Accepted (aligned to DB Design)

---

## Policy defaults (configurable)
| Policy | Default | Notes |
| --- | --- | --- |
| Slot duration allowed | 10/15/20/30 minutes | Fixed allowed set |
| Cancellation window | 24 hours | Configurable; enforce in IST |
| Reschedule window | 12 hours | Configurable; enforce in IST |
| No-show grace | 10 minutes | Configurable |

Status: Accepted (from SRS assumptions; still configurable)

---

## Open questions (must resolve before/while implementing)
Add new items here whenever the docs don’t specify a single answer.

1) **Which database for dev/prod?** (Postgres recommended vs MySQL)
- Impact: migrations + time handling + JSON fields
- Proposed default: Postgres for local/dev unless org requires MySQL

2) **Staff authentication method**
- OTP for staff too, or password-based staff accounts created by Admin?
- Must match SRS + UX screens.

3) **Payment required rules by visit type**
- Teleconsult appears payment-required in rules; confirm whether in-clinic can be “confirmed without payment” by default.
- If configurable, define policy flags + UI messages.

4) **Refund approvals default**
- Is approval required by default or optional per branch?
- Define policy config behavior and who can approve.

5) **Branch vs chain admin scope**
- Clarify scope boundaries for Branch Ops Admin vs Super Admin vs Support.

---

## Decision template (copy/paste for new entries)
| Date | Decision | Status | Rationale | References |
| --- | --- | --- | --- | --- |
| YYYY-MM-DD | <what we decided> | Proposed/Accepted/Rejected | <why> | <BR/FR/US/Screen refs> |
