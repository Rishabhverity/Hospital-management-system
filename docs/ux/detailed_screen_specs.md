Detailed Screen Specs (Field-Level)
Patient Screens
P-01 — OTP Login
Fields
Phone Number (text)


OTP (6-digit, numeric; shown after “Send OTP”)


Validations
Phone: required, numeric, length 10 (India) (assumption)


OTP: required, exactly 6 digits


Error States
“OTP expired” → show Resend OTP


“Invalid OTP” → allow retry (rate-limited)


“Too many attempts” → temporary lock message


Empty States
First load: helper text “Enter mobile number to continue”


Key CTAs
Send OTP


Verify OTP


Resend OTP


Accessibility
Proper <label> for inputs; OTP field auto-focus on display


Keyboard: Enter submits current step; tab order linear


Errors announced via aria-live="polite"; focus moves to first error



P-02 — Home / Doctor Search
Fields
Department (dropdown)


Branch/Location (dropdown)


Visit Type (radio: Teleconsult / In-clinic)


Date (date picker)


Search text (optional: doctor name)


Validations
Department + Branch optional individually, but at least one filter recommended (no hard block)


Date cannot be past (IST)


Error States
API failure loading master data → “Unable to load filters. Retry.”


Search failure → retry button


Empty States
No doctors found → suggest changing date/branch/visit type


Key CTAs
Search


Clear Filters


View Doctor


Accessibility
All controls keyboard accessible; date picker supports typing date


Filter chips with removable buttons (aria-label “Remove Department filter”)


Contrast-compliant empty state text and buttons



P-03 — Doctor Profile
Fields (display + selections)
Doctor info (name, department(s), experience summary)


Consultation Types (Teleconsult/In-clinic availability)


Fee (by type if applicable)


Next available slots preview


Validations
If selected visit type not offered → disable selection and explain


Error States
Slot preview load fail → “Unable to load slots. Retry.”


Empty States
No upcoming slots → show “Next availability not published” + suggest other doctors


Key CTAs
View All Slots


Book Appointment


Accessibility
Headings structured (H1 doctor name, H2 sections)


Fee and visit type clearly labeled for screen readers



P-04 — Slot Picker
Fields
Date selector (calendar / next 7–14 days)


Slot list grouped by time blocks


Slot hold timer banner (after selection)


Validations
Slot must be available; if stale, refresh required


Error States
Slot taken on confirm → “This slot was just booked. Pick another.”


Hold expired → “Reservation expired. Please reselect slot.”


Empty States
No slots for selected day → show nearest available day suggestion


Key CTAs
Select Slot


Continue


Refresh Slots


Accessibility
Slots as radio-button group with clear labels (“10:15 AM – 10:30 AM”)


Focus visible on slot selection; timer announced on start and expiry



P-05 — Booking Confirmation
Fields
Patient info (prefilled): Name, Phone (read-only), Email (optional)


Appointment summary: Doctor, Branch, Date/Time, Visit Type, Fee


Reason for visit (optional textarea)


Policy notice (cancellation/reschedule windows)


Validations
Name required (min 2 chars)


Email format if entered


Reason max length (e.g., 250 chars)


Error States
Policy conflict detected (e.g., doctor blocked after hold) → return to slot picker


Empty States
If profile incomplete → highlight missing fields with inline prompts


Key CTAs
Confirm Booking


Back


Cancel


Accessibility
Inline validation tied via aria-describedby


Policy text is readable, not only color-coded



P-06 — Payment
Fields
Amount (read-only), Appointment reference (read-only)


Payment method selector (provider-driven)


Status banner: Pending / Success / Failed


Validations
Payment initiation requires active hold/pending payment window


Error States
Payment failed → show reason + Retry


Callback delayed → “Payment pending confirmation” + Refresh status


Empty States
None (always contextual)


Key CTAs
Pay Now


Retry


Back to Appointment


Accessibility
Status updates announced via aria-live


Buttons have descriptive labels (“Retry payment for ₹___”)



P-07 — My Appointments
Fields
Tabs: Upcoming / Past


