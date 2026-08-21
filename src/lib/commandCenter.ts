// Business Funding + Contracting AI Command Center
// Static content layer powering /command-center and its sub-routes.
// This mirrors the structure used in src/lib/scResources.ts and src/lib/fedfunding.ts.

export type FieldGroup = {
  title: string
  fields: string[]
}

export type ChecklistItem = {
  label: string
  detail?: string
}

// ---------------------------------------------------------------------------
// The non-negotiable truth (AI can / AI must not)
// ---------------------------------------------------------------------------

export const AI_CAN = [
  'Search opportunities',
  'Check eligibility',
  'Research past winners and incumbents',
  'Score fit',
  'Draft narratives',
  'Populate non-sensitive application fields',
  'Build proposal packages',
  'Detect missing documents',
  'Track deadlines',
  'Draft follow-ups',
]

export const AI_MUST_NOT = [
  'Invent revenue, customers, certifications or past performance',
  'Falsify ownership or demographic status',
  'Sign certifications for the owner',
  'Submit an application requiring an authorized representative without approval',
  'Guarantee an award',
]

export const TRUTH_CITATIONS = [
  {
    label: 'Grants.gov Applicant Registration and Workspace Roles',
    org: 'Grants.gov',
    url: 'https://www.grants.gov/applicants/applicant-registration',
    note: 'Organizations need SAM/UEI registration, and authorized organization roles control submission.',
  },
  {
    label: 'How to Apply and Succeed at YC',
    org: 'Y Combinator',
    url: 'https://www.ycombinator.com/library/It-how-to-apply-and-succeed-at-yc',
    note: 'Investors evaluate founders, team responsibilities, product progress and traction.',
  },
  {
    label: 'Techstars Accelerator Application Preview',
    org: 'Techstars',
    url: 'https://www.techstars.com/application-preview',
    note: 'Accelerator applications examine founders, company information and business progress.',
  },
  {
    label: 'Entity Registration Checklist',
    org: 'SAM.gov / GSA',
    url: 'https://sam.gov/sites/default/files/2024-11/entity-checklist.pdf',
    note: 'Federal registration requires verified legal, tax, ownership and banking information.',
  },
  {
    label: 'Capital-Raising Pathways',
    org: 'U.S. Securities and Exchange Commission',
    url: 'https://www.sec.gov/resources-small-businesses/smallbiz-essentials-what-pathways-are-available-raise-capital-investors',
    note: 'Offering investments generally involves securities laws and requires registration or an exemption.',
  },
  {
    label: 'Write Your Business Plan',
    org: 'U.S. Small Business Administration',
    url: 'https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan',
    note: 'Business plans organize company, market and financial information used in financing.',
  },
  {
    label: 'SBA Form 413 — Personal Financial Statement',
    org: 'U.S. Small Business Administration',
    url: 'https://www.sba.gov/document/sba-form-413-personal-financial-statement',
    note: 'SBA uses the form to assess personal financial condition for applicable programs.',
  },
  {
    label: 'SC APEX Accelerator',
    org: 'South Carolina APEX Accelerator',
    url: 'https://scaccelerator.org/',
    note: 'SC APEX provides individualized government-contracting assistance.',
  },
  {
    label: 'South Carolina SBDC',
    org: 'SC Small Business Development Centers',
    url: 'https://www.scsbdc.com/',
    note: 'SC SBDC provides confidential business consulting across South Carolina.',
  },
]

// ---------------------------------------------------------------------------
// Section 1 — Minimum information needed to start searching
// ---------------------------------------------------------------------------

export const BUSINESS_IDENTITY_FIELDS: FieldGroup = {
  title: 'Business identity',
  fields: [
    'Exact legal business name', 'DBA/brand name', 'Entity type (LLC, corporation, nonprofit, sole proprietor)',
    'State of formation', 'Formation date', 'Principal business address', 'Mailing address',
    'Business telephone', 'General business email', 'Website', 'Social profiles',
    'Counties and states served', 'Areas where the company can perform work',
    'Remote, national or local delivery capability', 'For-profit or nonprofit status',
    'Fiscal-year end', 'Current operating status',
  ],
}

export const GOVERNMENT_IDENTIFIER_FIELDS: FieldGroup = {
  title: 'Government identifiers',
  fields: [
    'EIN — stored securely (never in plaintext chat)', 'Unique Entity ID (UEI)', 'CAGE code',
    'SAM.gov expiration date', 'SC state vendor number', 'SCEIS registration status',
    'Grants.gov organization profile', 'Grants.gov EBiz point of contact',
    'Grants.gov Authorized Organization Representative (AOR)', 'SBIR Company Registry ID, when applicable',
    'NIH eRA Commons credentials, when applicable', 'State and local vendor IDs',
    'DUNS only where a legacy system still requests it',
  ],
}

