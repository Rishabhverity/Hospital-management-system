1. Purpose
This SRS defines requirements for a web-only platform that enables patients to book and manage in-clinic and teleconsult appointments in a multi-specialty hospital chain, including payments, in-app notifications, doctor scheduling, admin configuration, and auditability.

2. Scope
2.1 In Scope (MVP)
Patient onboarding and account/profile management


Doctor discovery (by department/branch/availability) and profiles


Slot creation from doctor availability + exception blocks


Appointment booking, reschedule, cancel with policy enforcement


Payments (confirm booking where required), receipts, refund workflow (policy-based)


Teleconsult session launch/join tied to appointment (vendor-agnostic)


Doctor-authored visit outcome notes and prescription document upload/sign-off (no medical advice automation)


Follow-up booking linked to prior visit


In-app notifications (reminders, status changes, payment/refund updates)


RBAC for Patient/Doctor/Reception/Support/Branch Admin/Super Admin


Admin configuration for branches, departments, doctors, schedules, fees, policies


Logging and audit trails for critical actions


2.2 Out of Scope (MVP)
AI symptom checking, diagnosis, treatment suggestions, unsafe medical advice


Insurance/TPA claims, EMR integrations, inpatient/ER workflows


SMS/WhatsApp/email notifications (MVP uses in-app only)


Multi-language UI (English-only in MVP)



3. Users and Roles
Patient


Doctor


Reception


Support Agent


Branch Operations Admin


Super Admin


Role permissions must align with the RBAC matrix previously defined, and be enforced server-side.

4. Functional Requirements (FR)
Format: FR-ID — Description | Priority | Dependencies | Acceptance Criteria (Given/When/Then) | Related Rules
4.1 Authentication & User Profile
FR-001 — User authentication (OTP-based)
Priority: MVP


Dependencies: External OTP service (assumed), User DB


Acceptance Criteria:


Given a registered phone number, when the user requests login, then the system sends an OTP and prompts for entry.


Given a valid OTP, when submitted within expiry, then the system authenticates the user and creates a session.


Given an invalid/expired OTP, when submitted, then the system rejects it and allows retry/resend.


Related Rules: BR-035


FR-002 — Patient profile management
Priority: MVP


Dependencies: FR-001


Acceptance Criteria:


Given an authenticated patient, when they update name/contact details, then changes are saved and visible in profile.


Given invalid input, when saving, then the system shows validation errors and does not persist changes.


Related Rules: BR-034, BR-032


FR-003 — Staff user management (Admin creates staff accounts)
Priority: MVP


Dependencies: Admin console, RBAC


Acceptance Criteria:


Given an Admin role, when they create a staff account with role assignment, then the staff member can log in and access allowed screens only.


Given insufficient permissions, when a non-admin attempts staff creation, then the system denies the action.


Related Rules: BR-033, BR-032



4.2 Doctor Directory & Discovery
FR-004 — Browse/search doctors by department/branch/availability
Priority: MVP


Dependencies: Doctor catalog, availability slots (FR-008)


Acceptance Criteria:


Given search filters, when the patient searches, then matching doctors with next available slots are displayed.


Given no matches, when searching, then the system shows a “no results” state with alternate suggestions (date/branch).


Related Rules: BR-035


FR-005 — Doctor profile view
Priority: MVP


Dependencies: Doctor catalog


Acceptance Criteria:


Given a doctor selection, when patient opens profile, then system shows department(s), branch(es), consultation types, fee, and available slots.


Related Rules: BR-034



4.3 Scheduling, Slot Creation & Integrity
FR-006 — Configure slot duration
Priority: MVP


Dependencies: Admin config


Acceptance Criteria:


Given an Admin, when they set slot duration, then only allowed values are accepted and saved.


Related Rules: BR-001


FR-007 — Doctor availability templates and exception blocks
Priority: MVP


Dependencies: FR-006


Acceptance Criteria:


Given a doctor, when availability windows are configured, then slots are generated only within those windows.


Given an exception block, when it overlaps generated slots, then those slots are removed/disabled from booking.


Related Rules: BR-002, BR-003


FR-008 — Slot generation and retrieval
Priority: MVP


Dependencies: FR-006, FR-007


Acceptance Criteria:


Given a date range, when slots are requested for a doctor/branch, then only valid, non-blocked slots are returned.


Related Rules: BR-001, BR-002, BR-003


FR-009 — Prevent double-booking
Priority: MVP


Dependencies: FR-008


Acceptance Criteria:


Given two concurrent attempts for the same slot, when both try to confirm, then only one succeeds and the other receives “slot taken”.


Related Rules: BR-004


FR-010 — Slot hold during checkout
Priority: MVP


Dependencies: FR-008


Acceptance Criteria:


Given a patient selects a slot, when proceeding to confirmation/payment, then the system creates a temporary hold and shows expiry.