List items: doctor, date/time, type, status


Validations
None


Error States
Load fail → Retry


Partial data → show “Some items failed to load” + refresh


Empty States
Upcoming empty → “No upcoming appointments” + “Book now”


Key CTAs
View Details


Reschedule (if allowed)


Cancel (if allowed)


Accessibility
List supports keyboard navigation; each card is a single focus stop with internal actions



P-08 — Appointment Detail
Fields (display + actions)
Status timeline (Booked/PendingPayment/Confirmed/etc.)


Policy window display (e.g., “Reschedule allowed until …” in IST)


Join Teleconsult button (time-gated)


Reschedule/Cancel actions (policy-gated)


Refund/receipt panel if paid


Validations
Reschedule/cancel availability computed server-side


Error States
Doctor unavailable → show reschedule/refund options (read-only unless allowed)


Action fails due to race condition → refresh state


Empty States
Prescription section: “Not available yet” until signed


Key CTAs
Join Teleconsult (only in join window)


Reschedule


Cancel


View Receipt


Accessibility
Timeline uses text + icons (not color-only)


Join button disabled state includes explanation text and is focusable only if actionable



P-09 — Teleconsult Waiting Room
Fields
Device check: Camera toggle, Mic toggle


Permission status indicators


Connection status banner


Validations
Must have mic+camera granted to proceed (or allow audio-only if policy permits—assumption: mic required)


Error States
Permissions denied → show step-by-step instructions + Retry


Network unstable → show reconnect attempts + Exit option


Empty States
Doctor not joined yet → “Please wait, doctor will join soon”


Key CTAs
Retry Permissions


Reconnect


Leave


Accessibility
All toggles labeled; status changes announced


Provide non-modal alternatives to avoid focus traps



P-10 — Receipts & Refunds
Fields
Receipt list with: amount, date, appointment ref


Refund status: Pending Approval / Initiated / Refunded / Not eligible


Download links (PDF)


Validations
Download allowed only for own receipts


Error States
Download generation fail → Retry


Refund status sync fail → Refresh


Empty States
“No receipts yet” for new users


Key CTAs
Download Receipt


Refresh Status


Accessibility
Download links have file type in label (“Download receipt PDF”)



P-11 — Profile & Consent
Fields
Name (required)


Phone (read-only or change via secure flow—Phase2)


Email (optional)


Consent history (version, accepted timestamp)


Validations
Name min 2 chars; email format


Error States
Save fail → show error and keep unsaved values


Empty States
No consent recorded yet → “Consent will be requested at first teleconsult booking”


Key CTAs
Save Profile


View Consent Text (latest)


Accessibility
Form fields grouped with clear legends; error summary at top with jump links



Doctor Screens
D-01 — Doctor Dashboard (Today)
Fields
Date selector (today default)


Appointment list with status badges


Quick filters: Teleconsult / In-clinic


Validations
None


Error/Empty
Empty: “No appointments today”


Error: schedule load fail → Retry


CTAs
Open Appointment


Start Teleconsult (when within join window)


Accessibility
Appointment rows keyboard selectable; status badges include text



D-02 — Availability Setup
Fields
Slot duration (read-only if admin-controlled; or selectable if permitted)


Weekly grid: Day → Start time, End time (multiple windows)


Save button


Validations
Start < End


No overlapping windows within the same day


Window aligns to slot duration increments (optional enforcement)


Error/Empty
Empty: no availability → “Add your first window”


Error: save conflict → show server validation messages


CTAs
Add Window


Save Availability


Accessibility
Time inputs allow typing; add/remove controls keyboard operable



D-03 — Exception Blocks
Fields
Date range (start/end)


Reason (dropdown: leave/blocked/other)


Notes (optional)


Validations
Start < End


Cannot create block in past (configurable)


Error/Empty
Empty: no blocks → “No exceptions”


Error: impacts booked appointment → show impacted count and next steps (notify admin/patient flow)


CTAs
Add Block


Save


Accessibility
Date/time fields with labels; impact warning in aria-live



D-04 — Appointment Detail (Doctor)
Fields
Patient summary (minimum necessary): name, age (optional), complaint/reason (if provided)