export const CONTACT_AUTHORITY_ROLES = [
  'Legal owner', 'Authorized signer', 'Proposal contact', 'Contract administrator',
  'Financial contact', 'Grants.gov AOR', 'SAM.gov entity administrator', 'Technical lead',
  'Sponsorship contact', 'Investor-relations contact',
]

// ---------------------------------------------------------------------------
// Section 2 — Ownership and certification profile
// ---------------------------------------------------------------------------

export const OWNERSHIP_FIELDS = [
  'Full legal name', 'Ownership percentage', 'Voting-control percentage',
  'U.S. citizenship or residency status where eligibility requires it', 'Veteran status',
  'Service-disabled veteran status', 'Gender', 'Socially or economically disadvantaged status',
  'Disability status', 'Tribal affiliation, if applicable', 'Primary residence',
  'Day-to-day management role', 'Resume and professional history', 'Other businesses owned',
  'Ownership changes during the last five years',
]

export const FEDERAL_CERTIFICATION_TYPES = [
  'Small Business', 'Small Disadvantaged Business', '8(a)', 'HUBZone',
  'Women-Owned Small Business', 'Economically Disadvantaged WOSB',
  'Veteran-Owned Small Business', 'Service-Disabled Veteran-Owned Small Business',
  'AbilityOne eligibility, where applicable',
]

export const SC_CERTIFICATION_TYPES = [
  'SC Minority Business Enterprise', 'SCDOT DBE', 'SCDOT SBE',
  'SCDOT contractor prequalification', 'SC construction licenses', 'Residential builder licenses',
  'Professional licenses', 'Local minority or supplier-diversity certifications',
  'Airport ACDBE, where applicable',
]

export const GEOGRAPHIC_ELIGIBILITY_FIELDS = [
  'Principal office census tract', 'Employee work locations', 'HUBZone status', 'Rural status',
  'Opportunity Zone', 'Low-to-moderate-income service areas', 'Historically underserved communities',
  'Qualified census tracts', 'Disaster-affected areas', 'County economic-distress designations',
]

// ---------------------------------------------------------------------------
// Section 3 — Business capabilities
// ---------------------------------------------------------------------------

export const CORE_OFFERING_FIELDS = [
  'Name', 'Plain-English description', 'Customer problem solved', 'Deliverables', 'Delivery method',
  'Typical timeline', 'Current price', 'Unit cost', 'Gross margin', 'Geographic availability',
  'Capacity per month', 'Maximum contract size', 'Minimum viable engagement', 'Required licenses',
  'Required insurance', 'Relevant certifications', 'Differentiators', 'Comparable past projects',
]

export const GOVERNMENT_CLASSIFICATION_CODES = [
  'Primary NAICS code', 'Secondary NAICS codes', 'PSC and FSC codes', 'NIGP commodity codes',
  'UNSPSC codes', 'SIC codes, when requested', 'Keywords contracting officers might search',
  'Set-aside eligibility by NAICS', 'Applicable size standards',
]

export const CONTRACTING_CAPABILITY_FIELDS = [
  'Can serve as prime contractor?', 'Can serve as subcontractor?', 'Bonding capacity',
  'Line of credit', 'Mobilization capacity', 'Number of employees', 'Number of contractors',
  'Geographic deployment capacity', 'Equipment owned', 'Vehicles owned', 'Facilities',
  'Warehouse capacity', 'Security clearances', 'Quality-control systems', 'Cybersecurity level',
  'Emergency-response availability', 'Supply-chain partners',
]

// ---------------------------------------------------------------------------
// Section 4 — Problem, solution and competitive positioning
// ---------------------------------------------------------------------------

export const PROBLEM_STATEMENT_QUESTIONS = [
  'What problem does the business solve?', 'Who experiences the problem?',
  'How large is the problem?', 'What does the problem cost?',
  'Why are current solutions inadequate?', 'Why must the problem be solved now?',
  'What evidence proves the problem exists?',
]

export const SOLUTION_STATEMENT_QUESTIONS = [
  'What exactly does the company provide?', 'How does it work?',
  'What is technically or operationally different?', 'Why is it faster, safer or more effective?',
  'What measurable result does it produce?', 'What intellectual property supports it?',
  'What prevents competitors from copying it?', 'What evidence proves it works?',
]

export const COMPETITIVE_ANALYSIS_FIELDS = [
  'Competitor name', 'Website', 'Product', 'Pricing', 'Market segment', 'Contract history',
  'Funding history', 'Strengths', 'Weaknesses', 'Differentiation', 'Replacement risk',
  'Partnering opportunity',
]

// ---------------------------------------------------------------------------
// Section 5 — Customer and market evidence
// ---------------------------------------------------------------------------

export const TARGET_CUSTOMER_TYPES = [
  'Federal agencies', 'State agencies', 'Counties', 'Municipalities', 'School systems',
  'Universities', 'Healthcare systems', 'Enterprise customers', 'Small businesses', 'Consumers',
  'Nonprofits', 'Prime contractors', 'Target sponsors', 'Target investors',
]

