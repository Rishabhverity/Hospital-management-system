Context Pack — Hospital Teleconsult & Appointment Management Platform (India, Web MVP)
Vision
Enable patients to discover the right doctor, book and manage appointments (in-clinic or teleconsult), and complete payments seamlessly—while giving hospital staff (reception/admin/support) reliable tools to manage schedules, queues, and operational visibility across a multi-specialty hospital chain in India.
Target Users
Patients: Search doctors, book/reschedule/cancel, join teleconsult, pay fees, view appointment history.


Doctors: Manage availability, view schedule, conduct teleconsult, record basic consultation notes, mark visit outcome.


Reception (Front Desk): Book on behalf of patients, manage walk-ins, confirm arrivals, handle reschedules, manage daily queue.


Admin (Hospital/Chain): Manage departments, doctors, clinics/branches, fees, slot templates, user access, basic reporting.


Support: Handle user issues (payment failures, login trouble, appointment disputes), manage basic tickets/escalations.


Key Use-Cases (MVP)
Patient
Sign up / log in (OTP/email/password — see Assumptions)


Search doctor by department, location/branch, availability


View doctor profile (specialty, experience summary, consultation types, fee)


Book appointment:


Choose branch (if applicable), date, time slot, visit type (Teleconsult / In-clinic)


Pay (if required to confirm booking)


In-app appointment reminders + “Join Teleconsult” button at scheduled time


Reschedule/cancel within allowed windows


View upcoming + past appointments, invoices/receipts


Doctor
Set weekly availability / exceptions (leave, blocked slots)


View daily schedule


Start/Join teleconsult session (web)


Mark outcome: Completed / No-show / Cancelled / Rescheduled


Add minimal consultation notes (non-diagnostic, operational notes—no AI advice)


Reception
Create/lookup patient and book appointment on their behalf


Manage arrivals (check-in), update status


Handle same-day reschedules (within policy) and slot changes


View doctor-wise schedule and slot utilization


Admin
Create/manage hospital branches, departments, doctors, consultation types


Configure slot duration (global and/or doctor-level), fees, payment rules


Manage roles and permissions (doctor/reception/support/admin)


Basic dashboards: bookings, cancellations, no-shows, revenue (high-level)


Support
Search appointments by patient/doctor/date/payment reference


Log ticket, tag category (payment, scheduling, access), add internal notes


Escalate to admin/reception as needed


In-Scope (MVP)
Appointment & Scheduling
Doctor availability management (recurring + exceptions)


Slot-based booking for teleconsult + in-clinic


Policies enforced:


cancellation window


reschedule window


no-show marking


Appointment statuses: Booked → Confirmed (paid/verified) → In Progress → Completed (+ Cancelled/No-show/Rescheduled)


Teleconsult (Web)
Launch/join teleconsult session from appointment


Basic operational flow: waiting room, “doctor joined”, end session


Minimal audit trail (start/end timestamps)


Payments (Web)
Online payment to confirm booking (for applicable doctors/services)


Payment receipt/invoice view


Payment status handling: Pending / Success / Failed / Refunded (if enabled)


Notifications (In-App Only)
In-app reminders (e.g., upcoming appointment)


In-app payment status updates


In-app status changes (rescheduled/cancelled)


Admin & Operations
Multi-branch + multi-department setup


Role-based access control


Basic reporting (counts, trends)


Data Handling
Treat all patient/appointment data as sensitive


Access logging for admin/support actions (at least for critical operations)


Out-of-Scope (Not in MVP)
Unsafe medical advice features, symptom checkers, diagnosis suggestions, treatment recommendations


E-prescriptions, pharmacy orders, lab reports, radiology integrations


Insurance/TPA claims, complex billing (packages, split bills, EMR integration)


Ambulance/ER workflows, inpatient admission management


WhatsApp/SMS/Email notifications (only in-app in MVP)


Advanced clinical documentation, templates, voice dictation


Patient vitals devices/IoT integration


Multi-language UI (English-only for MVP)


Marketplace-style doctor onboarding outside the hospital chain (unless explicitly required later)


Assumptions (Clearly Labeled)
MVP Timeline: 8 weeks (assumption based on scope + web-only constraint).


Slot Duration: Default 15 minutes, configurable per doctor (assumption; your draft lists 10/15/20/30).


Cancellation Window: 24 hours before appointment start time (as provided).


Reschedule Window: 12 hours before appointment start time (as provided).


No-show Policy (MVP-friendly):


Patient is marked No-show if they do not join/check-in within 10 minutes of start time (assumption).


Fees/refunds for no-show are configurable and may be jurisdiction-dependent and hospital-policy dependent (no legal claim).


Payments: Payment is required to confirm teleconsult bookings; in-clinic may be pay-later depending on admin configuration (assumption).


