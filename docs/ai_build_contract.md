# AI Build Contract (Copilot Execution Rules)

This file is the **hard contract** for GitHub Copilot (Claude Sonnet 4.5) when generating code in this repo.

If any instruction below conflicts with generated code, **the code must be changed to comply**.

---

## 1) Source-of-truth precedence (no guessing)
When building any feature, follow this order:

1. `docs/sources/Buisness rules catalog.xlsx` (BR-xxx) — **policy truth**
2. `docs/sources/Detailed Screen Specs (Field-Level).docx` — **UI truth**
3. `docs/sources/SRS.docx` — FR/NFR + acceptance criteria + error handling
4. `docs/sources/datbase design.docx` — data model + constraints + DDL guidance
5. `docs/sources/User journey.docx` — flow truth
6. `docs/sources/Product Backlog (User Stories) — Grouped by Epic.docx` — sprint slicing truth
7. `docs/sources/Context Pack.docx` + `docs/sources/PERSONA TABLE (Clean & Structured).docx` — role expectations

**Copilot must not invent** missing rules, fields, statuses, screens, or workflows.
If something is unclear, add it to `docs/DECISIONS.md` as an **Open Question** and implement with a safe default only if the SRS allows.

---

## 2) Non-negotiables (must enforce)
### Policy enforcement
- Enforce **BR-xxx** server-side for every action (booking, hold, payment confirmation, reschedule/cancel, refunds, join windows).
- All scheduling calculations must use **Asia/Kolkata (IST)** (BR-035).

### RBAC & privacy
- Deny-by-default authorization for every API endpoint and sensitive UI action (NFR-001, BR-033).
- Data returned must be scoped by role (NFR-002, BR-034).

### Audit logging
- Create immutable audit entries for critical actions (BR-032 / FR-043):
  - policy change
  - refund approval / initiation
  - override actions (reschedule/cancel override, etc.)
  - role changes / staff actions that affect patients
- Audit records must include actor, timestamp, entity, before/after, reason, correlation_id.

### Idempotency
- Payment callbacks and refund initiation must be idempotent (BR-009, BR-015; FR-017, FR-020).

### Error handling contract
Every error response must follow:
```json
{
  "code": "STRING_CODE",
  "message": "Human readable message",
  "correlation_id": "uuid",
  "details": {}
}
