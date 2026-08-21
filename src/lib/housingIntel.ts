// Marcus — Affordable Housing, Recovery Housing & Government Housing Funding
// Intelligence module. South Carolina-focused (converted from a general/
// national research framework into SC-specific agencies, funds, and
// procurement channels). Mirrors the structure used in commandCenter.ts
// and scResources.ts: static, verifiable content plus live tool calls for
// anything time-sensitive (open grants, deadlines, award history).
//
// Data-quality discipline: every program listed here is a real, named SC
// or federal agency/fund with an official URL. Amounts, deadlines, and
// "open now" status are NOT hardcoded here because those change — the
// live agent pulls current opportunity data through /api/funding/discover
// and site-specific searches instead of this static file asserting dates.

export type FieldGroup = {
  title: string
  fields: string[]
}

// ---------------------------------------------------------------------------
// The non-negotiable truth (what Marcus can / must not do)
// ---------------------------------------------------------------------------

export const MARCUS_CAN = [
  'Search current federal and South Carolina housing/recovery-housing funding',
  'Identify HUD, SCORF, SC Housing, and PHA programs relevant to a project',
  'Distinguish grant vs. forgivable loan vs. low-interest loan vs. contract vs. rental subsidy',
  'Score opportunities using funding size, probability, accessibility, time-to-money, and fit',
  'Flag red-flag requirements (match funds, bonding, Davis-Bacon, environmental review)',
  'Draft a capital-stack outline for a specific property or program',
  'Identify SC Continuum of Care, PHA, and behavioral-health partners to approach',
]

export const MARCUS_MUST_NOT = [
  'Present an expired or closed program as currently open',
  'Assert a specific award amount, approval odds, or "guaranteed funding" outcome',
  'Treat a sober-living/recovery residence as legally equivalent to a licensed treatment facility',
  'Recommend room-by-room Section 8 subletting without confirming PHA/lease/zoning rules first',
  'Structure or suggest referral fees, kickbacks, or patient-brokering arrangements',
  'Fabricate a South Carolina agency, program, deadline, or citation that cannot be sourced',
]

// ---------------------------------------------------------------------------
// South Carolina housing & recovery-housing agency directory
// ---------------------------------------------------------------------------

export type AgencyRef = {
  name: string
  role: string
  url: string
}

export const SC_HOUSING_AGENCIES: AgencyRef[] = [
  {
    name: 'SC Housing (SC State Housing Finance and Development Authority)',
    role: 'Statewide housing finance agency — homebuyer programs, LIHTC, HOME, Housing Trust Fund, multifamily development financing, and procurement opportunities.',
    url: 'https://schousing.sc.gov/',
  },
  {
    name: 'South Carolina Opioid Recovery Fund (SCORF)',
    role: 'Statewide opioid-settlement fund board. Approved uses explicitly include supportive/recovery housing and other residential recovery support.',
    url: 'https://scorf.sc.gov/',
  },
  {
    name: 'SC Department of Behavioral Health & Developmental Disabilities — Office of Substance Use Services',
    role: 'Administers the SC Recovery Housing Program; funds are restricted to SC Oxford Houses or SCARR-certified recovery residences.',
    url: 'https://bhdd.sc.gov/office-substance-use-services/services/recovery/applications-recovery-housing-assistance',
  },
  {
    name: 'South Carolina Alliance for Recovery Residences (SCARR)',
    role: 'State NARR affiliate — recognized certification body for SC recovery residences across NARR levels of support.',
    url: 'https://scarronline.org/',
  },
  {
    name: 'SC Department of Consumer Affairs / SC Board of Financial Institutions',
    role: 'Regulates SC mortgage lenders/brokers and consumer-finance licensing relevant to acquisition or rehab financing partners.',
    url: 'https://consumer.sc.gov/business-resourceslaws/licensing/mortgage-broker',
  },
  {
    name: 'HUD Continuum of Care — South Carolina',
    role: 'Coordinates federal homelessness-assistance funding (CoC Program, ESG) across SC balance-of-state and local CoCs.',
    url: 'https://www.hud.gov/program_offices/comm_planning/coc',
  },
  {
    name: 'U.S. Department of Veterans Affairs — SC HUD-VASH partners',
    role: 'Veterans-specific supportive housing vouchers administered jointly with participating SC public housing authorities.',
    url: 'https://www.va.gov/homeless/hud-vash.asp',
  },
  {
    name: 'USDA Rural Development — South Carolina',
    role: 'Section 515/514/516/538 rural rental and farm-labor housing programs for eligible rural SC communities.',
    url: 'https://www.rd.usda.gov/sc',
  },
]

