Product Backlog (User Stories) — Grouped by Epic
Estimates: S (≤2 days), M (3–5 days), L (6–10 days)
 Priority: MVP / Phase2
 Dependencies: refer to story IDs and/or FR/BR where helpful

E1. Identity & Access (RBAC)
US-001 — Patient OTP Login
Priority: MVP


Estimate: M


Dependencies: FR-001


Story: As a patient, I want to log in using OTP, so that I can securely access my appointments and teleconsults.


AC (Given/When/Then):


Given I enter a registered phone number, when I request OTP, then the system sends OTP and shows an input screen.


Given I enter a valid OTP within expiry, when I submit, then I am logged in and redirected to Home.


Given OTP is invalid/expired, when I submit, then I see an error and can retry/resend.


US-002 — Staff Login (Doctor/Reception/Admin)
Priority: MVP


Estimate: M


Dependencies: US-001, FR-003


Story: As a staff user, I want to log in, so that I can perform my role-specific tasks.


AC:


Given I have a staff account, when I log in successfully, then I see role-specific navigation.


Given I lack permission for a screen/action, when I try to access it, then I receive “Access denied” and the attempt is logged.


US-003 — Role-Based Access Enforcement
Priority: MVP


Estimate: M


Dependencies: US-002


Story: As a platform admin, I want RBAC enforced server-side, so that users cannot access data/actions outside their role.


AC:


Given a user role, when they call a restricted API/action, then the system denies with a standardized error code.


Given a denied attempt, when it occurs, then it is written to audit/security logs (role, action, timestamp).



E2. Patient Profile & Consent
US-004 — Patient Profile Update
Priority: MVP


Estimate: S


Dependencies: US-001, FR-002, BR-034


Story: As a patient, I want to update my profile details, so that my appointments and communications are accurate.


AC:


Given I am logged in, when I edit my contact details and save, then changes persist and are visible.


Given invalid inputs, when I save, then I see validation messages and data is not saved.


US-005 — Teleconsult Consent Capture (Versioned)
Priority: MVP


Estimate: M


Dependencies: US-001, FR-042, BR-030, BR-031


Story: As a patient, I want to review and accept teleconsult consent, so that I can proceed with teleconsult bookings.


AC:


Given I book my first teleconsult, when consent is shown, then I must accept to continue.


Given I accept, when booking continues, then consent is stored with version + timestamp.


Given consent version updates, when I book a new teleconsult, then I must accept the latest version.



E3. Doctor Directory & Discovery
US-006 — Search Doctors by Department/Branch
Priority: MVP


Estimate: M


Dependencies: US-001, US-014 (doctor setup), FR-004


Story: As a patient, I want to search doctors by department and branch, so that I can find the right doctor near me.


AC:


Given I select department and branch, when I search, then I see matching doctors.


Given no doctors match, when I search, then I see a clear empty state and suggestions.


US-007 — View Doctor Profile and Fees
Priority: MVP


Estimate: S


Dependencies: US-006, FR-005


Story: As a patient, I want to view doctor profile details, so that I can choose confidently.


AC:


Given I open a doctor profile, when it loads, then I see specialization, consultation types, fee, and available slots (if any).



E4. Scheduling Engine (Slots & Integrity)
US-008 — Admin Configures Slot Duration
Priority: MVP


Estimate: S


Dependencies: US-002, FR-006, BR-001


Story: As an admin, I want to set slot duration, so that appointments follow operational standards.


AC:


Given allowed durations (10/15/20/30), when I save a duration, then it is accepted and used for slot generation.


Given an invalid duration, when I save, then it is rejected with an error.


US-009 — Doctor Sets Weekly Availability
Priority: MVP


Estimate: M


Dependencies: US-002, US-008, FR-007, BR-002


Story: As a doctor, I want to set my weekly availability, so that patients can book appropriate slots.


AC:


Given availability windows, when I save, then slots are generated only inside those windows.


Given overlapping windows, when I save, then the system prevents duplicates or normalizes them.


US-010 — Doctor Adds Exception Block (Leave/Blocked Time)
Priority: MVP


Estimate: S