Appointment info + status


Buttons: Start/Join, Mark Late/No-show (if allowed by time), Open Notes


Validations
No-show action only after grace period


Error/Empty
If patient info restricted → show “Limited view per policy”


Start fails → show retry


CTAs
Start/Join Teleconsult


Mark No-show


Save Outcome


Accessibility
Ensure patient info isn’t conveyed only via icons; clear text labels



D-05 — Teleconsult Room (Doctor)
Fields
Call controls (mute, camera, end)


Connection status


Timer


Validations
End session requires confirmation modal


Error States
Network drop → reconnect UI


Patient not connected → “Waiting for patient” banner


CTAs
Start


End Session


Accessibility
Keyboard shortcuts documented; controls accessible via tab and space/enter


Focus returns to logical element after modal close



D-06 — Notes & Prescription
Fields
Outcome notes (textarea)


Prescription document: upload or structured fields (MVP: upload PDF/image + metadata)


Sign checkbox + Sign button (locks version)


Version list


Validations
Notes: max length (e.g., 2000 chars)


Upload: allowed file types (PDF/JPG/PNG), max size (e.g., 10MB)


Sign requires mandatory fields present (at least one doc or note—configurable)


Error/Empty
Empty: “No notes yet”


Upload fail → retry; show reason


Sign conflict → “Newer version exists” (if concurrent edits)


CTAs
Save Draft


Upload


Sign & Publish


Accessibility
Upload has label + instructions; progress announced


Version list is a table with headers for screen readers



Reception Screens
R-01 — Reception Dashboard
Fields
Doctor selector


Date selector


Appointment list with quick actions


Validations
Branch-scoped access


Error/Empty
Empty: “No appointments for selected doctor/day”


Error: load fail → Retry


CTAs
New Booking


Open Appointment


Check-in


Accessibility
Table/list supports keyboard; sticky headers for long lists



R-02 — Patient Lookup/Create
Fields
Phone number search


Results list (if found)


Create patient: Name, Phone, Email (optional)


Validations
Phone required, numeric, length 10


Name required


Error/Empty
No match: “No patient found” + Create option


Duplicate phone on create → show existing record suggestion


CTAs
Search


Select Patient


Create Patient


Accessibility
Search results announced; focus moves to results region after search



R-03 — Booking Wizard (Staff)
Fields
Selected patient summary


Doctor/department/branch selection


Slot picker (same as P-04)


Optional notes


Validations
Must select patient + slot


Prevent booking outside branch scope (if applicable)


Error/Empty
Slot taken → refresh


Policy restrictions shown (if booking on behalf has different rules—assumption: same rules)


CTAs
Reserve Slot


Confirm Booking


Cancel


Accessibility
Wizard steps indicated textually; not only progress bar color



R-04 — Check-in / Queue
Fields
Appointment status: Scheduled/Checked-in/In progress/Completed/No-show


Check-in timestamp (auto)


Notes (optional)


Validations
Check-in only for in-clinic appointments


No-show only after grace period (or end of slot window—policy)


Error/Empty
Attempt invalid transition → show message and keep prior state


CTAs
Check-in


Mark No-show


Update Status


Accessibility
Status controls are radios/select with labels; changes announced



R-05 — Appointment Detail (Reception)
Fields
Appointment summary + patient contact (limited)


Actions: reschedule/cancel (policy gated), check-in, notes


Validations
Respect cancel/reschedule windows unless admin override exists elsewhere


Error/Empty
Conflicting updates → “Appointment updated elsewhere” + refresh


CTAs
Reschedule


Cancel


Check-in


Accessibility
Inline confirmation dialogs are keyboard accessible; focus management done properly



Admin Screens
A-01 — Admin Dashboard
Fields
KPI tiles: bookings, cancellations, no-shows, payment totals (date range)


Shortcuts: Doctors, Policies, Refunds, Audit


Validations
Role access required


Error/Empty
No data → show “No activity in selected range”


Load fail → Retry


CTAs
Manage Doctors


Configure Policies


