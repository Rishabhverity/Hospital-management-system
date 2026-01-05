ERD (logical)
erDiagram
  PATIENT ||--o{ CONSENT : has
  PATIENT ||--o{ APPOINTMENT : books
  DOCTOR  ||--o{ APPOINTMENT : attends
  DEPARTMENT ||--o{ DOCTOR_DEPARTMENT : includes
  DOCTOR ||--o{ DOCTOR_DEPARTMENT : belongs_to
  DOCTOR ||--o{ AVAILABILITY_RULE : defines
  AVAILABILITY_RULE ||--o{ SLOT : generates
  DOCTOR ||--o{ SLOT : offers
  SLOT ||--o{ APPOINTMENT : booked_as
  APPOINTMENT ||--o| TELE_SESSION : may_have
  APPOINTMENT ||--o| ENCOUNTER : results_in
  ENCOUNTER ||--o{ PRESCRIPTION : produces
  USER ||--o{ AUDIT_LOG : acts
  APPOINTMENT ||--o{ AUDIT_LOG : audited
  PAYMENT ||--o| INVOICE : creates
  PAYMENT ||--o{ REFUND : may_have
  APPOINTMENT ||--o{ PAYMENT : paid_for

  USER {
    string user_id PK
    string role
  }
  PATIENT {
    string patient_id PK
    string user_id FK
  }
  DOCTOR {
    string doctor_id PK
    string user_id FK
  }
  DEPARTMENT {
    string department_id PK
  }
  DOCTOR_DEPARTMENT {
    string doctor_id FK
    string department_id FK
  }
  AVAILABILITY_RULE {
    string availability_rule_id PK
    string doctor_id FK
  }
  SLOT {
    string slot_id PK
    string doctor_id FK
    string availability_rule_id FK
  }
  APPOINTMENT {
    string appointment_id PK
    string patient_id FK
    string doctor_id FK
    string slot_id FK
  }
  TELE_SESSION {
    string tele_session_id PK
    string appointment_id FK
  }
  ENCOUNTER {
    string encounter_id PK
    string appointment_id FK
  }
  PRESCRIPTION {
    string prescription_id PK
    string encounter_id FK
  }
  CONSENT {
    string consent_id PK
    string patient_id FK
  }
  AUDIT_LOG {
    string audit_id PK
    string actor_user_id FK
  }
  PAYMENT {
    string payment_id PK
    string appointment_id FK
  }
  INVOICE {
    string invoice_id PK
    string payment_id FK
  }
  REFUND {
    string refund_id PK
    string payment_id FK
  }
Core entities (PK/FK, constraints, soft-delete)
0) Conventions (recommended)

Primary keys: UUID (or CHAR(36) if DB lacks UUID).

Timestamps: store in UTC in *_at columns; keep time_zone = Asia/Kolkata at org/branch if needed for display.

Soft delete: add deleted_at, deleted_by (nullable) to “master” entities; filter them out in queries by default.

PII minimization: store only what’s needed; keep sensitive blobs out of audit logs (store diffs/keys, not full clinical text).

Entities
USER (auth identity for all roles)

Purpose: one login identity used by Patient/Doctor/Staff.

PK: user_id

Key fields: role (Patient/Doctor/Reception/Admin/Support), phone, email, status, last_login_at

Constraints: role IN allowed roles; phone unique (if OTP-based)

Soft-delete: deleted_at, deleted_by

PATIENT

Purpose: patient-specific profile.

PK: patient_id

FK: user_id → USER.user_id (UNIQUE) (1:1)

Key fields: full_name, dob (optional), gender (optional), primary_phone (dup from user optional), profile_completed_at

Constraints: patient must map to a USER with role=Patient (enforced in app or via DB checks if supported)

Soft-delete: yes

DOCTOR

Purpose: doctor profile & operational attributes.

PK: doctor_id

FK: user_id → USER.user_id (UNIQUE) (1:1)

Key fields: display_name, specialty_summary, is_active, teleconsult_enabled, inclinic_enabled, fee_teleconsult, fee_inclinic

Soft-delete: yes

DEPARTMENT

PK: department_id

Fields: name (unique), is_active

Soft-delete: yes

DOCTOR_DEPARTMENT (many-to-many)

PK: composite (doctor_id, department_id)

FKs: → DOCTOR, → DEPARTMENT

Constraint: unique pair; no soft delete needed (or add deleted_at if you want historical mappings)

BRANCH (recommended for chain operations)

PK: branch_id

Fields: name, city, address, time_zone (default Asia/Kolkata), is_active

Soft-delete: yes

DOCTOR_BRANCH (recommended)

PK: composite (doctor_id, branch_id)

Fields: is_primary, is_active

Use: branch-specific schedules and receptionist scope

AVAILABILITY_RULE

Purpose: recurring schedule template (weekly windows), plus slot duration policy at doctor/branch scope.

PK: availability_rule_id

FK: doctor_id → DOCTOR.doctor_id, optional branch_id → BRANCH.branch_id

Fields:

day_of_week (0–6)

start_time_local (e.g., 10:00) and end_time_local (e.g., 13:00)

slot_duration_minutes (10/15/20/30)

visit_type ENUM (TELECONSULT,INCLINIC,BOTH)

effective_from, effective_to (nullable)

is_active

Constraints:

start_time_local < end_time_local

slot_duration_minutes IN (10,15,20,30)

prevent overlapping rules for same doctor/day/branch/visit_type (often enforced at app level; DB exclusion constraints are vendor-specific)

Soft-delete: yes

Optional but practical: AVAILABILITY_EXCEPTION (doctor leave/blocked times). If you don’t add it, you’ll end up encoding exceptions as special rules.

SLOT

Purpose: generated slot instances (materialized availability).

PK: slot_id

FKs: doctor_id, optional branch_id, optional availability_rule_id

Fields:

start_at_utc, end_at_utc

visit_type (TELECONSULT/INCLINIC)

status ENUM (AVAILABLE,HELD,BOOKED,BLOCKED)

hold_expires_at_utc (nullable)

held_by_patient_id (nullable FK → PATIENT)

blocked_reason (nullable)

Constraints:

(doctor_id, branch_id, start_at_utc) must be unique for active slots (for soft-delete you’ll enforce uniqueness in queries or via vendor partial indexes)

If status='HELD' then hold_expires_at_utc NOT NULL

Soft-delete: optional (many teams hard-delete and regenerate slots; if you need auditability, soft-delete)

APPOINTMENT

Purpose: booking record and lifecycle.

PK: appointment_id

FKs:

patient_id → PATIENT

doctor_id → DOCTOR

branch_id → BRANCH (recommended)

slot_id → SLOT (nullable if you allow manual scheduling)

created_by_user_id → USER (patient or receptionist)

parent_appointment_id → APPOINTMENT (nullable, follow-up linkage)

Fields:

appointment_type ENUM (TELECONSULT,INCLINIC)

status ENUM (PENDING_PAYMENT,CONFIRMED,IN_PROGRESS,COMPLETED,CANCELLED,NO_SHOW,RESCHEDULED)

scheduled_start_at_utc, scheduled_end_at_utc

cancel_reason, reschedule_reason

policy_snapshot_json (text/json) to store windows applied at booking time (optional but helpful)

checked_in_at_utc (in-clinic)

Constraints:

must not overlap for same doctor at same time (enforced by unique slot booking + status transitions)

status transitions validated at application/service layer (DB triggers optional)

Soft-delete: generally NO (appointments are records of care/ops); keep immutable history and use status instead.

TELE_SESSION

Purpose: teleconsult runtime/session metadata (vendor-agnostic).

PK: tele_session_id

FK: appointment_id → APPOINTMENT (UNIQUE) (0..1 per appointment)

Fields:

join_open_at_utc, join_close_at_utc

started_at_utc, ended_at_utc

session_status (NOT_STARTED,ACTIVE,ENDED,FAILED)

disconnect_count (int)

last_error_code (nullable)

Soft-delete: no (keep history)

ENCOUNTER

Purpose: outcome summary for the visit (tele or in-clinic).

PK: encounter_id

FK: appointment_id → APPOINTMENT (UNIQUE)

Fields: outcome_status (COMPLETED,PARTIAL,FOLLOWUP_REQUIRED), clinical_notes_text (keep minimal), created_by_doctor_id, signed_off_at_utc (optional)

Soft-delete: no

PRESCRIPTION (versioned)

Purpose: doctor-authored prescription documents (no automated advice).

PK: prescription_id

FK: encounter_id → ENCOUNTER

Fields:

version_no (int)

file_uri (or blob ref), file_hash (optional)

status (DRAFT,SIGNED)

signed_by_doctor_id → DOCTOR (nullable until signed)

signed_at_utc (nullable)

Constraints: unique (encounter_id, version_no); only one SIGNED can be “current” (enforced app-side or DB constraint depending on DB)

Soft-delete: no (keep versions)

CONSENT (versioned)

Purpose: store patient consent acceptance with versioning.

PK: consent_id

FK: patient_id → PATIENT

Fields: scope (TELECONSULT), consent_version, accepted_at_utc, accepted_text_hash (optional), revoked_at_utc (optional)

Constraints: unique (patient_id, scope, consent_version); latest version required for new teleconsult bookings (rule enforced in app)

Soft-delete: no

AUDIT_LOG

Purpose: immutable audit trail for critical actions.

PK: audit_id

FK: actor_user_id → USER

Fields:

action (e.g., POLICY_CHANGE, REFUND_APPROVE, APPOINTMENT_OVERRIDE)

entity_type (e.g., APPOINTMENT, POLICY, REFUND)

entity_id (string)

occurred_at_utc

before_snapshot (text/json), after_snapshot (text/json) (avoid storing full sensitive notes)

reason (nullable)

correlation_id (for tracing), ip_address (nullable), user_agent (nullable)

Constraints: append-only (enforce in app; some DBs can enforce via permissions)

Soft-delete: never

Optional but in-scope entities (Payments)
PAYMENT

PK: payment_id

FK: appointment_id → APPOINTMENT

Fields: amount, currency, status (INITIATED,SUCCESS,FAILED,PENDING,REFUNDED), provider_reference, idempotency_key, paid_at_utc

Constraints: unique (provider_reference) when present; unique (appointment_id, idempotency_key)

Soft-delete: no

INVOICE

PK: invoice_id

FK: payment_id → PAYMENT (UNIQUE)

Fields: invoice_number (unique), issued_at_utc, total_amount

Soft-delete: no

REFUND

PK: refund_id

FK: payment_id → PAYMENT

Fields: amount, status (PENDING_APPROVAL,INITIATED,COMPLETED,REJECTED), approved_by_user_id → USER (nullable), approved_at_utc (nullable), reason

Constraints: idempotency via idempotency_key (recommended)

Soft-delete: no

Relationship list (cardinality)

Patient 1—1 User; Doctor 1—1 User

Doctor M—N Department via Doctor_Department

Doctor M—N Branch via Doctor_Branch (recommended)

Doctor 1—M AvailabilityRule

AvailabilityRule 1—M Slot (generated)

Slot 0..1—1 Appointment (a slot may be unbooked or booked once)

Appointment 0..1—1 TeleSession (only for teleconsult)

Appointment 0..1—1 Encounter (created after consult ends)

Encounter 1—M Prescription (versioned)

Patient 1—M Consent (versioned)

User 1—M AuditLog

Appointment 0..M Payment; Payment 0..1 Invoice; Payment 0..M Refund

Index suggestions (high-value)
Doctor discovery & directory

DOCTOR(is_active, teleconsult_enabled, inclinic_enabled)

DOCTOR_DEPARTMENT(department_id, doctor_id)

DOCTOR_BRANCH(branch_id, doctor_id, is_active)

Slot search & booking integrity

SLOT(doctor_id, branch_id, start_at_utc)

SLOT(doctor_id, branch_id, start_at_utc, status) for availability queries

SLOT(status, hold_expires_at_utc) to expire holds efficiently

Uniqueness: (doctor_id, branch_id, start_at_utc) for non-deleted slots (partial unique if DB supports; else enforce in service)

Appointment timelines

APPOINTMENT(patient_id, scheduled_start_at_utc DESC)

APPOINTMENT(doctor_id, scheduled_start_at_utc DESC)

APPOINTMENT(branch_id, scheduled_start_at_utc DESC)

APPOINTMENT(status, scheduled_start_at_utc) for operational queues

APPOINTMENT(parent_appointment_id) for follow-up chains

Teleconsult runtime

TELE_SESSION(appointment_id) (unique)

TELE_SESSION(session_status, started_at_utc)

Payments & refunds

PAYMENT(appointment_id, status)

PAYMENT(provider_reference) unique

REFUND(status, approved_at_utc)

Audit

AUDIT_LOG(entity_type, entity_id, occurred_at_utc DESC)

AUDIT_LOG(actor_user_id, occurred_at_utc DESC)

AUDIT_LOG(correlation_id) (for tracing)

Soft-delete strategy (practical)

Soft-delete master data: User/Patient/Doctor/Department/Branch/AvailabilityRule (and optionally Slot).

Do not soft-delete transactional records: Appointment, Payment, Refund, AuditLog, Encounter, Prescription, Consent.

For soft-deleted rows, keep:

deleted_at_utc, deleted_by_user_id, delete_reason

Application queries must default to WHERE deleted_at_utc IS NULL.

Optional SQL DDL (vendor-neutral-ish template)

Below is a portable template (types may need minor edits per DB: UUID/JSON/TIMESTAMP).

-- USER
CREATE TABLE users (
  user_id            CHAR(36) PRIMARY KEY,
  role               VARCHAR(30) NOT NULL,
  phone              VARCHAR(20),
  email              VARCHAR(255),
  status             VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  last_login_at_utc  TIMESTAMP NULL,
  created_at_utc     TIMESTAMP NOT NULL,
  updated_at_utc     TIMESTAMP NOT NULL,
  deleted_at_utc     TIMESTAMP NULL,
  deleted_by_user_id CHAR(36) NULL
);

-- PATIENT
CREATE TABLE patients (
  patient_id         CHAR(36) PRIMARY KEY,
  user_id            CHAR(36) NOT NULL UNIQUE,
  full_name          VARCHAR(200) NOT NULL,
  dob                DATE NULL,
  gender             VARCHAR(20) NULL,
  profile_completed_at_utc TIMESTAMP NULL,
  created_at_utc     TIMESTAMP NOT NULL,
  updated_at_utc     TIMESTAMP NOT NULL,
  deleted_at_utc     TIMESTAMP NULL,
  deleted_by_user_id CHAR(36) NULL,
  CONSTRAINT fk_pat_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- DOCTOR
CREATE TABLE doctors (
  doctor_id          CHAR(36) PRIMARY KEY,
  user_id            CHAR(36) NOT NULL UNIQUE,
  display_name       VARCHAR(200) NOT NULL,
  specialty_summary  VARCHAR(500) NULL,
  teleconsult_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  inclinic_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  fee_teleconsult    DECIMAL(12,2) NULL,
  fee_inclinic       DECIMAL(12,2) NULL,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at_utc     TIMESTAMP NOT NULL,
  updated_at_utc     TIMESTAMP NOT NULL,
  deleted_at_utc     TIMESTAMP NULL,
  deleted_by_user_id CHAR(36) NULL,
  CONSTRAINT fk_doc_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- DEPARTMENT
CREATE TABLE departments (
  department_id      CHAR(36) PRIMARY KEY,
  name               VARCHAR(150) NOT NULL,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at_utc     TIMESTAMP NOT NULL,
  updated_at_utc     TIMESTAMP NOT NULL,
  deleted_at_utc     TIMESTAMP NULL,
  deleted_by_user_id CHAR(36) NULL
);

-- DOCTOR_DEPARTMENT
CREATE TABLE doctor_departments (
  doctor_id          CHAR(36) NOT NULL,
  department_id      CHAR(36) NOT NULL,
  PRIMARY KEY (doctor_id, department_id),
  CONSTRAINT fk_dd_doc FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  CONSTRAINT fk_dd_dept FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- AVAILABILITY_RULE
CREATE TABLE availability_rules (
  availability_rule_id CHAR(36) PRIMARY KEY,
  doctor_id            CHAR(36) NOT NULL,
  branch_id            CHAR(36) NULL,
  day_of_week          SMALLINT NOT NULL, -- 0=Sun..6=Sat
  start_time_local     TIME NOT NULL,
  end_time_local       TIME NOT NULL,
  slot_duration_minutes SMALLINT NOT NULL,
  visit_type           VARCHAR(20) NOT NULL, -- TELECONSULT/INCLINIC/BOTH
  effective_from       DATE NOT NULL,
  effective_to         DATE NULL,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at_utc       TIMESTAMP NOT NULL,
  updated_at_utc       TIMESTAMP NOT NULL,
  deleted_at_utc       TIMESTAMP NULL,
  deleted_by_user_id   CHAR(36) NULL,
  CONSTRAINT fk_ar_doc FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  CONSTRAINT chk_ar_time CHECK (start_time_local < end_time_local),
  CONSTRAINT chk_ar_dur CHECK (slot_duration_minutes IN (10,15,20,30)),
  CONSTRAINT chk_ar_dow CHECK (day_of_week BETWEEN 0 AND 6)
);

-- SLOT
CREATE TABLE slots (
  slot_id              CHAR(36) PRIMARY KEY,
  doctor_id            CHAR(36) NOT NULL,
  branch_id            CHAR(36) NULL,
  availability_rule_id CHAR(36) NULL,
  start_at_utc         TIMESTAMP NOT NULL,
  end_at_utc           TIMESTAMP NOT NULL,
  visit_type           VARCHAR(20) NOT NULL,
  status               VARCHAR(20) NOT NULL, -- AVAILABLE/HELD/BOOKED/BLOCKED
  hold_expires_at_utc  TIMESTAMP NULL,
  held_by_patient_id   CHAR(36) NULL,
  blocked_reason       VARCHAR(255) NULL,
  created_at_utc       TIMESTAMP NOT NULL,
  updated_at_utc       TIMESTAMP NOT NULL,
  deleted_at_utc       TIMESTAMP NULL,
  CONSTRAINT fk_slot_doc FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  CONSTRAINT fk_slot_rule FOREIGN KEY (availability_rule_id) REFERENCES availability_rules(availability_rule_id),
  CONSTRAINT fk_slot_held_patient FOREIGN KEY (held_by_patient_id) REFERENCES patients(patient_id),
  CONSTRAINT chk_slot_time CHECK (start_at_utc < end_at_utc)
);

-- APPOINTMENT
CREATE TABLE appointments (
  appointment_id       CHAR(36) PRIMARY KEY,
  patient_id           CHAR(36) NOT NULL,
  doctor_id            CHAR(36) NOT NULL,
  branch_id            CHAR(36) NULL,
  slot_id              CHAR(36) NULL,
  parent_appointment_id CHAR(36) NULL,
  created_by_user_id   CHAR(36) NOT NULL,
  appointment_type     VARCHAR(20) NOT NULL, -- TELECONSULT/INCLINIC
  status               VARCHAR(30) NOT NULL,
  scheduled_start_at_utc TIMESTAMP NOT NULL,
  scheduled_end_at_utc   TIMESTAMP NOT NULL,
  cancel_reason        VARCHAR(255) NULL,
  reschedule_reason    VARCHAR(255) NULL,
  policy_snapshot_json TEXT NULL,
  checked_in_at_utc    TIMESTAMP NULL,
  created_at_utc       TIMESTAMP NOT NULL,
  updated_at_utc       TIMESTAMP NOT NULL,
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  CONSTRAINT fk_appt_slot FOREIGN KEY (slot_id) REFERENCES slots(slot_id),
  CONSTRAINT fk_appt_creator FOREIGN KEY (created_by_user_id) REFERENCES users(user_id),
  CONSTRAINT fk_appt_parent FOREIGN KEY (parent_appointment_id) REFERENCES appointments(appointment_id),
  CONSTRAINT chk_appt_time CHECK (scheduled_start_at_utc < scheduled_end_at_utc)
);

-- TELE_SESSION
CREATE TABLE tele_sessions (
  tele_session_id      CHAR(36) PRIMARY KEY,
  appointment_id       CHAR(36) NOT NULL UNIQUE,
  join_open_at_utc     TIMESTAMP NOT NULL,
  join_close_at_utc    TIMESTAMP NOT NULL,
  started_at_utc       TIMESTAMP NULL,
  ended_at_utc         TIMESTAMP NULL,
  session_status       VARCHAR(20) NOT NULL,
  disconnect_count     INT NOT NULL DEFAULT 0,
  last_error_code      VARCHAR(50) NULL,
  created_at_utc       TIMESTAMP NOT NULL,
  updated_at_utc       TIMESTAMP NOT NULL,
  CONSTRAINT fk_ts_appt FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
  CONSTRAINT chk_ts_join CHECK (join_open_at_utc < join_close_at_utc)
);

-- ENCOUNTER
CREATE TABLE encounters (
  encounter_id         CHAR(36) PRIMARY KEY,
  appointment_id       CHAR(36) NOT NULL UNIQUE,
  outcome_status       VARCHAR(30) NOT NULL,
  clinical_notes_text  TEXT NULL,
  created_by_doctor_id CHAR(36) NOT NULL,
  signed_off_at_utc    TIMESTAMP NULL,
  created_at_utc       TIMESTAMP NOT NULL,
  updated_at_utc       TIMESTAMP NOT NULL,
  CONSTRAINT fk_enc_appt FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
  CONSTRAINT fk_enc_doc FOREIGN KEY (created_by_doctor_id) REFERENCES doctors(doctor_id)
);

-- PRESCRIPTION (versioned)
CREATE TABLE prescriptions (
  prescription_id      CHAR(36) PRIMARY KEY,
  encounter_id         CHAR(36) NOT NULL,
  version_no           INT NOT NULL,
  file_uri             VARCHAR(1000) NOT NULL,
  status               VARCHAR(20) NOT NULL, -- DRAFT/SIGNED
  signed_by_doctor_id  CHAR(36) NULL,
  signed_at_utc        TIMESTAMP NULL,
  created_at_utc       TIMESTAMP NOT NULL,
  updated_at_utc       TIMESTAMP NOT NULL,
  CONSTRAINT fk_pr_enc FOREIGN KEY (encounter_id) REFERENCES encounters(encounter_id),
  CONSTRAINT fk_pr_doc FOREIGN KEY (signed_by_doctor_id) REFERENCES doctors(doctor_id),
  CONSTRAINT uq_pr_version UNIQUE (encounter_id, version_no)
);

-- CONSENT (versioned)
CREATE TABLE consents (
  consent_id           CHAR(36) PRIMARY KEY,
  patient_id           CHAR(36) NOT NULL,
  scope                VARCHAR(30) NOT NULL, -- TELECONSULT
  consent_version      VARCHAR(30) NOT NULL,
  accepted_at_utc      TIMESTAMP NOT NULL,
  revoked_at_utc       TIMESTAMP NULL,
  accepted_text_hash   VARCHAR(100) NULL,
  created_at_utc       TIMESTAMP NOT NULL,
  CONSTRAINT fk_con_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  CONSTRAINT uq_consent UNIQUE (patient_id, scope, consent_version)
);

-- AUDIT_LOG (append-only)
CREATE TABLE audit_logs (
  audit_id             CHAR(36) PRIMARY KEY,
  actor_user_id        CHAR(36) NOT NULL,
  action               VARCHAR(60) NOT NULL,
  entity_type          VARCHAR(40) NOT NULL,
  entity_id            CHAR(36) NOT NULL,
  occurred_at_utc      TIMESTAMP NOT NULL,
  before_snapshot      TEXT NULL,
  after_snapshot       TEXT NULL,
  reason               VARCHAR(255) NULL,
  correlation_id       VARCHAR(80) NULL,
  ip_address           VARCHAR(60) NULL,
  user_agent           VARCHAR(255) NULL,
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(user_id)
);