export const MARKET_EVIDENCE_FIELDS = [
  'Total addressable market', 'Serviceable available market', 'Serviceable obtainable market',
  'Customer count', 'Active users', 'Paying customers', 'Pipeline', 'Conversion rate',
  'Retention rate', 'Churn', 'Average contract value', 'Customer acquisition cost',
  'Lifetime value', 'Monthly recurring revenue', 'Annual recurring revenue',
  'Year-over-year growth', 'Letters of intent', 'Preorders', 'Pilot agreements',
  'Partnerships', 'Waitlist', 'Testimonials', 'Customer references',
]

// ---------------------------------------------------------------------------
// Section 6 — Past performance
// ---------------------------------------------------------------------------

export const PAST_PERFORMANCE_FIELDS = [
  'Customer name', 'Government or commercial', 'Contract number', 'Purchase-order number',
  'Prime or subcontract', 'Start and end dates', 'Contract value', 'Amount received',
  'Scope of work', 'Deliverables', 'NAICS and PSC codes', 'Performance location',
  'Project manager', 'Customer reference', 'Telephone and email', 'Challenges encountered',
  'Corrective actions', 'Results', 'Quantified outcomes', 'On-time status', 'On-budget status',
  'CPARS rating, if applicable', 'Permission to publish', 'Redacted supporting documents',
]

export const ACCEPTABLE_PAST_PERFORMANCE_EVIDENCE = [
  'Executed contracts', 'Purchase orders', 'Paid invoices', 'Notices to proceed',
  'Award letters', 'Client acceptance letters', 'CPARS reports', 'Performance evaluations',
  'Reference letters', 'Case studies', 'Analytics screenshots', 'Before-and-after data',
]

// ---------------------------------------------------------------------------
// Section 7 — Financial information
// ---------------------------------------------------------------------------

export const HISTORICAL_FINANCIAL_FIELDS = [
  'Profit-and-loss statements', 'Balance sheets', 'Cash-flow statements', 'Business tax returns',
  'Revenue by customer', 'Revenue by product', 'Revenue by geography',
  'Accounts receivable aging', 'Accounts payable aging', 'Debt schedule', 'Payroll summary',
  'Bank statements', 'Current cash balance', 'Monthly burn', 'Gross margin', 'Operating margin',
  'Existing grants', 'Existing loans', 'Existing investor capital',
]

export const FORECAST_FIELDS = [
  '12-month monthly forecast', 'Three-year annual forecast', 'Hiring plan', 'Revenue assumptions',
  'Expense assumptions', 'Capital-expenditure plan', 'Working-capital requirements',
  'Break-even analysis', 'Best, base and worst-case scenarios',
]

export const FUNDING_REQUEST_FIELDS = [
  'Exact amount requested', 'Minimum viable amount', 'Maximum useful amount', 'Use of funds',
  'Spending timeline', 'Expected milestones', 'Jobs created', 'Jobs retained', 'Revenue impact',
  'Community impact', 'Matching funds available', 'Owner contribution', 'Collateral',
  'Repayment source', 'Equity offered, if applicable',
]

export const OWNER_FINANCIAL_RESTRICTED_FIELDS = [
  'SBA Form 413 data', 'Personal assets', 'Personal liabilities', 'Ownership interests',
  'Contingent liabilities', 'Personal tax returns', 'Credit authorization',
]

// ---------------------------------------------------------------------------
// Section 8 — Grant-readiness information
// ---------------------------------------------------------------------------

export const GRANT_ELIGIBILITY_FIELDS = [
  'Applicant type', 'For-profit/nonprofit status', 'Organization age', 'Location',
  'Industry', 'Project location', 'Beneficiary population', 'Minority, veteran or women ownership',
  'Existing registrations', 'Matching-fund availability', 'Fiscal sponsor, if applicable',
  'Previous federal awards', 'Debarment or exclusion status', 'Audit status',
  'Lobbying activity', 'Conflict-of-interest disclosures',
]

export const GRANT_PROJECT_DESIGN_FIELDS = [
  'Project title', 'Executive summary', 'Statement of need', 'Target population',
  'Geographic service area', 'Project goals', 'Measurable objectives', 'Activities',
  'Timeline', 'Staffing', 'Partners', 'Evaluation plan', 'Sustainability plan',
  'Risk-management plan', 'Community involvement', 'Equity and accessibility plan',
  'Environmental considerations', 'Data-collection plan',
]

export const GRANT_BUDGET_FIELDS = [
  'Personnel', 'Fringe benefits', 'Travel', 'Equipment', 'Supplies', 'Contractual costs',
  'Construction', 'Other direct costs', 'Indirect costs', 'Indirect-cost rate', 'Matching funds',
  'In-kind contributions', 'Budget narrative', 'Cost assumptions',
]

