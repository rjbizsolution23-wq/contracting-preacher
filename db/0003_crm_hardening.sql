-- CRM Robustness Pack (this site only)
-- Adds: lead source/consent/UTM tracking on leads, persisted contact-form and
-- newsletter submissions (previously email-only and invisible to the CRM),
-- a privileged-action audit log, and a client-health-score snapshot table.
-- No payment data, no PII beyond what the site already collects via its
-- existing public forms, and no automated regulated decisioning is added
-- by this migration -- it only makes existing capture points visible,
-- explainable, and auditable inside the CRM.

-- 1. Extend the leads table with source attribution + consent capture.
-- SQLite/D1 ALTER TABLE only supports adding one column at a time.
ALTER TABLE leads ADD COLUMN source TEXT NOT NULL DEFAULT 'intake-form';
ALTER TABLE leads ADD COLUMN utm_source TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_medium TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_campaign TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN referrer TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN consent_email INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN consent_sms INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN score_explanation TEXT NOT NULL DEFAULT '[]';
ALTER TABLE leads ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- 2. Contact form submissions -- previously only emailed via SendGrid and
-- never persisted anywhere. Now every submission becomes a CRM-visible record.
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'contact-form',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  email_delivery TEXT NOT NULL DEFAULT 'not-configured',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- 3. Booking (consultation) requests -- same gap as contact submissions.
CREATE TABLE IF NOT EXISTS booking_requests (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  requested_date TEXT NOT NULL DEFAULT '',
  requested_time TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'requested',
  email_delivery TEXT NOT NULL DEFAULT 'not-configured',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_requests_email ON booking_requests(email);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);

-- 4. Newsletter subscribers -- adds CAN-SPAM-relevant consent/unsubscribe
-- tracking that did not exist before (SendGrid marketing contacts held this,
-- but the CRM itself had no record and no unsubscribe/suppression state).
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'subscribed',
  source TEXT NOT NULL DEFAULT 'newsletter-form',
  subscribed_at TEXT NOT NULL,
  unsubscribed_at TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- 5. Privileged-action audit log (blueprint section 21/22: audit_events).
-- Every admin-gated write (profile edits, document uploads, approval
-- decisions) and every failed-auth attempt on an admin/portal endpoint
-- should write a row here. This is append-only; the app must never expose
-- a delete endpoint for this table.
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL DEFAULT 'unknown',
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT '',
  resource_id TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT 'success',
  detail TEXT NOT NULL DEFAULT '',
  ip_hint TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_result ON audit_events(result);

-- 6. Client health score snapshots (blueprint section 23, scoped to what
-- this site actually tracks today: readiness/documents/opportunity
-- pipeline -- not payment/appointment/support-ticket data, which do not
-- exist in this codebase and are out of scope for this release).
CREATE TABLE IF NOT EXISTS client_health_scores (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL DEFAULT '',
  lead_id TEXT NOT NULL DEFAULT '',
  onboarding_score INTEGER NOT NULL DEFAULT 0,
  document_score INTEGER NOT NULL DEFAULT 0,
  pipeline_score INTEGER NOT NULL DEFAULT 0,
  engagement_score INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  band TEXT NOT NULL DEFAULT 'unscored',
  explanation TEXT NOT NULL DEFAULT '[]',
  computed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_client_health_scores_profile_id ON client_health_scores(profile_id);
CREATE INDEX IF NOT EXISTS idx_client_health_scores_computed_at ON client_health_scores(computed_at);