Given the hold expires, when no confirmation occurs, then the slot becomes available again.


Related Rules: BR-005



4.4 Appointment Booking, Status & Lifecycle
FR-011 — Create appointment (teleconsult or in-clinic)
Priority: MVP


Dependencies: FR-001, FR-008, FR-010


Acceptance Criteria:


Given an available held slot, when patient confirms booking, then an appointment record is created with correct type and initial status.


Related Rules: BR-006, BR-035


FR-012 — Appointment status lifecycle enforcement
Priority: MVP


Dependencies: FR-011


Acceptance Criteria:


Given an appointment in a state, when an action triggers status change, then only allowed transitions occur; invalid transitions are rejected.


Related Rules: BR-006


FR-013 — Reception booking on behalf of patient
Priority: MVP


Dependencies: RBAC, patient lookup/create


Acceptance Criteria:


Given Reception role, when booking for a patient, then appointment is created and attributed to receptionist (actor logged).


Related Rules: BR-032, BR-034


FR-014 — In-clinic check-in
Priority: MVP


Dependencies: FR-011, RBAC


Acceptance Criteria:


Given a scheduled in-clinic appointment, when reception marks arrival, then the system stores check-in timestamp and updater identity.


Related Rules: BR-021, BR-032



4.5 Payments, Receipts & Refunds
FR-015 — Payment-required booking rule
Priority: MVP


Dependencies: Payment integration, FR-011


Acceptance Criteria:


Given teleconsult booking with payment required, when appointment is created, then status is PendingPayment until payment success.


Related Rules: BR-007


FR-016 — Payment processing and confirmation
Priority: MVP


Dependencies: External payment provider (vendor-agnostic), FR-015


Acceptance Criteria:


Given a payment attempt, when provider returns success, then appointment becomes Confirmed and receipt is generated.


Given provider returns failure, when received, then appointment remains unconfirmed and retry is offered.


Related Rules: BR-008, BR-009


FR-017 — Idempotent payment callbacks
Priority: MVP


Dependencies: FR-016


Acceptance Criteria:


Given duplicate payment confirmations for the same reference, when processed, then the system does not create duplicate receipts or duplicate confirmations.


Related Rules: BR-009


FR-018 — Refund eligibility computation
Priority: MVP


Dependencies: Cancellation flow, policy config


Acceptance Criteria:


Given a cancelled paid appointment, when refund policy is applied, then the system marks refund as eligible/ineligible and stores rationale.


Related Rules: BR-013


FR-019 — Refund workflow with approval (if enabled)
Priority: MVP


Dependencies: FR-018, RBAC


Acceptance Criteria:


Given refund approval required, when refund is requested, then status is RefundPendingApproval until an authorized approver approves.


Given an unauthorized user, when attempting approval, then the system denies the action.


Related Rules: BR-014, BR-033, BR-032


FR-020 — Idempotent refund initiation
Priority: MVP


Dependencies: Payment integration


Acceptance Criteria:


Given repeated refund initiation requests for the same original payment, when processed, then only one refund record is created and tracked.


Related Rules: BR-015



4.6 Reschedule & Cancellation
FR-021 — Reschedule window enforcement
Priority: MVP


Dependencies: FR-011


Acceptance Criteria:


Given an appointment start time, when patient attempts reschedule, then system allows only if outside reschedule window; otherwise blocks or requires override.


Related Rules: BR-010, BR-012, BR-035


FR-022 — Cancellation window enforcement
Priority: MVP


Dependencies: FR-011


Acceptance Criteria:


Given appointment start time, when patient attempts cancellation, then system allows only if outside cancellation window; otherwise blocks or requires override.


Related Rules: BR-011, BR-012, BR-035


FR-023 — Atomic reschedule swap
Priority: MVP


Dependencies: Slot hold, scheduling integrity


Acceptance Criteria:


Given a reschedule attempt, when the new slot cannot be confirmed, then the old appointment remains unchanged.


Related Rules: BR-023


FR-024 — Fee difference handling on reschedule
Priority: Phase2


Dependencies: Fees config, payment/refund workflows


Acceptance Criteria:


Given a reschedule to a slot with different fee, when confirmed, then the system either collects difference or initiates refund delta per configuration.


Related Rules: BR-024


FR-025 — Doctor unavailability after confirmation
Priority: MVP


Dependencies: Exceptions, notification engine


Acceptance Criteria:


Given a confirmed appointment becomes impacted by doctor unavailability, when the schedule changes, then patient is notified and offered reschedule/refund options.


Related Rules: BR-022, BR-029, BR-032



4.7 Teleconsult
FR-026 — Teleconsult join window
Priority: MVP


Dependencies: Appointment schedule, notifications


Acceptance Criteria:


Given a teleconsult appointment, when current time reaches join window, then “Join Teleconsult” becomes available; outside window it is hidden/disabled.