Dependencies: US-009, FR-007, BR-003


Story: As a doctor, I want to block time for leave, so that patients cannot book during that period.


AC:


Given I add an exception block, when it overlaps slots, then those slots become unavailable.


Given a slot is already booked, when I block it, then the system flags impacted appointments for admin workflow (doctor-unavailable handling).


US-011 — Slot Hold During Booking
Priority: MVP


Estimate: M


Dependencies: US-006, FR-010, BR-005


Story: As a patient, I want a temporary slot hold, so that I don’t lose my slot while paying.


AC:


Given I select a slot, when I proceed to checkout, then the slot is held for the configured duration and a timer is shown.


Given the hold expires, when I try to pay/confirm, then I’m informed and asked to pick another slot.


US-012 — Prevent Double Booking
Priority: MVP


Estimate: M


Dependencies: US-011, FR-009, BR-004


Story: As a system, I want to prevent double-booking, so that two appointments can’t occupy the same slot.


AC:


Given two users attempt to confirm the same slot, when both submit confirmation, then only one succeeds and the other gets “slot taken”.



E5. Appointment Booking & Lifecycle
US-013 — Patient Books Appointment (In-clinic/Teleconsult)
Priority: MVP


Estimate: M


Dependencies: US-006, US-011, FR-011, BR-006


Story: As a patient, I want to book an appointment, so that I can consult a doctor in-clinic or via teleconsult.


AC:


Given an available held slot, when I confirm booking, then an appointment is created with correct type and status.


Given the slot becomes unavailable, when I confirm, then booking fails with “slot taken” and I can choose another.


US-014 — Admin Creates Doctor Profile & Assignments
Priority: MVP


Estimate: M


Dependencies: US-002, FR-039


Story: As an admin, I want to create doctor profiles and assign departments/branches, so that patients can discover and book them.


AC:


Given required doctor details, when I save, then doctor appears in discovery with correct branch/department.


Given missing required fields, when I save, then the system blocks save with validation errors.


US-015 — Reception Books on Behalf of Patient
Priority: MVP


Estimate: M


Dependencies: US-002, US-013, FR-013, BR-032


Story: As a receptionist, I want to book appointments for patients, so that walk-ins and phone callers can be scheduled quickly.


AC:


Given I search/create a patient, when I book a slot, then appointment is created and “created_by” is the receptionist.


Given I attempt outside my branch scope, when booking, then the system blocks it (if branch-scoped).


US-016 — Reception Marks Check-in (In-clinic)
Priority: MVP


Estimate: S


Dependencies: US-015, FR-014, BR-021


Story: As a receptionist, I want to mark a patient as checked-in, so that the doctor and staff know the patient has arrived.


AC:


Given an in-clinic appointment, when I mark check-in, then the system stores timestamp and updater identity.


Given a teleconsult appointment, when I try to check-in, then the system blocks or shows “not applicable”.



E6. Reschedule & Cancellation Policies
US-017 — Patient Reschedules Within Window Policy
Priority: MVP


Estimate: M


Dependencies: US-013, BR-010, BR-023


Story: As a patient, I want to reschedule an appointment, so that I can change my visit time when needed.


AC:


Given current time is before the reschedule window, when I reschedule, then the system allows me to pick a new slot.


Given I confirm new slot, when saving, then reschedule happens atomically (old kept if new fails).


US-018 — Patient Cancel Within Cancellation Window Policy
Priority: MVP


Estimate: S


Dependencies: US-013, BR-011


Story: As a patient, I want to cancel an appointment, so that I can avoid attending when I’m unavailable.


AC:


Given current time is before cancellation window, when I cancel, then appointment status becomes Cancelled.


Given I am within cancellation window, when I cancel, then I see a restriction message and next steps.


US-019 — Admin Override Late Cancel/Reschedule With Reason
Priority: MVP


Estimate: M


Dependencies: US-018, BR-012, BR-032


Story: As a branch admin, I want to override late cancel/reschedule, so that exceptions can be handled operationally with traceability.


AC:


Given an appointment inside the restriction window, when I override, then I must provide a reason and the action is audited.