// ---------------------------------------------------------------------------
// South Carolina public housing authorities relevant to Section 8 / PBV
// (mirrors the existing HOUSING_RESOURCES entries in scResources.ts —
// referenced here, not duplicated, so the two stay in sync)
// ---------------------------------------------------------------------------

export const SC_PHA_RESEARCH_CHECKLIST = [
  'Official PHA name and territory served',
  'Housing Choice Voucher availability and current wait-list status',
  'Payment standards and utility allowance schedule',
  'Landlord enrollment procedure and required inspection standard (HQS/UPCS-V)',
  'Landlord incentive or vacancy-loss mitigation programs, if published',
  'Existing or upcoming Project-Based Voucher (PBV) solicitations',
  'HUD-VASH, Mainstream, and other special-purpose voucher allocations',
  'RAD (Rental Assistance Demonstration) conversion or disposition activity',
  'Contact information and official procurement/RFP page',
]

// ---------------------------------------------------------------------------
// Recovery housing vs. treatment — regulatory distinctions specific to SC
// ---------------------------------------------------------------------------

export const RECOVERY_HOUSING_MODEL_DISTINCTIONS: FieldGroup[] = [
  {
    title: 'Recovery residence / sober living (SCARR-certified)',
    fields: [
      'Voluntary state-recognized certification through SCARR (NARR affiliate), not a licensed medical facility',
      'Eligible for SC Recovery Housing Program funds only if SCARR-certified or an SC Oxford House',
      'Subject to NARR level-of-support standards, not DHEC treatment-facility licensure',
      'Zoning: evaluate as a residential use; document any reasonable-accommodation request under the Fair Housing Act',
    ],
  },
  {
    title: 'Licensed substance-use treatment facility',
    fields: [
      'Requires DHEC/DAODAS-recognized licensure for clinical treatment services',
      'Distinct compliance track from recovery-residence certification — do not conflate the two',
      'Different funding streams (Medicaid behavioral-health billing vs. recovery-housing operating funds)',
    ],
  },
  {
    title: 'Transitional / permanent supportive housing',
    fields: [
      'Typically HUD CoC Program or ESG funded, case-management requirements attached',
      'Distinct eligibility rules from recovery-residence certification',
      'May layer with HCV/PBV for long-term rental subsidy',
    ],
  },
]

// ---------------------------------------------------------------------------
// Funding matrix — South Carolina + federal programs applicable to housing
// and recovery-housing projects
// ---------------------------------------------------------------------------

export type FundingCategory = {
  category: string
  programs: string[]
}

export const SC_FUNDING_MATRIX: FundingCategory[] = [
  {
    category: 'HUD federal programs (apply through SC Housing, local PHAs, or SC CoCs)',
    programs: [
      'HOME Investment Partnerships Program',
      'Community Development Block Grant (CDBG)',
      'Housing Trust Fund',
      'Continuum of Care Program',
      'Emergency Solutions Grants',
      'Housing Choice Vouchers / Project-Based Vouchers',
      'HUD-VASH',
      'Section 811 / Section 202 supportive housing',
    ],
  },
  {
    category: 'South Carolina opioid recovery & behavioral-health funds',
    programs: [
      'SC Opioid Recovery Fund (SCORF) — Guaranteed Political Subdivision and Discretionary Subfunds',
      'SC Recovery Housing Program (Oxford House / SCARR-certified residences only)',
      'County-level opioid settlement discretionary allocations',
    ],
  },
  {
    category: 'Tax credits and gap-financing tools',
    programs: [
      '9% and 4% Low-Income Housing Tax Credits (allocated by SC Housing)',
      'Tax-exempt private activity bonds',
      'New Markets Tax Credits (project-dependent)',
      'Historic rehabilitation tax credits for adaptive-reuse properties',
    ],
  },
  {
    category: 'Rural and USDA financing',
    programs: [
      'USDA Section 515 rural rental housing',
      'USDA Section 538 guaranteed rural rental housing',
      'USDA Section 504 repair loans/grants',
    ],
  },
  {
    category: 'CDFI / bank / mission-lender financing',
    programs: [
      'South Carolina Community Loan Fund',
      'CDFI acquisition and predevelopment loans',
      'CRA-motivated regional bank affordable-housing lending',
    ],
  },
]