View Refund Queue


View Audit Logs


Accessibility
KPI cards include textual values and labels; not icon-only



A-02 — Branch & Department Management
Fields
Branch: name (required), code (optional), status (active/inactive)


Department: name (required), status


Validations
Unique names within scope (branch names unique chain-wide; dept unique chain-wide—assumption)


Cannot deactivate if referenced unless confirmed (soft constraints)


Error/Empty
Duplicate name → show error


Empty list → “Add your first branch/department”


CTAs
Add Branch / Add Department


Edit


Deactivate


Accessibility
Tables with sortable headers accessible via keyboard



A-03 — Doctor Management
Fields
Doctor: name, department(s), branch(es), consult types offered, fee(s), status


Optional: registration ID (display only; do not validate as legal claim)


Validations
Required fields: name, at least 1 dept, at least 1 branch, at least 1 consult type


Fees must be non-negative numbers


Error/Empty
Missing mapping to dept/branch → block save


Empty list → “Add first doctor”


CTAs
Add Doctor


Edit Doctor


Activate/Deactivate


Accessibility
Multi-select controls provide accessible selected-state announcements



A-04 — Policies & Rules
Fields
Cancellation window (hours) default 24


Reschedule window (hours) default 12


No-show grace (minutes) default 10


Refund approval required (toggle)


Effective from (date)


Validations
Non-negative numbers; sensible bounds (e.g., 0–168 hours)


Effective date cannot be in past (or requires explicit confirmation)


Error/Empty
Conflicting settings (reschedule > cancellation) → warn or allow with explanation (prefer warn)


Save fail → show server-side validation


CTAs
Save Policy


Preview Impact (optional)


Accessibility
Inputs have units in labels (“Cancellation window (hours)”)


Confirmation modal accessible; focus trapped correctly



A-05 — Fees & Payments
Fields
Fee table by doctor/department + visit type


Payment required toggle per visit type (teleconsult required default)


Refund handling mode (basic for MVP)


Validations
Fee numeric, ≥0


Payment-required changes apply from effective date


Error/Empty
No fee set → show warning that booking may be blocked or free (config)


CTAs
Save Fees


Bulk Update (optional)


Accessibility
Table cells editable with keyboard; clear focus outline



A-06 — Refund Approvals
Fields
Refund queue list: patient ref (masked), appointment ref, amount, reason, status


Approve/Reject actions


Admin reason (required on reject; optional on approve)


Validations
Only eligible statuses appear


Approve requires role permission


Reject requires reason text


Error/Empty
Empty queue → “No refunds pending”


Concurrent approval → show “Already processed” + refresh


CTAs
Approve


Reject


View Details


Accessibility
Action buttons have descriptive labels and confirmation modals



A-07 — Reports
Fields
Date range


Filters: branch, department, doctor


KPIs: bookings/cancellations/no-shows/payments totals


Validations
Date range start ≤ end; max range (e.g., 90 days—assumption)


Error/Empty
No data → “No results”


Export fail → show error (if export exists)


CTAs
Apply Filters


Export (optional)


Accessibility
Charts (if any) include text summaries; tables are accessible



A-08 — Audit Log Viewer
Fields
Filters: date range, actor, action type, entity


Log list: timestamp, actor, action, entity, before/after (detail view)


Validations
Authorized roles only


Mask sensitive values in before/after where necessary


Error/Empty
Empty: “No audit entries for filters”


Load fail → retry


CTAs
Apply Filters


View Detail


Accessibility
Detail view uses semantic definition lists; keyboard friendly navigation



Global Accessibility Notes (Apply to all screens)
Keyboard navigation: all interactive elements reachable via Tab; visible focus ring; logical focus order.


Labels: every input has a persistent label (no placeholder-only labels).


Error handling: inline errors + top-of-form summary; aria-live for async errors (payment, teleconsult).


Contrast: meet WCAG AA for text and interactive controls; don’t rely on color alone for status.


Touch targets: buttons/controls sized appropriately even on small screens (web responsive).


Time display: always show timezone or implicitly “IST” in policy/help text for clarity.