export const GRANT_DOCUMENT_CHECKLIST = [
  'Determination letter for nonprofits', 'Articles and bylaws', 'Board roster',
  'Board authorization', 'Current operating budget', 'Audit or financial review',
  'Negotiated indirect-cost agreement', 'Letters of support', 'Memoranda of understanding',
  'Resumes and bios', 'Logic model', 'Evaluation framework', 'Organizational chart',
  'Disclosure forms',
]

// ---------------------------------------------------------------------------
// Section 9 — Government-contract readiness
// ---------------------------------------------------------------------------

export const CONTRACT_ADMIN_DOCUMENT_CHECKLIST = [
  'Active SAM registration', 'UEI', 'CAGE code', 'IRS information matching SAM',
  'Banking/EFT information', 'W-9', 'State vendor registration',
  'Procurement portal registrations', 'Certifications', 'Organizational chart', 'Resumes',
  'Licenses', 'Insurance certificates', 'Bonding letter', 'Safety record',
  'Quality-control plan', 'Cybersecurity documentation', 'Subcontractor list',
  'Teaming agreements', 'Joint-venture agreements', 'Mentor-protégé documentation',
]

export const PROPOSAL_CONTENT_LIBRARY_MODULES = [
  'Executive summary', 'Technical approach', 'Management approach', 'Staffing plan',
  'Transition plan', 'Quality-control plan', 'Risk-management plan', 'Communications plan',
  'Cybersecurity plan', 'Supply-chain plan', 'Small-business participation plan',
  'Sustainability plan', 'Past performance', 'Corporate experience', 'Key personnel',
  'Price narrative', 'Assumptions and exceptions',
]

export const BID_NO_BID_QUESTIONS = [
  'Is the company eligible?',
  'Is SAM active through expected award date?',
  'Can every mandatory requirement be satisfied?',
  'Is relevant past performance available?',
  'Is required licensing active?',
  'Can the company finance performance?',
  'Can it obtain required bonds?',
  'Is the deadline realistic?',
  'Is the incumbent vulnerable?',
  'Is the buyer\u2019s budget known?',
  'Is the company competitive on price?',
  'Is there a viable teaming partner?',
  'Does the expected profit justify pursuit cost?',
]

// ---------------------------------------------------------------------------
// Section 10 — VC and angel-investment readiness
// ---------------------------------------------------------------------------

export const INVESTOR_COMPANY_INFO_FIELDS = [
  'Incorporation documents', 'EIN', 'Delaware registration, if applicable',
  'Foreign qualifications', 'Cap table', 'Founder ownership', 'Option pool', 'SAFE notes',
  'Convertible notes', 'Warrants', 'Previous fundraising', 'Valuation history',
  'Investor rights', 'Board composition', 'Material contracts', 'Pending litigation',
  'Intellectual property ownership',
]

export const INVESTOR_NARRATIVE_FIELDS = [
  'One-sentence description', 'Problem', 'Solution', 'Product demonstration', 'Market size',
  'Business model', 'Traction', 'Competitive advantage', 'Go-to-market strategy', 'Team',
  'Financials', 'Fundraising amount', 'Use of funds', 'Milestones unlocked',
  'Long-term vision', 'Potential exit paths',
]

export const INVESTOR_DOCUMENT_CHECKLIST = [
  'Pitch deck', 'One-page teaser', 'Executive summary', 'Financial model', 'Cap table',
  'Product roadmap', 'Customer pipeline', 'Cohort analysis', 'Data-room index',
  'Founder resumes', 'IP assignments', 'Employment agreements', 'Customer agreements',
  'Privacy and security documents',
]

// ---------------------------------------------------------------------------
// Section 11 — Sponsorship readiness
// ---------------------------------------------------------------------------

export const SPONSORSHIP_PROFILE_FIELDS = [
  'Event, program or platform being sponsored', 'Mission', 'Target audience', 'Audience size',
  'Demographics', 'Geography', 'Industries', 'Job titles', 'Income or purchasing authority',
  'Email-list size', 'Social following', 'Website traffic', 'Video views', 'Engagement rate',
  'Event attendance', 'Media reach', 'Press coverage', 'Community impact', 'Previous sponsors',
  'Sponsor testimonials',
]

export const SPONSOR_INVENTORY_ITEMS = [
  'Naming rights', 'Presenting sponsor', 'Stage branding', 'Digital advertising',
  'Email inclusion', 'Social-media content', 'Speaking opportunity', 'Product demonstration',
  'Lead-capture rights', 'VIP access', 'Booth space', 'Scholarship naming',
  'Content series sponsorship', 'Newsletter sponsorship', 'Category exclusivity',
  'Employee engagement', 'Community-impact reporting',
]