// ---------------------------------------------------------------------------
// Capital-stack example (illustrative structure, not a specific promise)
// ---------------------------------------------------------------------------

export const CAPITAL_STACK_EXAMPLE = {
  scenario: 'Illustrative 12-bed recovery residence acquisition + rehab (South Carolina)',
  lineItems: [
    { item: 'Property acquisition', note: 'CDFI or bank acquisition loan; SC Housing Trust Fund gap financing where eligible' },
    { item: 'Rehabilitation', note: 'SCORF discretionary subfund, county opioid allocation, or CDBG rehab funds' },
    { item: 'Furniture / startup costs', note: 'Foundation grant, county behavioral-health contract advance' },
    { item: 'Working capital', note: 'Resident program fees, Medicaid-reimbursable peer/case-management services where separately contracted' },
  ],
  disclaimer:
    'This is an illustrative structure only. Actual eligible uses, match requirements, and award amounts must be verified against each program\u2019s current, official guidance before relying on them.',
}

// ---------------------------------------------------------------------------
// Opportunity scoring system (0-100), same weighting model as Marcus prompt
// ---------------------------------------------------------------------------

export type ScoringFactor = { factor: string; weight: number; description: string }

export const HOUSING_SCORING_FACTORS: ScoringFactor[] = [
  { factor: 'Funding size', weight: 20, description: 'Potential dollar value of the opportunity.' },
  { factor: 'Probability', weight: 20, description: 'Likelihood a qualified applicant could realistically win or access it.' },
  { factor: 'Accessibility', weight: 15, description: 'Ease of qualification and application.' },
  { factor: 'Time to money', weight: 15, description: 'How quickly funding or revenue could become available.' },
  { factor: 'Strategic fit', weight: 15, description: 'Relevance to affordable housing / recovery housing mission.' },
  { factor: 'Repeatability', weight: 10, description: 'Whether this could become recurring revenue or funding.' },
  { factor: 'Competitive advantage', weight: 5, description: 'Whether a small or new operator has a realistic path to compete.' },
]

export const HOUSING_SCORE_TOTAL = HOUSING_SCORING_FACTORS.reduce((sum, f) => sum + f.weight, 0)

export const HOUSING_DECISION_BANDS = [
  { range: '90-100', label: 'Priority A \u2014 pursue immediately', tone: 'priority' },
  { range: '75-89', label: 'Priority B \u2014 strong opportunity', tone: 'strong' },
  { range: '60-74', label: 'Priority C \u2014 worth developing', tone: 'monitor' },
  { range: 'Below 60', label: 'Monitor or deprioritize', tone: 'low' },
]

// ---------------------------------------------------------------------------
// Funding-type taxonomy — never call every dollar a "grant"
// ---------------------------------------------------------------------------

export const FUNDING_TYPE_TAXONOMY = [
  { type: 'Grant', description: 'Money generally not repaid, subject to compliance and reporting requirements.' },
  { type: 'Forgivable loan', description: 'Debt forgiven after meeting affordability or compliance requirements over time.' },
  { type: 'Low-interest loan', description: 'Repayable financing, typically below-market rate.' },
  { type: 'Contract', description: 'A government or managed-care entity pays for defined services or deliverables.' },
  { type: 'Rental subsidy', description: 'Ongoing rent or housing-assistance payment support (e.g., HCV, PBV).' },
  { type: 'Tax credit', description: 'A benefit that usually requires investment or tax-credit-partnership structuring.' },
  { type: 'Reimbursement', description: 'Costs must be incurred first, then reimbursed after approval.' },
  { type: 'Property incentive', description: 'Discounted land or property, or development-assistance incentives.' },
]

