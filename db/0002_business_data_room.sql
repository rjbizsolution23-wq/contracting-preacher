-- Business Funding + Contracting AI Command Center
-- Master business data room, opportunity scoring, and approval-gate audit log.
-- Sensitive owner PII (SSNs, bank details, personal financial statements) must
-- never be written to these tables in plaintext. Store only encrypted blobs or
-- references to an external encrypted vault in *_restricted columns.

CREATE TABLE IF NOT EXISTS business_profiles (
  id TEXT PRIMARY KEY,
  -- Business identity
  legal_name TEXT NOT NULL,
  dba_name TEXT NOT NULL DEFAULT '',
  entity_type TEXT NOT NULL DEFAULT '',
  state_of_formation TEXT NOT NULL DEFAULT '',
  formation_date TEXT NOT NULL DEFAULT '',
  principal_address TEXT NOT NULL DEFAULT '',
  mailing_address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  website TEXT NOT NULL DEFAULT '',
  service_area TEXT NOT NULL DEFAULT '',
  profit_status TEXT NOT NULL DEFAULT 'for-profit',
  fiscal_year_end TEXT NOT NULL DEFAULT '',
  operating_status TEXT NOT NULL DEFAULT 'active',
  -- Government identifiers
  ein_on_file INTEGER NOT NULL DEFAULT 0,
  uei TEXT NOT NULL DEFAULT '',
  cage_code TEXT NOT NULL DEFAULT '',
  sam_status TEXT NOT NULL DEFAULT 'unknown',
  sam_expiration TEXT NOT NULL DEFAULT '',
  sc_vendor_number TEXT NOT NULL DEFAULT '',
  sceis_status TEXT NOT NULL DEFAULT 'unknown',
  grants_gov_status TEXT NOT NULL DEFAULT 'unknown',
  grants_gov_aor TEXT NOT NULL DEFAULT '',
  sbir_registry_id TEXT NOT NULL DEFAULT '',
  -- Capabilities
  primary_naics TEXT NOT NULL DEFAULT '',
  secondary_naics TEXT NOT NULL DEFAULT '',
  psc_fsc_codes TEXT NOT NULL DEFAULT '',
  core_offering TEXT NOT NULL DEFAULT '',
  differentiators TEXT NOT NULL DEFAULT '',
  employees TEXT NOT NULL DEFAULT '',
  contractors TEXT NOT NULL DEFAULT '',
  can_prime INTEGER NOT NULL DEFAULT 0,
  can_sub INTEGER NOT NULL DEFAULT 0,
  bonding_capacity TEXT NOT NULL DEFAULT '',
  max_contract_capacity TEXT NOT NULL DEFAULT '',
  -- Certifications (comma separated slugs, e.g. "8a,hubzone,wosb,sc-mbe")
  certifications TEXT NOT NULL DEFAULT '',
  licenses TEXT NOT NULL DEFAULT '',
  -- Financial snapshot (ranges/strings, never raw personal financials)
  revenue_2023 TEXT NOT NULL DEFAULT '',
  revenue_2024 TEXT NOT NULL DEFAULT '',
  revenue_2025 TEXT NOT NULL DEFAULT '',
  revenue_ytd TEXT NOT NULL DEFAULT '',
  monthly_recurring_revenue TEXT NOT NULL DEFAULT '',
  current_cash TEXT NOT NULL DEFAULT '',
  current_debt TEXT NOT NULL DEFAULT '',
  -- Funding request
  funding_amount_requested TEXT NOT NULL DEFAULT '',
  funding_minimum TEXT NOT NULL DEFAULT '',
  use_of_funds TEXT NOT NULL DEFAULT '',
  jobs_created TEXT NOT NULL DEFAULT '',
  project_timeline TEXT NOT NULL DEFAULT '',
  -- Lanes of interest (comma separated: contracts,grants,sbir,loans,investors,accelerators,sponsors,partners)
  lanes_of_interest TEXT NOT NULL DEFAULT '',
  top_projects TEXT NOT NULL DEFAULT '',
  biggest_goal TEXT NOT NULL DEFAULT '',
  biggest_gap TEXT NOT NULL DEFAULT '',
  -- South Carolina profile addendum
  sc_county TEXT NOT NULL DEFAULT '',
  sc_municipality TEXT NOT NULL DEFAULT '',
  sc_congressional_district TEXT NOT NULL DEFAULT '',
  sc_rural_urban TEXT NOT NULL DEFAULT '',
  sc_hubzone_status TEXT NOT NULL DEFAULT 'unknown',
  sc_sos_status TEXT NOT NULL DEFAULT 'unknown',
  sc_mbe_status TEXT NOT NULL DEFAULT 'unknown',
  sc_scdot_status TEXT NOT NULL DEFAULT 'unknown',
  target_sc_agencies TEXT NOT NULL DEFAULT '',
  target_federal_installations TEXT NOT NULL DEFAULT '',
  -- Full extended profile (every additional field from the intake spec that does
  -- not have a dedicated column). Never place SSNs, bank account numbers,
  -- passwords, or MFA codes in this JSON blob.
  extended_json TEXT NOT NULL DEFAULT '{}',
  readiness_notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_business_profiles_email ON business_profiles(email);
CREATE INDEX IF NOT EXISTS idx_business_profiles_updated_at ON business_profiles(updated_at);

-- 24-folder master business data room (spec section 14)
CREATE TABLE IF NOT EXISTS business_documents (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  folder TEXT NOT NULL,
  name TEXT NOT NULL,
  owner TEXT NOT NULL DEFAULT '',
  version TEXT NOT NULL DEFAULT '',
  effective_date TEXT NOT NULL DEFAULT '',
  expiration_date TEXT NOT NULL DEFAULT '',
  confidentiality_level TEXT NOT NULL DEFAULT 'internal',
  verified_status TEXT NOT NULL DEFAULT 'unverified',
  supporting_evidence TEXT NOT NULL DEFAULT '',
  allowed_use TEXT NOT NULL DEFAULT '',
  last_reviewed_date TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_business_documents_profile ON business_documents(profile_id);
CREATE INDEX IF NOT EXISTS idx_business_documents_folder ON business_documents(folder);

-- Past performance / customer evidence records (spec section 6)
CREATE TABLE IF NOT EXISTS business_past_performance (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  buyer_type TEXT NOT NULL DEFAULT 'commercial',
  contract_number TEXT NOT NULL DEFAULT '',
  prime_or_sub TEXT NOT NULL DEFAULT 'prime',
  start_date TEXT NOT NULL DEFAULT '',
  end_date TEXT NOT NULL DEFAULT '',
  contract_value TEXT NOT NULL DEFAULT '',
  naics_psc TEXT NOT NULL DEFAULT '',
  scope_of_work TEXT NOT NULL DEFAULT '',
  quantified_outcome TEXT NOT NULL DEFAULT '',
  reference_contact TEXT NOT NULL DEFAULT '',
  evidence_type TEXT NOT NULL DEFAULT '',
  permission_to_publish INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_past_performance_profile ON business_past_performance(profile_id);

-- Tracked opportunities and their scoring results (spec section 15/16)
CREATE TABLE IF NOT EXISTS business_opportunities (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  opportunity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  agency_or_buyer TEXT NOT NULL DEFAULT '',
  deadline TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  hard_disqualifiers TEXT NOT NULL DEFAULT '[]',
  fit_score INTEGER NOT NULL DEFAULT 0,
  score_breakdown TEXT NOT NULL DEFAULT '{}',
  decision_band TEXT NOT NULL DEFAULT 'no-bid',
  bid_no_bid TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'researching',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_opportunities_profile ON business_opportunities(profile_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON business_opportunities(status);

-- Human/AOR approval gate audit log (spec section 16). Every legally binding
-- or sensitive action must have a row here before submission proceeds.
CREATE TABLE IF NOT EXISTS business_approvals (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  opportunity_id TEXT NOT NULL DEFAULT '',
  gate TEXT NOT NULL,
  approved_by_name TEXT NOT NULL DEFAULT '',
  approved_by_role TEXT NOT NULL DEFAULT '',
  decision TEXT NOT NULL DEFAULT 'pending',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_approvals_profile ON business_approvals(profile_id);
CREATE INDEX IF NOT EXISTS idx_approvals_gate ON business_approvals(gate);
