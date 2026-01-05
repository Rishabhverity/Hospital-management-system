PERSONA TABLE (Clean & Structured)
1. Patient Persona
Category
Details
Persona
Riya, 29, Working Professional
Goals
Book quickly, avoid waiting, clear fees, smooth teleconsult
Pain Points
Confusing availability, payment failures, last-minute changes, hard to reach hospital
Top Tasks
Search doctor/department, book slot, pay, join teleconsult, reschedule/cancel, view history/receipts
Data Access
Own profile, appointments, payments, receipts, notifications
Key Screens
Login/OTP, Doctor Search, Doctor Profile, Slot Picker, Payment, My Appointments, Teleconsult Join, Receipts


2. Doctor Persona
Category
Details
Persona
Dr. Mehta, Cardiologist
Goals
Controlled schedule, fewer no-shows, simple teleconsult flow
Pain Points
Overbooking, unclear patient context, reschedules, tech issues
Top Tasks
Set availability, view schedule, start teleconsult, add notes
Data Access
Own schedule, assigned appointments, minimum patient info, notes
Key Screens
Doctor Dashboard, Availability Setup, Today’s Schedule, Appointment Detail, Teleconsult Room, Notes/Outcome


3. Receptionist Persona
Category
Details
Persona
Anita, Front Desk
Goals
Fast booking for walk-ins/calls, manage queue, avoid conflicts
Pain Points
Multiple systems, patient lookup errors, sudden slot changes
Top Tasks
Patient lookup/create, book on behalf, check-in, reschedule, update status
Data Access
Patient directory (limited), branch doctor schedules, branch appointments
Key Screens
Reception Dashboard, Patient Lookup/Create, Doctor Schedule, Booking Wizard, Check-in/Queue, Appointment Status


4. Support Agent Persona
Category
Details
Persona
Rahul, Support Desk
Goals
Resolve issues fast, trace payments, reduce escalations
Pain Points
Missing context, cannot verify payment, unclear escalation path
Top Tasks
Search appointment/payment, troubleshoot issues, log tickets
Data Access
Cross-branch read access to appointments & payments, limited patient info, ticket history, audit logs
Key Screens
Support Console, Global Search, Payment Trace, Appointment Detail (read), Ticketing, Audit Log Viewer


5. Branch Operations Admin Persona
Category
Details
Persona
Neha, Clinic/Branch Manager
Goals
Smooth ops, optimize utilisation, control policies
Pain Points
Doctor availability chaos, disputes, missing reports
Top Tasks
Manage doctors, configure fees/policies, approve refunds/exceptions
Data Access
Branch-level doctors, schedules, analytics, policies
Key Screens
Branch Admin Dashboard, Doctor Management, Policy Settings, Payments/Refunds, Reports


6. Super Admin Persona
Category
Details
Persona
IT Admin for Hospital Chain
Goals
Standard governance, security, auditability
Pain Points
Role sprawl, misconfigurations, compliance pressure
Top Tasks
Branch/department setup, user/role management, global configs
Data Access
Full access to all configs, logs, reports
Key Screens
Super Admin Console, Branch/Dept Setup, Role & Permission Management, Global Policy, Audit Logs








✅ RBAC MATRIX (Clean Table Format)
Legend:
✅ Allowed | ⚠️ Limited / Conditional | ❌ Not Allowed




Role
Create
Read
Update
Delete
Approve / Sign
Admin Config
Patient
✅ Book own appointments; initiate payment
✅ Own profile, appointments, receipts
✅ Reschedule/cancel; update profile
❌ (soft cancel only)
❌
❌
Doctor
✅ Availability blocks; visit notes
✅ Schedule; appointment patient info
✅ Availability; visit outcomes
❌
✅ Sign visit outcome; mark no-show
❌
Receptionist
✅ Patient create (limited), book, check-in
✅ Branch schedules, appointments, limited patient directory
✅ Status updates, reschedule/cancel within rules
❌
⚠️ Arrival/check-in only
❌
Support Agent
✅ Tickets, internal notes
✅ Read appointments/payments across branches
⚠️ Ticket status only
❌
⚠️ Recommend but not approve
❌
Branch Ops Admin
✅ Manage doctors, slots, fee rules
✅ All branch data & reports
✅ Policies, rosters, exceptions
⚠️ Limited deletes (deactivate only)
✅ Refunds, exceptions
✅ Branch config
Super Admin
✅ Org/branches/depts, roles
✅ Full system read
✅ Full system update
⚠️ Limited hard delete
✅ All approvals
✅ Full system config