export const SPONSORSHIP_PACKAGE_FIELDS = [
  'Price', 'Number available', 'Deliverables', 'Estimated impressions', 'Audience reached',
  'Activation period', 'Exclusivity', 'Reporting package', 'Lead-sharing rules',
  'Cancellation terms', 'Fulfillment owner',
]

// ---------------------------------------------------------------------------
// Section 12 — Loans and financing
// ---------------------------------------------------------------------------

export const LOAN_READINESS_DOCUMENT_CHECKLIST = [
  'Business plan', 'Loan amount', 'Use of funds', 'Repayment source', 'Historical financials',
  'Tax returns', 'Debt schedule', 'Bank statements', 'Accounts-receivable aging',
  'Accounts-payable aging', 'Personal financial statement', 'Collateral schedule',
  'Equipment quotes', 'Purchase agreements', 'Lease documents', 'Franchise documents',
  'Management resumes', 'Ownership information',
]

// ---------------------------------------------------------------------------
// Section 13 — Legal, compliance and risk information
// ---------------------------------------------------------------------------

export const CORPORATE_DOCUMENT_CHECKLIST = [
  'Articles of formation/incorporation', 'Operating agreement or bylaws',
  'Good-standing certificate', 'Ownership ledger', 'Board resolutions', 'Meeting minutes',
  'DBAs', 'Foreign registrations',
]

export const CONTRACT_DOCUMENT_CHECKLIST = [
  'Customer agreements', 'Vendor agreements', 'Subcontract agreements', 'Teaming agreements',
  'NDAs', 'Leases', 'Loan agreements', 'Sponsorship agreements', 'Licensing agreements',
]

export const INSURANCE_CHECKLIST = [
  'General liability', 'Professional liability', 'Cyber liability', "Workers' compensation",
  'Commercial auto', 'Umbrella', 'Directors and officers', 'Errors and omissions',
]

export const COMPLIANCE_POLICY_CHECKLIST = [
  'Privacy policy', 'Terms of service', 'Accessibility policy', 'Information-security policy',
  'Incident-response plan', 'Records-retention policy', 'Conflict-of-interest policy',
  'Whistleblower policy', 'Code of ethics', 'Equal-employment policy',
  'Drug-free workplace policy', 'Debarment certification', 'Lobbying disclosures',
  'Foreign ownership/control disclosures', 'Export-control exposure',
  'Environmental compliance', 'OSHA/safety records', 'Pending claims or litigation',
]

// ---------------------------------------------------------------------------
// Section 14 — The master business data room (24 folders)
// ---------------------------------------------------------------------------

export type DataRoomFolderDef = {
  code: string
  label: string
  description: string
}

export const DATA_ROOM_FOLDERS: DataRoomFolderDef[] = [
  { code: '01-Corporate', label: 'Corporate', description: 'Formation documents, bylaws/operating agreement, good-standing certificate, board resolutions.' },
  { code: '02-Ownership', label: 'Ownership', description: 'Ownership ledger, cap table, demographic/certification-support evidence (encrypted where sensitive).' },
  { code: '03-Registrations', label: 'Registrations', description: 'SAM, UEI, CAGE, SCEIS, SC vendor number, Grants.gov organization profile.' },
  { code: '04-Certifications', label: 'Certifications', description: '8(a), HUBZone, WOSB/EDWOSB, SDVOSB/VOSB, SC MBE, SCDOT DBE/SBE, and supporting evidence.' },
  { code: '05-Licenses', label: 'Licenses', description: 'Business, contractor, residential builder, and professional licenses.' },
  { code: '06-Insurance', label: 'Insurance', description: 'General liability, professional liability, cyber, workers\u2019 comp, auto, umbrella, D&O, E&O certificates.' },
  { code: '07-Financials', label: 'Financials', description: 'P&L, balance sheet, cash flow, AR/AP aging, debt schedule, bank statements.' },
  { code: '08-Tax-Returns', label: 'Tax Returns', description: 'Up to three years of business tax returns.' },
  { code: '09-Past-Performance', label: 'Past Performance', description: 'Contracts, POs, CPARS, award letters, references, case studies.' },
  { code: '10-Capabilities', label: 'Capabilities', description: 'NAICS/PSC/FSC/NIGP/UNSPSC codes, contracting capability, bonding, equipment, facilities.' },
  { code: '11-Products-and-Services', label: 'Products & Services', description: 'Offering descriptions, pricing, delivery methods, differentiators.' },
  { code: '12-Team-and-Resumes', label: 'Team & Resumes', description: 'Key personnel resumes, organizational chart, professional history.' },
  { code: '13-Customers-and-Traction', label: 'Customers & Traction', description: 'Customer list, testimonials, retention/growth metrics, letters of intent.' },
  { code: '14-Contracts', label: 'Contracts', description: 'Customer, vendor, subcontract, teaming, NDA, lease, and loan agreements.' },
  { code: '15-Intellectual-Property', label: 'Intellectual Property', description: 'Patents, trademarks, IP assignments, proprietary process documentation.' },
  { code: '16-Grant-Library', label: 'Grant Library', description: 'Eligibility evidence, project design, budgets, logic models, letters of support.' },
  { code: '17-Proposal-Library', label: 'Proposal Library', description: 'Reusable, evidence-backed proposal modules for government contracting.' },
  { code: '18-Investor-Data-Room', label: 'Investor Data Room', description: 'Pitch deck, financial model, cap table, cohort analysis, data-room index.' },
  { code: '19-Sponsorship', label: 'Sponsorship', description: 'Sponsorship profile, inventory, tiered packages, fulfillment tracker.' },
  { code: '20-Policies-and-Compliance', label: 'Policies & Compliance', description: 'Privacy, security, ethics, EEO, debarment, lobbying, export-control disclosures.' },
  { code: '21-Awards-and-References', label: 'Awards & References', description: 'Award letters, reference contacts, CPARS ratings, testimonials.' },
  { code: '22-Opportunity-Research', label: 'Opportunity Research', description: 'Saved opportunity records, incumbent research, agency budget notes.' },
  { code: '23-Submitted-Applications', label: 'Submitted Applications', description: 'Copies of every submitted application, confirmation receipts, and correspondence.' },
  { code: '24-Post-Award-Reporting', label: 'Post-Award Reporting', description: 'Performance reports, invoices, compliance reporting, close-out documentation.' },
]