// ---------------------------------------------------------------------------
// Red-flag requirements to surface (not automatic disqualifiers)
// ---------------------------------------------------------------------------

export const HOUSING_RED_FLAGS = [
  'Reimbursement-only funding structure (cash flow burden before payment)',
  'Large required match funds',
  'Extensive prior-HUD or prior-development experience requirements',
  'Bonding requirements',
  'Audited financial statements or substantial reserve requirements',
  'Nonprofit-only eligibility (may require a fiscal-sponsor or JV structure)',
  'Long-term affordability restrictions (deed covenants)',
  'Davis-Bacon prevailing-wage requirements',
  'Environmental review requirements (NEPA or state equivalent)',
  'Restrictive local zoning for group residential use',
]

// ---------------------------------------------------------------------------
// Government contract / RFP search targets specific to housing services
// ---------------------------------------------------------------------------

export const HOUSING_CONTRACT_SEARCH_TERMS = [
  'recovery residence services RFP South Carolina',
  'sober living contract SC DAODAS OR DBHDD',
  'transitional housing RFP South Carolina',
  'homeless services contract South Carolina Continuum of Care',
  'housing navigation case management RFP South Carolina',
  'PHA project-based voucher RFP South Carolina',
  'reentry housing services South Carolina Department of Corrections',
  'veteran supportive housing RFP South Carolina',
]

// ---------------------------------------------------------------------------
// Strategic partner categories to approach
// ---------------------------------------------------------------------------

export const HOUSING_PARTNER_CATEGORIES = [
  { partner: 'South Carolina Continuum of Care (local + balance-of-state)', why: 'Controls HUD CoC/ESG funding priorities and homelessness system referrals.' },
  { partner: 'SC Department of Behavioral Health & Developmental Disabilities', why: 'Administers SC Recovery Housing Program funds and behavioral-health contracts.' },
  { partner: 'Local public housing authority', why: 'Controls Housing Choice Voucher supply, PBV solicitations, and landlord incentive programs.' },
  { partner: 'SCARR (SC Alliance for Recovery Residences)', why: 'Certification pathway required for SC Recovery Housing Program eligibility.' },
  { partner: 'County solicitor / probation & parole / drug courts', why: 'Referral pipeline for reentry and diversion-eligible residents.' },
  { partner: 'Managed-care organizations (Medicaid)', why: 'May separately reimburse peer-support or case-management services layered on top of housing.' },
  { partner: 'Community foundations and hospital/health-conversion foundations', why: 'Philanthropic capital for startup costs, furniture, and gap funding.' },
]

// ---------------------------------------------------------------------------
// Intake fields specific to a housing/recovery-housing project profile
// ---------------------------------------------------------------------------

export const HOUSING_PROJECT_INTAKE_FIELDS = [
  'Project type (recovery residence, transitional housing, affordable multifamily, PSH, etc.)',
  'Target population (adult men, adult women, veterans, reentry, youth, families)',
  'County / city and SC Continuum of Care jurisdiction',
  'Property status (already owned, under contract, or still searching)',
  'Bed / unit count and current occupancy status',
  'SCARR certification status or intent to certify',
  'Existing licenses, insurance, and staffing in place',
  'Funding already secured vs. funding gap',
  'Referral partners already in place (courts, treatment providers, CoC, hospitals)',
  'Target open date',
]

// ---------------------------------------------------------------------------
// Command-center module directory entry (for the shared subnav pattern)
// ---------------------------------------------------------------------------

export const HOUSING_MODULE_STATS = [
  { label: 'SC agencies tracked', value: String(SC_HOUSING_AGENCIES.length) },
  { label: 'Funding categories', value: String(SC_FUNDING_MATRIX.length) },
  { label: 'Scoring factors', value: String(HOUSING_SCORING_FACTORS.length) },
  { label: 'Red-flag checks', value: String(HOUSING_RED_FLAGS.length) },
]