Given a non-admin tries override, when attempted, then the system denies.



E7. Payments, Receipts & Refunds
US-020 — Pay to Confirm Teleconsult Booking
Priority: MVP


Estimate: L


Dependencies: US-013, BR-007


Story: As a patient, I want to pay online, so that my teleconsult appointment is confirmed.


AC:


Given teleconsult requires payment, when I proceed, then appointment is PendingPayment until payment success.


Given payment succeeds, when callback is processed, then appointment becomes Confirmed and receipt is generated.


US-021 — Handle Payment Failure & Retry
Priority: MVP


Estimate: M


Dependencies: US-020, BR-008


Story: As a patient, I want to retry after a payment failure, so that I can still confirm my booking.


AC:


Given payment fails, when I return to app, then I see failure reason and a retry option.


Given retry succeeds within pending window, when processed, then appointment confirms.


US-022 — Generate Receipt/Invoice (Idempotent)
Priority: MVP


Estimate: M


Dependencies: US-020, BR-009


Story: As a patient, I want to view/download my receipt, so that I have proof of payment.


AC:


Given payment success, when I open appointment details, then I can view receipt.


Given duplicate provider callbacks occur, when processed, then only one receipt exists.


US-023 — Refund Eligibility & Status Tracking
Priority: MVP


Estimate: M


Dependencies: US-018, BR-013, BR-014


Story: As a patient, I want to see refund eligibility and status, so that I know what will happen after cancellation.


AC:


Given I cancel an eligible paid appointment, when cancellation completes, then refund status becomes PendingApproval or Initiated based on config.


Given refund is ineligible, when I cancel, then the system shows “No refund per policy”.


US-024 — Admin Approves Refund
Priority: MVP


Estimate: M


Dependencies: US-023, BR-033, BR-032


Story: As a branch admin, I want to approve refunds, so that eligible cancellations can be processed.


AC:


Given a refund pending approval, when I approve, then status updates and the action is audited.


Given I am not an approver, when I attempt approval, then access is denied.



E8. Teleconsult Experience
US-025 — Join Teleconsult in Allowed Window
Priority: MVP


Estimate: M


Dependencies: US-020, BR-016


Story: As a patient, I want to join teleconsult near appointment time, so that I can attend the consultation smoothly.


AC:


Given it is within join window, when I open appointment, then “Join Teleconsult” is enabled.


Given it is outside join window, when I open appointment, then join is disabled/hidden with a countdown.


US-026 — Doctor Starts Teleconsult and Ends Session
Priority: MVP


Estimate: M


Dependencies: US-025


Story: As a doctor, I want to start and end a teleconsult, so that the appointment status and timestamps are accurate.


AC:


Given a scheduled teleconsult, when I start the session, then start timestamp is recorded.


Given I end it, when I confirm end, then end timestamp is recorded and status updates.


US-027 — Permission Guidance (Camera/Mic)
Priority: MVP


Estimate: S


Dependencies: US-025, BR-017


Story: As a patient, I want help enabling mic/camera, so that I can join teleconsult successfully.


AC:


Given permissions denied, when I click join, then I see steps to enable and retry.


US-028 — Network Drop Recovery
Priority: MVP


Estimate: M


Dependencies: US-025, BR-018


Story: As a patient/doctor, I want the call to recover from network drops, so that the consultation can continue.


AC:


Given a drop occurs, when reconnect attempts run, then the UI shows reconnect status.


Given reconnect fails after retries, when it fails, then the system shows fallback instructions (end/reschedule/support).


US-029 — Late Join and No-show Marking
Priority: MVP


Estimate: M


Dependencies: US-025, BR-019, BR-020


Story: As a doctor/receptionist, I want to mark no-show after grace, so that schedules remain accurate.


AC:


Given patient hasn’t joined within grace period, when grace elapses, then authorized staff can mark No-show.


Given patient joins late, when joining occurs, then late flag is recorded.



E9. Clinical Documents (Visit Notes & Prescription)
US-030 — Doctor Records Visit Outcome Notes
Priority: MVP


Estimate: S


Dependencies: US-026