export const DOCUMENT_METADATA_FIELDS = [
  'Owner', 'Version', 'Effective date', 'Expiration date', 'Confidentiality level',
  'Verified status', 'Supporting evidence', 'Allowed use', 'Last reviewed date',
]

// ---------------------------------------------------------------------------
// Section 15 — AI opportunity-scoring engine
// ---------------------------------------------------------------------------

export const HARD_DISQUALIFIERS = [
  'Applicant type is ineligible',
  'Business location is ineligible',
  'Required certification is absent',
  'SAM registration will not be active',
  'Deadline is impossible',
  'Match funding is unavailable',
  'Required license is absent',
  'Conflict-of-interest rule cannot be satisfied',
  'Required experience cannot be proven',
  'Submission would require a false certification',
]

export type FitScoreFactor = { factor: string; weight: number; key: string }

export const FIT_SCORE_FACTORS: FitScoreFactor[] = [
  { factor: 'Eligibility', weight: 20, key: 'eligibility' },
  { factor: 'Capability alignment', weight: 15, key: 'capabilityAlignment' },
  { factor: 'Past performance', weight: 15, key: 'pastPerformance' },
  { factor: 'Customer/agency alignment', weight: 10, key: 'customerAgencyAlignment' },
  { factor: 'Geographic alignment', weight: 10, key: 'geographicAlignment' },
  { factor: 'Financial capacity', weight: 10, key: 'financialCapacity' },
  { factor: 'Competitive positioning', weight: 10, key: 'competitivePositioning' },
  { factor: 'Deadline readiness', weight: 5, key: 'deadlineReadiness' },
  { factor: 'Strategic value', weight: 5, key: 'strategicValue' },
]

export const FIT_SCORE_TOTAL = FIT_SCORE_FACTORS.reduce((sum, f) => sum + f.weight, 0)

export const DECISION_BANDS = [
  { range: '90\u2013100', label: 'Priority pursuit', tone: 'priority-pursuit' },
  { range: '80\u201389', label: 'Strong pursuit', tone: 'strong-pursuit' },
  { range: '70\u201379', label: 'Pursue with partner or gap plan', tone: 'pursue-with-partner' },
  { range: '60\u201369', label: 'Monitor', tone: 'monitor' },
  { range: 'Below 60', label: 'No-bid', tone: 'no-bid' },
  { range: 'Any hard disqualifier', label: 'Reject regardless of score', tone: 'reject' },
]

export const OPPORTUNITY_TYPES = [
  { key: 'government-contract', label: 'Government contracts' },
  { key: 'grant', label: 'Grants' },
  { key: 'sbir-sttr', label: 'SBIR/STTR' },
  { key: 'vc-angel', label: 'VC and angel investment' },
  { key: 'loan', label: 'Loans' },
  { key: 'sponsorship', label: 'Sponsorships' },
  { key: 'accelerator', label: 'Accelerators' },
  { key: 'corporate-supplier', label: 'Corporate supplier programs' },
] as const

// ---------------------------------------------------------------------------
// Section 16 — End-to-end AI workflow
// ---------------------------------------------------------------------------