Authentication: Phone OTP login is preferred for India; email/password may be optional (assumption).


Teleconsult Tech: Use a safe, reliable video solution (e.g., embedded WebRTC or a vetted provider). Exact provider is not decided here (assumption).


Hospital Chain: Multiple branches exist; doctor availability may be branch-specific (assumption).


Success Metrics (MVP)
Booking conversion rate: % of users who complete booking after viewing slots


Payment success rate: successful payments / initiated payments


No-show rate: no-shows / confirmed appointments (by department & doctor)


Cancellation within policy compliance: % of cancellations meeting window rules


Time-to-book: median time from search to confirmed appointment


Teleconsult completion rate: completed teleconsults / scheduled teleconsults


Operational efficiency: receptionist time per booking (baseline vs post-MVP)


Support load: tickets per 100 appointments; top issue categories


Risks & Mitigations (MVP-level)
Data privacy & access misuse: enforce RBAC, audit logs, least-privilege roles, secure session handling.


Payment disputes & reconciliation: store payment references, idempotent callbacks, clear receipt history, support tools to trace payments.


Schedule integrity (double-booking): server-side slot locking, concurrency controls, timezone correctness (IST).


Teleconsult reliability: fallback messaging in-app if session fails; clear retry/join guidance.


Policy friction: strict cancellation/reschedule windows can hurt adoption; allow admin-configurable policies per department/doctor.


Operational adoption: receptionists and doctors may resist; keep workflows minimal and fast; provide quick daily schedule view.


Jurisdiction-dependent compliance: consent, retention, and record handling may vary; document as policy-driven and configurable.


Glossary
Teleconsult: Remote consultation conducted via web-based audio/video session tied to an appointment.


In-clinic appointment: Physical visit at a hospital branch/clinic location.


Slot duration: Length of an appointment time slot (e.g., 15 minutes).


Availability template: Doctor’s recurring weekly schedule (e.g., Mon–Fri 10:00–13:00).


Exception: One-off schedule change (leave day, blocked slots).


Cancellation window: Minimum notice period before appointment start time to cancel without restriction.


Reschedule window: Minimum notice period before appointment start time to move an appointment.


No-show: Patient does not join/check-in within a defined grace period after start time.


RBAC: Role-Based Access Control (permissions based on user role: patient/doctor/reception/admin/support).


Audit log: Immutable record of key actions (e.g., cancellations by staff, fee changes, payment status overrides).

Context Pack — Hospital Teleconsult & Appointment Management Platform (India, Web MVP)
Vision
Enable patients to discover the right doctor, book and manage appointments (in-clinic or teleconsult), and complete payments seamlessly—while giving hospital staff (reception/admin/support) reliable tools to manage schedules, queues, and operational visibility across a multi-specialty hospital chain in India.
Target Users
Patients: Search doctors, book/reschedule/cancel, join teleconsult, pay fees, view appointment history.


Doctors: Manage availability, view schedule, conduct teleconsult, record basic consultation notes, mark visit outcome.


Reception (Front Desk): Book on behalf of patients, manage walk-ins, confirm arrivals, handle reschedules, manage daily queue.


Admin (Hospital/Chain): Manage departments, doctors, clinics/branches, fees, slot templates, user access, basic reporting.


Support: Handle user issues (payment failures, login trouble, appointment disputes), manage basic tickets/escalations.


Key Use-Cases (MVP)
Patient
Sign up / log in (OTP/email/password — see Assumptions)


Search doctor by department, location/branch, availability


View doctor profile (specialty, experience summary, consultation types, fee)


Book appointment:


Choose branch (if applicable), date, time slot, visit type (Teleconsult / In-clinic)


Pay (if required to confirm booking)


In-app appointment reminders + “Join Teleconsult” button at scheduled time


Reschedule/cancel within allowed windows


View upcoming + past appointments, invoices/receipts


Doctor
Set weekly availability / exceptions (leave, blocked slots)


View daily schedule


Start/Join teleconsult session (web)


Mark outcome: Completed / No-show / Cancelled / Rescheduled


Add minimal consultation notes (non-diagnostic, operational notes—no AI advice)


Reception
Create/lookup patient and book appointment on their behalf


Manage arrivals (check-in), update status


Handle same-day reschedules (within policy) and slot changes


View doctor-wise schedule and slot utilization


Admin
Create/manage hospital branches, departments, doctors, consultation types


Configure slot duration (global and/or doctor-level), fees, payment rules


Manage roles and permissions (doctor/reception/support/admin)


Basic dashboards: bookings, cancellations, no-shows, revenue (high-level)


Support
Search appointments by patient/doctor/date/payment reference


Log ticket, tag category (payment, scheduling, access), add internal notes


Escalate to admin/reception as needed