Story: As a doctor, I want to record visit outcome notes, so that the visit is documented for continuity.


AC:


Given the session ended, when I save outcome notes, then they persist and are visible to authorized viewers.


US-031 — Doctor Creates & Signs Prescription (Versioned)
Priority: MVP


Estimate: M


Dependencies: US-026, BR-025


Story: As a doctor, I want to create and sign a prescription document, so that patients can access an official signed copy.


AC:


Given I have a draft, when I sign, then it is locked with timestamp and version.


Given I need correction, when I update after signing, then a new version is created and audit trail remains.


US-032 — Patient Views Signed Prescription Only
Priority: MVP


Estimate: S


Dependencies: US-031, BR-026


Story: As a patient, I want to view/download my signed prescription, so that I can keep records and follow instructions.


AC:


Given prescription is unsigned, when I view, then I see “Awaiting sign-off”.


Given signed, when I view, then I can open/download.



E10. Follow-up Continuity
US-033 — Follow-up Recommendation & Quick Book
Priority: MVP


Estimate: S


Dependencies: US-030


Story: As a patient, I want a “book follow-up” shortcut, so that I can quickly schedule my next visit.


AC:


Given doctor flagged follow-up, when I view summary, then I can book a follow-up pre-filtered to same doctor/department.


US-034 — Link Follow-up to Parent Appointment
Priority: MVP


Estimate: S


Dependencies: US-033, BR-027


Story: As a system, I want to link follow-ups to the original visit, so that history is continuous.


AC:


Given follow-up is booked, when it’s saved, then it stores parent appointment reference.



E11. In-app Notifications
US-035 — In-app Reminders at Configured Offsets
Priority: MVP


Estimate: M


Dependencies: US-013, BR-028


Story: As a patient, I want appointment reminders, so that I don’t miss my visit.


AC:


Given reminder offsets, when time hits T-120m and T-30m, then notifications are generated.


Given teleconsult appointment, when T-10m, then “Join available” notification is generated.


US-036 — Status Change Notifications
Priority: MVP


Estimate: M


Dependencies: US-013, US-017/018/020, BR-029


Story: As a patient, I want to be notified about status changes, so that I’m always aware of updates.


AC:


Given appointment is confirmed/rescheduled/cancelled/doctor-unavailable, when status changes, then an in-app notification is created with details.



E12. Admin Configuration, Reporting & Audit
US-037 — Admin Manages Branches & Departments
Priority: MVP


Estimate: M


Dependencies: US-002


Story: As an admin, I want to manage branches and departments, so that the hospital structure is accurate.


AC:


Given I create/edit branch/department, when saved, then it appears in search filters and doctor assignments.


US-038 — Policy Configuration (Cancel/Reschedule/No-show/Refund)
Priority: MVP


Estimate: M


Dependencies: US-002, BR-010–BR-014


Story: As a branch admin, I want to configure policies, so that rules reflect operational needs.


AC:


Given policy values, when I save, then they apply from effective date and are audited.


Given I enter invalid values, when saving, then system blocks save with validation.


US-039 — Audit Log for Critical Actions
Priority: MVP


Estimate: M


Dependencies: US-003


Story: As an admin, I want to view audit logs, so that I can trace critical actions and overrides.


AC:


Given an auditable action occurs (refund approve, policy change, override), when I open audit logs, then I can see actor, time, before/after, and reason.


US-040 — Basic Reports Dashboard
Priority: MVP


Estimate: M


Dependencies: US-013, US-020, US-029


Story: As an admin, I want basic operational reports, so that I can track utilization and issues.


AC:


Given date range, when I view reports, then I see counts of bookings/cancellations/no-shows and payment totals (role-scoped).



Phase 2 (Deferred Stories)
US-041 — Fee Difference Handling on Reschedule
Priority: Phase2


Estimate: M


Dependencies: US-017, US-020, BR-024


Story: As a patient, I want fee differences handled when rescheduling, so that billing remains correct.


AC:


Given new slot has higher fee, when reschedule confirms, then system collects difference.


Given new slot has lower fee, when reschedule confirms, then system initiates refund delta (if configured).