export const WORKFLOW_STEPS = [
  'Business intake',
  'Document extraction',
  'Fact verification',
  'Capability and eligibility profile',
  'Daily opportunity search',
  'Deduplication',
  'Hard eligibility gate',
  'Fit scoring',
  'Bid/no-bid recommendation',
  'Application compliance matrix',
  'Draft narrative and forms',
  'Evidence validation',
  'Budget and pricing review',
  'Authorized human approval',
  'Submission',
  'Confirmation capture',
  'Follow-up and amendments',
  'Award or loss analysis',
  'Business-memory update',
]

export type ApprovalGateDef = { key: string; label: string }

export const REQUIRED_APPROVAL_GATES: ApprovalGateDef[] = [
  { key: 'banking-details', label: 'Banking details' },
  { key: 'tax-identifiers', label: 'Tax identifiers' },
  { key: 'ownership-certifications', label: 'Ownership certifications' },
  { key: 'demographic-certifications', label: 'Demographic certifications' },
  { key: 'lobbying-disclosures', label: 'Lobbying disclosures' },
  { key: 'debarment-certifications', label: 'Debarment certifications' },
  { key: 'grant-assurances', label: 'Grant assurances' },
  { key: 'final-pricing', label: 'Final pricing' },
  { key: 'equity-terms', label: 'Equity terms' },
  { key: 'loan-guarantees', label: 'Loan guarantees' },
  { key: 'legal-representations', label: 'Legal representations' },
  { key: 'application-submission', label: 'Application submission' },
]

// ---------------------------------------------------------------------------
// Section 17 — What the AI should generate
// ---------------------------------------------------------------------------

export const AI_DELIVERABLES: Record<string, string[]> = {
  Contracting: [
    'Government capability statement', 'Corporate capabilities deck', 'SAM description',
    'Small-business profile copy', 'Sources-sought responses', 'RFIs', 'RFQs',
    'RFP compliance matrices', 'Technical proposals', 'Management proposals',
    'Past-performance volumes', 'Staffing plans', 'Price narratives', 'Teaming-partner outreach',
  ],
  Grants: [
    'Grant-readiness assessment', 'Statement of need', 'Project narrative', 'Logic model',
    'Goals and objectives', 'Implementation timeline', 'Evaluation plan', 'Sustainability plan',
    'Budget narrative', 'Letters-of-support templates',
  ],
  Investors: [
    'Pitch deck', 'Investor memo', 'One-page teaser', 'Financial model', 'Data-room index',
    'Target-investor list', 'Personalized outreach', 'Due-diligence responses',
  ],
  Sponsors: [
    'Sponsorship deck', 'Tier packages', 'Activation concepts', 'Prospect list',
    'Outreach sequences', 'Fulfillment tracker', 'Impact report',
  ],
  Financing: [
    'Lender-ready business plan', 'Use-of-funds statement', 'Loan package index',
    'Financial projections', 'Debt-service analysis', 'Missing-document report',
  ],
}

// ---------------------------------------------------------------------------
// Section 18 — South Carolina-specific profile
// ---------------------------------------------------------------------------

export const SC_SPECIFIC_PROFILE_FIELDS = [
  'County', 'Municipality', 'Congressional district', 'Rural or urban designation',
  'HUBZone status', 'SC Secretary of State status', 'SC Department of Revenue accounts',
  'Local business license', 'SC vendor number', 'SCEIS registration', 'SC MBE status',
  'SCDOT DBE/SBE status', 'SCDOT prequalification', 'SC contractor license',
  'Residential builder license', "Workers' compensation status", 'Local chamber memberships',
  'Economic-development contacts', 'County and municipal vendor registrations',
  'Target South Carolina agencies', 'Target federal installations',
]

// ---------------------------------------------------------------------------
// Section 19 — Copy-and-complete starter intake
// ---------------------------------------------------------------------------

export const STARTER_INTAKE_TEMPLATE = `LEGAL BUSINESS NAME:
DBA/BRAND:
WEBSITE:
ENTITY TYPE:
STATE OF FORMATION:
FORMATION DATE:
BUSINESS ADDRESS:
COUNTY:
PHONE:
BUSINESS EMAIL:
FOR-PROFIT OR NONPROFIT:

OWNER NAME:
OWNER ROLE:
OWNERSHIP PERCENTAGE:
AUTHORIZED SIGNER:

UEI:
CAGE CODE:
SAM STATUS/EXPIRATION:
SC VENDOR NUMBER:
GRANTS.GOV STATUS:
CERTIFICATIONS:
LICENSES:

PRIMARY NAICS:
SECONDARY NAICS:
PRODUCTS/SERVICES:
TARGET CUSTOMERS:
SERVICE AREA:
MAXIMUM CONTRACT CAPACITY:
NUMBER OF EMPLOYEES:
NUMBER OF CONTRACTORS:

2023 REVENUE:
2024 REVENUE:
2025 REVENUE:
2026 YTD REVENUE:
MONTHLY RECURRING REVENUE:
CURRENT CASH:
CURRENT DEBT:

TOP THREE COMPLETED PROJECTS:
1.
2.
3.

CURRENT CUSTOMERS:
CUSTOMER RESULTS:
LETTERS OF REFERENCE AVAILABLE:

FUNDING NEEDED:
MINIMUM AMOUNT:
IDEAL AMOUNT:
USE OF FUNDS:
JOBS CREATED:
PROJECT TIMELINE:

LOOKING FOR:
[ ] Federal contracts
[ ] South Carolina contracts
[ ] County/city contracts
[ ] Grants
[ ] SBIR/STTR
[ ] Loans
[ ] Investors
[ ] Accelerators
[ ] Sponsors
[ ] Prime contractor partners
[ ] Corporate supplier programs

DEADLINES ALREADY KNOWN:
CURRENT APPLICATIONS:
BIGGEST BUSINESS GOAL:
BIGGEST READINESS GAP:`