In-Scope (MVP)
Appointment & Scheduling
Doctor availability management (recurring + exceptions)


Slot-based booking for teleconsult + in-clinic


Policies enforced:


cancellation window


reschedule window


no-show marking


Appointment statuses: Booked → Confirmed (paid/verified) → In Progress → Completed (+ Cancelled/No-show/Rescheduled)


Teleconsult (Web)
Launch/join teleconsult session from appointment


Basic operational flow: waiting room, “doctor joined”, end session


Minimal audit trail (start/end timestamps)


Payments (Web)
Online payment to confirm booking (for applicable doctors/services)


Payment receipt/invoice view


Payment status handling: Pending / Success / Failed / Refunded (if enabled)


Notifications (In-App Only)
In-app reminders (e.g., upcoming appointment)


In-app payment status updates


In-app status changes (rescheduled/cancelled)


Admin & Operations
Multi-branch + multi-department setup


Role-based access control


Basic reporting (counts, trends)


Data Handling
Treat all patient/appointment data as sensitive


Access logging for admin/support actions (at least for critical operations)


Out-of-Scope (Not in MVP)
Unsafe medical advice features, symptom checkers, diagnosis suggestions, treatment recommendations


E-prescriptions, pharmacy orders, lab reports, radiology integrations


Insurance/TPA claims, complex billing (packages, split bills, EMR integration)


Ambulance/ER workflows, inpatient admission management


WhatsApp/SMS/Email notifications (only in-app in MVP)


Advanced clinical documentation, templates, voice dictation


Patient vitals devices/IoT integration


Multi-language UI (English-only for MVP)


Marketplace-style doctor onboarding outside the hospital chain (unless explicitly required later)


Assumptions (Clearly Labeled)
MVP Timeline: 8 weeks (assumption based on scope + web-only constraint).


Slot Duration: Default 15 minutes, configurable per doctor (assumption; your draft lists 10/15/20/30).


Cancellation Window: 24 hours before appointment start time (as provided).


Reschedule Window: 12 hours before appointment start time (as provided).


No-show Policy (MVP-friendly):


Patient is marked No-show if they do not join/check-in within 10 minutes of start time (assumption).


Fees/refunds for no-show are configurable and may be jurisdiction-dependent and hospital-policy dependent (no legal claim).


Payments: Payment is required to confirm teleconsult bookings; in-clinic may be pay-later depending on admin configuration (assumption).


Authentication: Phone OTP login is preferred for India; email/password may be optional (assumption).


Teleconsult Tech: Use a safe, reliable video solution (e.g., embedded WebRTC or a vetted provider). Exact provider is not decided here (assumption).


Hospital Chain: Multiple branches exist; doctor availability may be branch-specific (assumption).


Success Metrics (MVP)
Booking conversion rate: % of users who complete booking after viewing slots


Payment success rate: successful payments / initiated payments


No-show rate: no-shows / confirmed appointments (by department & doctor)


Cancellation within policy compliance: % of cancellations meeting window rules


Time-to-book: median time from search to confirmed appointment


Teleconsult completion rate: completed teleconsults / scheduled teleconsults


Operational efficiency: receptionist time per booking (baseline vs post-MVP)


Support load: tickets per 100 appointments; top issue categories


Risks & Mitigations (MVP-level)
Data privacy & access misuse: enforce RBAC, audit logs, least-privilege roles, secure session handling.


Payment disputes & reconciliation: store payment references, idempotent callbacks, clear receipt history, support tools to trace payments.


Schedule integrity (double-booking): server-side slot locking, concurrency controls, timezone correctness (IST).


Teleconsult reliability: fallback messaging in-app if session fails; clear retry/join guidance.


Policy friction: strict cancellation/reschedule windows can hurt adoption; allow admin-configurable policies per department/doctor.


Operational adoption: receptionists and doctors may resist; keep workflows minimal and fast; provide quick daily schedule view.


Jurisdiction-dependent compliance: consent, retention, and record handling may vary; document as policy-driven and configurable.


Glossary
Teleconsult: Remote consultation conducted via web-based audio/video session tied to an appointment.


In-clinic appointment: Physical visit at a hospital branch/clinic location.


Slot duration: Length of an appointment time slot (e.g., 15 minutes).


Availability template: Doctor’s recurring weekly schedule (e.g., Mon–Fri 10:00–13:00).


Exception: One-off schedule change (leave day, blocked slots).


Cancellation window: Minimum notice period before appointment start time to cancel without restriction.


Reschedule window: Minimum notice period before appointment start time to move an appointment.


No-show: Patient does not join/check-in within a defined grace period after start time.


RBAC: Role-Based Access Control (permissions based on user role: patient/doctor/reception/admin/support).


Audit log: Immutable record of key actions (e.g., cancellations by staff, fee changes, payment status overrides).

