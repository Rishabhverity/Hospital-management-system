# Project Spec Index (Read First)

This repo implements a **Hospital Teleconsult & Appointment Management Platform** (India, **Web MVP**) with:
- Patient onboarding/login, doctor discovery, scheduling/slot generation
- Appointment booking + lifecycle (reschedule/cancel policies)
- Payments/receipts/refunds (vendor-agnostic)
- Teleconsult sessions (vendor-agnostic)
- Clinical docs (visit notes + prescription doc upload/sign-off)
- In-app notifications
- RBAC + privacy + immutable audit logging

---

## Where to put the original documents
Keep your original source docs here (unchanged):
- `docs/sources/SRS.docx`
- `docs/sources/Context Pack.docx`
- `docs/sources/User journey.docx`
- `docs/sources/Product Backlog (User Stories) — Grouped by Epic.docx`
- `docs/sources/Detailed Screen Specs (Field-Level).docx`
- `docs/sources/datbase design.docx`
- `docs/sources/Buisness rules catalog.xlsx`
- `docs/sources/PERSONA TABLE (Clean & Structured).docx`

---

## Read order (mandatory)
1. **AI Build Contract** (how Copilot must build): `docs/AI_BUILD_CONTRACT.md`
2. **SRS** (FR/NFR + scope): `docs/sources/SRS.docx`
3. **Business Rules Catalog** (BR-xxx is canonical): `docs/sources/Buisness rules catalog.xlsx`
4. **DB Design** (entities + constraints): `docs/sources/datbase design.docx`
5. **Screen Specs** (fields/validations/states): `docs/sources/Detailed Screen Specs (Field-Level).docx`
6. **User Journeys** (end-to-end flows): `docs/sources/User journey.docx`
7. **Product Backlog** (US-xxx, epics): `docs/sources/Product Backlog (User Stories) — Grouped by Epic.docx`
8. **Personas + RBAC matrix**: `docs/sources/PERSONA TABLE (Clean & Structured).docx`
9. **Decisions log** (what we chose + why): `docs/DECISIONS.md`

---

## Non-negotiables
- **Business Rules (BR-xxx) are the source of truth** for policy and time windows.
- **UI must match Screen Specs** (fields, validations, empty/error states).
- **APIs must align with DB models** and SRS requirements.
- **RBAC is deny-by-default** and enforced server-side for every sensitive action.
- **Timezone is Asia/Kolkata (IST)** for all scheduling calculations.

---

## Defaults & assumptions captured in specs
- Slot duration allowed values: **10/15/20/30 minutes**
- Cancellation window default: **24 hours** (configurable)
- Reschedule window default: **12 hours** (configurable)
- No-show grace default: **10 minutes** (configurable)
- MVP notifications: **in-app only** (no SMS/WhatsApp/email in MVP)
- Payment + teleconsult providers are **vendor-agnostic/abstracted**

---

## Epics (Product Backlog)
| Epic | Name | Status |
| --- | --- | --- |
| E1 | Identity & Access (RBAC) | ✅ **COMPLETE** |
| E2 | Patient Profile & Consent | 🔄 Not Started |
| E3 | Doctor Directory & Discovery | 🔄 Not Started |
| E4 | Scheduling Engine (Slots & Integrity) | 🔄 Not Started |
| E5 | Appointment Booking & Lifecycle | 🔄 Not Started |
| E6 | Reschedule & Cancellation Policies | 🔄 Not Started |
| E7 | Payments, Receipts & Refunds | 🔄 Not Started |
| E8 | Teleconsult Experience | 🔄 Not Started |
| E9 | Clinical Documents (Visit Notes & Prescription) | 🔄 Not Started |
| E10 | Follow-up Continuity | 🔄 Not Started |
| E11 | In-app Notifications | 🔄 Not Started |
| E12 | Admin Configuration, Reporting & Audit | 🔄 Not Started |

---

## Screens (Detailed Screen Specs)
Patient:
- P-01 OTP Login
- P-02 Home / Doctor Search
- P-03 Doctor Profile
- P-04 Slot Picker
- P-05 Booking Confirmation
- P-06 Payment
- P-07 My Appointments
- P-08 Appointment Detail
- P-09 Teleconsult Waiting Room
- P-10 Receipts & Refunds
- P-11 Profile & Consent

Doctor:
- D-01 Doctor Dashboard (Today)
- D-02 Availability Setup
- D-03 Exception Blocks
- D-04 Appointment Detail (Doctor)
- D-05 Teleconsult Room (Doctor)
- D-06 Notes & Prescription

Reception:
- R-01 Reception Dashboard
- R-02 Patient Lookup/Create
- R-03 Booking Wizard (Staff)
- R-04 Check-in / Queue
- R-05 Appointment Detail (Reception)

Admin:
- A-01 Admin Dashboard
- A-02 Branch & Department Management
- A-03 Doctor Management
- A-04 Policies & Rules
- A-05 Fees & Payments
- A-06 Refund Approvals
- A-07 Reports
- A-08 Audit Log Viewer

---

## Functional requirements list (SRS)
(Use this for traceability when implementing APIs/services.)