export const INTAKE_EXCLUSIONS = [
  'Passwords', 'Bank account numbers', 'Full Social Security Numbers', 'MFA codes',
]

// ---------------------------------------------------------------------------
// Section 20 — Immediate launch requirements
// ---------------------------------------------------------------------------

export const LAUNCH_REQUIREMENTS = [
  'Exact business name',
  'Website',
  'Business description',
  'Location and service area',
  'Ownership profile',
  'NAICS codes, if known',
  'Certifications',
  'Registration status \u2014 SAM, SC vendor, Grants.gov',
  'Revenue range',
  'Three strongest completed projects',
  'Funding amount and use',
  'Which lanes matter first: contracts, grants, VC, sponsors or loans',
]

// ---------------------------------------------------------------------------
// Command center module directory (for the overview page + nav)
// ---------------------------------------------------------------------------

export type CommandCenterModule = {
  href: string
  title: string
  description: string
}

export const COMMAND_CENTER_MODULES: CommandCenterModule[] = [
  { href: '/command-center/intake', title: 'Business Data Room Intake', description: 'The master profile: identity, identifiers, ownership, capabilities, financial snapshot, and SC fields.' },
  { href: '/command-center/capabilities', title: 'Business Capabilities', description: 'Core offering fields, government classification codes, and contracting capability metrics.' },
  { href: '/command-center/positioning', title: 'Problem, Solution & Positioning', description: 'Problem/solution statements and competitive analysis for five or more competitors.' },
  { href: '/command-center/market-evidence', title: 'Customer & Market Evidence', description: 'Target customers, TAM/SAM/SOM, traction metrics, and proof of demand.' },
  { href: '/command-center/past-performance', title: 'Past Performance', description: 'Engagement records and acceptable evidence types for contracts, grants, and commercial work.' },
  { href: '/command-center/financials', title: 'Financial Information', description: 'Historical financials, forecasts, funding request, and the restricted owner-financial vault.' },
  { href: '/command-center/grants', title: 'Grant Readiness', description: 'Eligibility, project design, grant budget, and required grant documents.' },
  { href: '/command-center/contracting', title: 'Government Contract Readiness', description: 'Administrative documents, proposal content library, and the 13-question bid/no-bid gate.' },
  { href: '/command-center/investors', title: 'VC & Angel Investment Readiness', description: 'Cap table, investor narrative, investor documents \u2014 with securities-law guardrails.' },
  { href: '/command-center/sponsors', title: 'Sponsorship Readiness', description: 'Sponsorship profile, inventory, and tiered packages built for measurable exposure.' },
  { href: '/command-center/financing', title: 'Loans & Financing Readiness', description: 'Lender-ready documents, SBA Form 413 guidance, and the restricted owner-financial vault.' },
  { href: '/command-center/legal-compliance', title: 'Legal, Compliance & Risk', description: 'Corporate documents, contracts, insurance, and compliance policy checklists.' },
  { href: '/command-center/data-room', title: 'Master Data Room (24 Folders)', description: 'Every document category the AI needs, with owner, version, confidentiality, and verification metadata.' },
  { href: '/command-center/scoring', title: 'AI Opportunity Scoring Engine', description: 'Hard disqualifiers, the 9-factor weighted fit score, decision bands, and a live calculator.' },
  { href: '/command-center/workflow', title: 'End-to-End AI Workflow', description: 'The 19-step pipeline from intake to business-memory update, with required human approval gates.' },
  { href: '/command-center/south-carolina', title: 'South Carolina Profile Addendum', description: 'County, congressional district, HUBZone, SC MBE, SCDOT, SCEIS, and target SC agencies.' },
  { href: '/command-center/starter-intake', title: 'Copy-and-Complete Starter Intake', description: 'A plain-text fillable template excluding passwords, SSNs, and banking credentials.' },
  { href: '/command-center/housing-recovery', title: 'Housing & Recovery Housing Intelligence (Marcus)', description: 'South Carolina affordable housing, sober living / recovery housing, HUD grants, and government housing contracts research framework.' },
]