Related Rules: BR-016


FR-027 — Teleconsult session start/end tracking
Priority: MVP


Dependencies: Teleconsult interface


Acceptance Criteria:


Given doctor starts the session, when connected, then start timestamp is stored; when ended, end timestamp and final status are stored.


Related Rules: BR-032


FR-028 — Permission checks and guided recovery
Priority: MVP


Dependencies: Web capabilities


Acceptance Criteria:


Given camera/mic denied, when user tries to join, then system shows clear steps to enable permissions and retry.


Related Rules: BR-017


FR-029 — Network drop recovery
Priority: MVP


Dependencies: Teleconsult interface


Acceptance Criteria:


Given a dropped connection, when reconnect attempts occur, then system retries and informs users; if retries fail, it provides fallback options.


Related Rules: BR-018


FR-030 — Late join and no-show handling
Priority: MVP


Dependencies: Appointment timing


Acceptance Criteria:


Given patient joins after start time, when joining, then system flags late.


Given patient does not join within grace period, when grace elapses, then authorized staff can mark no-show.


Related Rules: BR-019, BR-020



4.8 Prescription / Visit Notes (Doctor-authored)
FR-031 — Doctor creates visit outcome notes
Priority: MVP


Dependencies: Doctor access, appointment completed flow


Acceptance Criteria:


Given a completed/ended consultation, when doctor records outcome notes, then notes are saved and visible to authorized viewers.


Related Rules: BR-034, BR-032


FR-032 — Prescription document creation and sign-off
Priority: MVP


Dependencies: Doctor role, document storage


Acceptance Criteria:


Given a draft prescription, when doctor signs it, then the document becomes locked with timestamp and version.


Related Rules: BR-025


FR-033 — Patient access to signed prescription only
Priority: MVP


Dependencies: FR-032


Acceptance Criteria:


Given an unsigned prescription, when patient views visit, then it shows “Awaiting sign-off”; when signed, it becomes viewable/downloadable.


Related Rules: BR-026


Safety constraint: The system must not generate medical advice; it only stores doctor-authored documents.

4.9 Follow-up
FR-034 — Follow-up recommendation and booking shortcut
Priority: MVP


Dependencies: Appointment completion, booking flow


Acceptance Criteria:


Given doctor flags follow-up needed, when patient views summary, then system offers “Book follow-up” pre-filtered to same doctor/department.


Related Rules: BR-027


FR-035 — Link follow-up to parent visit
Priority: MVP


Dependencies: FR-034


Acceptance Criteria:


Given a follow-up is booked, when saved, then it stores reference to the original appointment for history continuity.


Related Rules: BR-027



4.10 Notifications (In-app)
FR-036 — Appointment reminders
Priority: MVP


Dependencies: Scheduling, notification service


Acceptance Criteria:


Given reminder offsets, when appointment approaches, then in-app reminders are generated at configured times.


Related Rules: BR-028, BR-035


FR-037 — Status change notifications
Priority: MVP


Dependencies: Appointment lifecycle, payments/refunds


Acceptance Criteria:


Given appointment status changes (confirm/reschedule/cancel/doctor unavailable), when change occurs, then patient receives an in-app notification.


Related Rules: BR-029



4.11 Admin Configuration & Reporting
FR-038 — Manage branches and departments
Priority: MVP


Dependencies: Admin console


Acceptance Criteria:


Given an Admin, when they create/edit branches or departments, then changes are saved and reflected in search filters.


Related Rules: BR-032


FR-039 — Manage doctors and assignments
Priority: MVP


Dependencies: FR-038


Acceptance Criteria:


Given an Admin, when they create/update doctor profiles and assign departments/branches, then doctor appears correctly in discovery and scheduling.


Related Rules: BR-032, BR-034


FR-040 — Configure policies (cancellation/reschedule/no-show/refund approval)
Priority: MVP


Dependencies: Admin console, audit


Acceptance Criteria:


Given an Admin, when policies are updated, then they apply per effective date and are audited.


Related Rules: BR-010, BR-011, BR-012, BR-020, BR-013, BR-014, BR-032


FR-041 — Basic reporting dashboards
Priority: MVP


Dependencies: Data aggregation


Acceptance Criteria:


Given a date range, when admin views reports, then system shows bookings, cancellations, no-shows, and payment totals (role-scoped).


Related Rules: BR-034



4.12 Consent & Audit
FR-042 — Capture consent before first teleconsult
Priority: MVP


Dependencies: Consent content config


Acceptance Criteria:


Given a patient booking teleconsult for the first time, when consent is displayed, then booking proceeds only if consent is accepted and recorded with version/timestamp.


Related Rules: BR-030, BR-031


FR-043 — Immutable audit logging for critical events
Priority: MVP


Dependencies: Logging subsystem


Acceptance Criteria:


Given critical actions (policy change, refund approval, override), when performed, then audit log records actor, timestamp, before/after, and reason (if override).


Related Rules: BR-032



5. Non-Functional Requirements (NFR)
NFR-001 — Security (RBAC enforcement)
Server-side authorization for every API and sensitive UI action; deny-by-default.


Related: BR-033, BR-034


NFR-002 — Privacy & Data Minimization
Role-based data visibility; restrict patient data to minimum necessary.


Related: BR-034


NFR-003 — Auditability
Audit logs are immutable, queryable by authorized roles, and retained per hospital policy (jurisdiction-dependent).


Related: BR-032


NFR-004 — Performance
Common pages (doctor list, slots, appointments) should load within acceptable UX thresholds under expected load (targets to be finalized).


NFR-005 — Availability & Reliability
Core booking and payment confirmation flows must tolerate transient failures via retries and idempotency.


Related: BR-009, BR-015


NFR-006 — Usability
Booking completion should be achievable in a small number of steps with clear policy messages.


NFR-007 — Timezone Consistency
All scheduling calculations use configured timezone (default IST).


Related: BR-035


NFR-008 — Maintainability
Business rules/policies must be configurable (where applicable) without code changes (within admin-configured limits).



6. Data Requirements
6.1 Core Entities (Minimum)
User: id, role, name, phone, email(optional), status, created_at


Patient Profile: demographics (minimal), consent status/version/timestamp


Doctor: id, department(s), branch(es), consultation types, fee, status


Branch: id, name, address (optional), status


Department: id, name, status


Availability Template: doctor_id, day_of_week, start/end windows, slot_duration


Exception Block: doctor_id/branch_id, start/end, reason/type


Slot (logical/derived): doctor_id, branch_id, start/end, status (available/held/booked/blocked)


Appointment: id, patient_id, doctor_id, branch_id, type, start/end, status, created_by, timestamps


Payment: appointment_id, amount, currency, provider_ref, status, timestamps


Receipt/Invoice: payment_id, receipt_no, generated_at


Refund: payment_id, amount, status, approval_actor, timestamps


Teleconsult Session: appointment_id, join window, start/end timestamps, connection events summary


Prescription Document: appointment_id, versions, signed_by, signed_at, file_ref


Follow-up Link: appointment_id, parent_appointment_id


Notification: user_id, type, payload, status (delivered/read)


Audit Log: actor_id, action, entity, entity_id, before/after, reason, timestamp


6.2 Data Sensitivity
All patient-identifiable and clinical-adjacent data is sensitive and must be protected via NFR-001/NFR-002.

7. External Interfaces (Vendor-agnostic)
Payment Provider Interface: initiate payment, receive status callbacks, query status, initiate refunds (if supported).


Teleconsult Interface: create/join session tied to appointment; track start/end; reconnect behavior.


OTP/Identity Interface (Assumed): send OTP, verify OTP.


SMS/Email/WhatsApp notifications are not required for MVP (in-app only).

8. Error Handling Requirements
Standard error response structure (code, message, correlation_id).


User-friendly UI errors for:


Slot taken / hold expired (BR-005, BR-004)


Payment failed / callback delayed (BR-008, BR-009)


Policy restriction (BR-010, BR-011)


Teleconsult permission denied / reconnect failure (BR-017, BR-018)


Recovery actions must be offered where applicable (retry payment, refresh slots, contact support, reschedule options).



9. Logging and Audit
Operational logs: request/response metadata (excluding sensitive payloads), error traces, performance timings.


Audit logs (immutable): policy changes, refund approvals, overrides, role changes, schedule changes, data access by support/admin where applicable.


Must store: actor, timestamp, entity, before/after, reason, correlation id.


Related: BR-032



10. Assumptions
MVP is web-only and English-only.


Default slot duration is configurable among 10/15/20/30 minutes (BR-001).


Cancellation window: 24 hours; Reschedule window: 12 hours (configurable).


No-show grace: assumed 10 minutes (configurable) (BR-020).


Teleconsult and payment providers are abstracted (no vendor lock-in).


Legal/compliance specifics (retention wording, consent text) are jurisdiction- and hospital-policy dependent; the system supports versioned consent and audited policy changes.


Project Setup Sheet (region, MVP scope, platforms, video, payments, notifications)


Product Brief / Vision Doc


Personas + Roles


RBAC / Permissions Matrix


User Journeys / Flow Maps


Business Rules Catalog (BR-xxx)


2) Requirements artifacts
SRS (FR-xxx + NFR-xxx + data + interfaces + audit/logging)


Traceability skeleton (FR ↔ future stories/tests)


3) Agile planning artifacts
Epics & Features list


User Stories backlog (US-xxx) with Given/When/Then


Prioritization + MVP scope


Sprint plan / Release plan (e.g., 4 sprints)