FR-001 User authentication (OTP-based)  
FR-002 Patient profile management  
FR-003 Staff user management (Admin creates staff accounts)  
FR-004 Browse/search doctors by department/branch/availability  
FR-005 Doctor profile view  
FR-006 Configure slot duration  
FR-007 Doctor availability templates and exception blocks  
FR-008 Slot generation and retrieval  
FR-009 Prevent double-booking  
FR-010 Slot hold during checkout  
FR-011 Create appointment (teleconsult or in-clinic)  
FR-012 Appointment status lifecycle enforcement  
FR-013 Reception booking on behalf of patient  
FR-014 In-clinic check-in  
FR-015 Payment-required booking rule  
FR-016 Payment processing and confirmation  
FR-017 Idempotent payment callbacks  
FR-018 Refund eligibility computation  
FR-019 Refund workflow with approval (if enabled)  
FR-020 Idempotent refund initiation  
FR-021 Reschedule window enforcement  
FR-022 Cancellation window enforcement  
FR-023 Atomic reschedule swap  
FR-024 Fee difference handling on reschedule (if applicable)  
FR-025 Teleconsult session join/launch (vendor-agnostic)  
FR-026 Teleconsult session start/end timestamps  
FR-027 Permission guidance (camera/mic)  
FR-028 Network drop recovery  
FR-029 Doctor completes encounter / visit outcome  
FR-030 Prescription document upload + versioning (MVP-safe)  
FR-031 Patient views prescription (read-only)  
FR-032 Follow-up booking link to parent  
FR-033 In-app notification feed  
FR-034 Notification read/unread  
FR-035 Link follow-up to parent visit  
FR-036 Appointment reminders  
FR-037 Status change notifications  
FR-038 Manage branches and departments  
FR-039 Manage doctors and assignments  
FR-040 Configure policies (cancellation/reschedule/no-show/refund approval)  
FR-041 Basic reporting dashboards  
FR-042 Capture consent before first teleconsult  
FR-043 Immutable audit logging for critical events  

---

## Business rules index (canonical policy list)
BR-001 Slot duration allowed values; fixed increments  
BR-002 Availability generates slots only within configured windows  
BR-003 Exception blocks override availability (disable/remove slots)  
BR-004 Prevent double-booking (server-side concurrency safe)  
BR-005 Slot hold on selection; expires and releases slot  
BR-006 Appointment status lifecycle allowed transitions only  
BR-007 Payment-required booking: PendingPayment until success  
BR-008 Payment failure must not confirm booking; allow retry  
BR-009 Payment callbacks idempotent; receipt generated on success  
BR-010 Reschedule allowed only outside reschedule window (IST)  
BR-011 Cancellation allowed only outside cancellation window (IST)  
BR-012 Override requires authorized role + reason + audit  
BR-013 Refund eligibility based on policy; store rationale  
BR-014 Refund approval (if enabled) only by authorized roles  
BR-015 Refund initiation idempotent  
BR-016 No-show marking rules + grace window  
BR-017 Teleconsult join permission checks (who can join/when)  
BR-018 Teleconsult reconnect/network recovery behavior  
BR-019 Appointment start timing rules (join window vs start)  
BR-020 No-show grace time configurable  
BR-021 Check-in rules for in-clinic flow  
BR-022 Staff booking attribution (actor must be logged)  
BR-023 Doctor unavailable handling (reschedule/refund options)  
BR-024 Fee difference handling (phase2/if enabled)  
BR-025 Receipt numbering rules (unique/format)  
BR-026 Prescription versioning rules  
BR-027 Follow-up linkage rules  
BR-028 Reminder offsets rules  
BR-029 Status change notification rules  
BR-030 Consent required before first teleconsult  
BR-031 Consent versioning immutable for past records  
BR-032 Immutable audit log for critical actions  
BR-033 RBAC enforcement rules  
BR-034 Data minimization per role  
BR-035 Timezone normalization (Asia/Kolkata)

---

## Implementation Status

### ✅ Completed
**Epic E1 - Identity & Access (December 23, 2025)**
- User authentication (OTP-based) - FR-001 ✅
- JWT token generation and validation ✅
- Role-based access control (RBAC) - BR-033 ✅
- User model with 6 roles ✅
- Standard error schema with correlation ID ✅
- Comprehensive test coverage (25 tests) ✅
- **Files:** See `backend/IMPLEMENTATION_SUMMARY.md`

### 🔄 In Progress
None

### 📋 Planned
- Epic E2: Patient Profile & Consent
- Epic E3: Doctor Directory & Discovery
- Epic E4-E12: See Product Backlog above

---

## Code pointers
Backend (✅ Implemented):
- Flask app entry: `backend/wsgi.py`
- App factory: `backend/app/__init__.py`
- Auth routes: `backend/app/api/auth/routes.py`
- Auth service: `backend/app/modules/auth_service.py`
- DB models: `backend/app/db/models/user.py`
- Middleware: `backend/app/middleware/*`
- Tests: `backend/app/tests/*`
- **Docs:** `backend/README.md`, `backend/TESTING.md`

Frontend (🔄 Not Started):
- Pages per screen: `frontend/src/pages/*`
- API wrapper: `frontend/src/services/api.js`

---

## Working agreement
When implementing any story/feature:
1) Identify the relevant **US-xxx**, **FR-xxx**, **BR-xxx**, and **Screen P/D/R/A-xx**  
2) Implement backend **API + service + model + migration + tests**  
3) Implement frontend screen + validations + error/empty states  
4) Add audit events if required  
5) Update `docs/DECISIONS.md` if anything was chosen/changed
