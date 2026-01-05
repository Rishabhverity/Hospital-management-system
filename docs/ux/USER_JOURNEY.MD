Journey 1 — Booking an Appointment (In-clinic or Teleconsult)


step
User Action
System Response
Errors/Recovery
Notifications (In-app)
1
Patient logs in (OTP)
Auth success, lands on Home/Search
OTP fail → retry / resend
“Login successful”
2
Search by dept/doctor/branch/date
Shows doctor list + next available slots
No results → suggest nearby branch/next date
“Showing available doctors” (optional)
3
Opens doctor profile
Shows fee, visit types, available slots
Doctor profile load fail → retry
—
4
Picks visit type + date/time
Temporarily locks slot (hold timer)
Slot taken during selection → refresh slots
“Slot reserved for X minutes”
5
Adds reason (optional), confirms patient info
Creates “Pending payment” appointment (if payment-required)
Validation errors shown inline
“Appointment created (pending confirmation)”
6
Completes payment
Payment success → appointment “Confirmed”
Payment failure → allow retry / change method; keep hold or release after timer
“Payment successful” / “Payment failed—retry”
7
Views confirmation screen
Shows appointment card + instructions
If payment pending → show “Complete payment to confirm”
“Appointment confirmed” + “Add to calendar” (optional)
8
Waits until appointment time
Teleconsult: “Join” appears near time; In-clinic: check-in info
Doctor unavailable (schedule change) → suggest reschedule/refund
“Reminder: appointment in 2 hrs / 30 min” + “Doctor delayed/unavailable” if applicable





Journey 2 — Reschedule / Cancel (Policy-aware)



Step
User Action
System Response
Errors/Recovery
Notifications (In-app)
1
Patient opens “My Appointments”
Lists upcoming appointments
App list load fail → retry
—
2
Taps Reschedule or Cancel
Shows policy: cancellation 24h, reschedule 12h
If inside window → show restriction + escalation option
“Policy reminder”
3A
Picks a new slot (Reschedule)
Locks new slot; checks conflicts
Doctor unavailable → show next available doctor/branch
“New slot reserved”
4A
Confirms reschedule
Updates appointment, releases old slot
If payment difference applies → go to payment
“Appointment rescheduled”
3B
Confirms cancel reason (Cancel)
Marks appointment cancelled
If paid: compute refund eligibility
“Cancellation requested/confirmed”
4B
(If eligible) chooses refund method
Creates refund request (if approval needed)
Refund requires approval → status “Refund pending approval”
“Refund initiated / pending approval”
5
Sees updated status
Shows updated appointment card
Dispute link → Support ticket
“Updated appointment details”









Journey 3 — Teleconsult Session (Start → Complete)

Step
User Action
System Response
Errors/Recovery
Notifications (In-app)
1
Patient sees upcoming teleconsult
“Join” button becomes available (e.g., 10 min before)
If too early → show countdown
“Teleconsult starts soon”
2
Patient taps Join
Opens waiting room; device checks
Camera/mic blocked → guided permissions
“You’re in the waiting room”
3
Doctor starts session
Connects both; shows call UI
Network drop during call → auto-reconnect + “resume”
“Doctor joined”
4
Both converse
Timer + basic notes (doctor side)
If reconnect fails → fallback: “End & reschedule”
“Connection unstable—trying to reconnect”
5
Patient joins after start time
Doctor sees “Patient joined late”
If beyond grace → mark missed
“You joined late—session may be shortened”
6
Doctor ends, marks outcome
Status set to Completed / Partial / Needs follow-up
If ended unexpectedly → show “Session ended” with next steps
“Teleconsult completed”
7
Patient views visit summary
Shows outcome + any attachments (if allowed)
If doctor notes missing → show pending
“Visit summary available”





Journey 4 — Prescription / Notes (MVP-safe, no medical advice)


Step
User Action
System Response
Errors/Recovery
Notifications (In-app)
1
Doctor enters prescription/visit note
Saves as draft, validates required fields
Missing fields → highlight
—
2
Doctor reviews and “Signs”
Locks document, timestamps, attaches to appointment
Network drop while saving → auto-save + retry
“Prescription ready (pending)”
3
Patient opens appointment details
Sees prescription attachment
If not signed yet → show “Awaiting doctor sign-off”
“Prescription available”
4
Doctor edits (if allowed)
Creates new version + audit trail
If edits not allowed post-sign → require amendment note
“Prescription updated (v2)”
5
Patient views/prints
Generates PDF view
PDF generation fail → retry
“Downloaded prescription” (optional)



Journey 5 — Follow-up Appointment (Post-visit continuation)

Step
User Action
System Response
Errors/Recovery
Notifications (In-app)
1
Doctor flags “Follow-up needed”
Prompts patient with suggested time range
Patient ignores → reminder after X days
“Follow-up recommended”
2
Patient taps “Book follow-up”
Pre-filters same doctor/department
Doctor not available → suggest next available slot/alternate doctor
“Slots available for follow-up”
3
Patient pays (if required)
Confirms follow-up appointment
Payment failure → retry
“Payment successful/failed”
4
Wait until date
Standard reminders and join/check-in flow
Late cancel → apply policy
“Follow-up reminder”
5
Visit completed
Adds to history chain linking prior visit
No-show → mark and optionally fee policy
“Follow-up completed / no-show recorded”



Journey 6 — Admin Configuration (Departments, Doctors, Slots, Policies)

Step
User Action
System Response
Errors/Recovery
Notifications (In-app)
1
Admin logs in
Lands on Admin Console
Permission denied → contact Super Admin
“Admin access granted”
2
Add/edit branches, departments
Saves hierarchy
Validation errors (duplicate names)
“Branch/Dept updated”
3
Create doctor profile + assign dept/branch
Doctor created, status Active/Inactive
Missing required fields → block save
“Doctor profile created”
4
Define slot duration + availability templates
Generates slots preview
Doctor unavailable (leave/holiday) → add exception blocks
“Schedule published”
5
Set cancellation/reschedule windows, no-show grace, refund rules
Applies to future bookings
Conflicts with existing bookings → prompt “apply from date”
“Policy updated (effective from …)”
6
Set fees, payment-required toggle, refund approval flow
Updates checkout rules
Refund approval required → configure approver + SLA
“Payment rules updated”
7
Review changes, publish
Logs audit record
Rollback option if issues
“Configuration published”


