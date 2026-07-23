// Business Funding + Contracting AI Command Center — shared server-side data model,
// hard-disqualifier checks, and the weighted opportunity fit-scoring engine.
//
// AI CAN: search, check eligibility, score fit, draft narratives, flag missing docs.
// AI MUST NOT: invent revenue/certifications/past performance, falsify ownership or
// demographic status, sign for the owner, or submit an application that requires an
// authorized representative without an explicit human/AOR approval on record.

export type BusinessProfileInput = {
  legalName?: string
  dbaName?: string
  entityType?: string
  stateOfFormation?: string
  formationDate?: string
  principalAddress?: string
  mailingAddress?: string
  phone?: string
  email?: string
  website?: string
  serviceArea?: string
  profitStatus?: string
  fiscalYearEnd?: string
  operatingStatus?: string

  ein?: string // never persisted directly; presence only recorded as 1/0
  uei?: string
  cageCode?: string
  samStatus?: string
  samExpiration?: string
  scVendorNumber?: string
  sceisStatus?: string
  grantsGovStatus?: string
  grantsGovAor?: string
  sbirRegistryId?: string

  primaryNaics?: string
  secondaryNaics?: string
  pscFscCodes?: string
  coreOffering?: string
  differentiators?: string
  employees?: string
  contractors?: string
  canPrime?: boolean
  canSub?: boolean
  bondingCapacity?: string
  maxContractCapacity?: string

  certifications?: string
  licenses?: string

  revenue2023?: string
  revenue2024?: string
  revenue2025?: string
  revenueYtd?: string
  monthlyRecurringRevenue?: string
  currentCash?: string
  currentDebt?: string

  fundingAmountRequested?: string
  fundingMinimum?: string
  useOfFunds?: string
  jobsCreated?: string
  projectTimeline?: string

  lanesOfInterest?: string
  topProjects?: string
  biggestGoal?: string
  biggestGap?: string

  scCounty?: string
  scMunicipality?: string
  scCongressionalDistrict?: string
  scRuralUrban?: string
  scHubzoneStatus?: string
  scSosStatus?: string
  scMbeStatus?: string
  scScdotStatus?: string
  targetScAgencies?: string
  targetFederalInstallations?: string

  extended?: Record<string, unknown>
  readinessNotes?: string
}

export type BusinessProfileRecord = BusinessProfileInput & {
  id: string
  einOnFile: boolean
  createdAt: string
  updatedAt: string
}

function str(value: unknown) {
  return String(value ?? '').trim()
}

export function validateBusinessProfile(input: BusinessProfileInput) {
  if (!str(input.legalName)) return 'Legal business name is required.'
  if (!str(input.email)) return 'A business contact email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(input.email))) return 'Business email is invalid.'
  return ''
}

export function makeBusinessProfile(input: BusinessProfileInput): BusinessProfileRecord {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    legalName: str(input.legalName),
    dbaName: str(input.dbaName),
    entityType: str(input.entityType),
    stateOfFormation: str(input.stateOfFormation),
    formationDate: str(input.formationDate),
    principalAddress: str(input.principalAddress),
    mailingAddress: str(input.mailingAddress),
    phone: str(input.phone),
    email: str(input.email).toLowerCase(),
    website: str(input.website),
    serviceArea: str(input.serviceArea),
    profitStatus: str(input.profitStatus) || 'for-profit',
    fiscalYearEnd: str(input.fiscalYearEnd),
    operatingStatus: str(input.operatingStatus) || 'active',
    einOnFile: Boolean(str(input.ein)),
    uei: str(input.uei),
    cageCode: str(input.cageCode),
    samStatus: str(input.samStatus) || 'unknown',
    samExpiration: str(input.samExpiration),
    scVendorNumber: str(input.scVendorNumber),
    sceisStatus: str(input.sceisStatus) || 'unknown',
    grantsGovStatus: str(input.grantsGovStatus) || 'unknown',
    grantsGovAor: str(input.grantsGovAor),
    sbirRegistryId: str(input.sbirRegistryId),
    primaryNaics: str(input.primaryNaics),
    secondaryNaics: str(input.secondaryNaics),
    pscFscCodes: str(input.pscFscCodes),
    coreOffering: str(input.coreOffering),
    differentiators: str(input.differentiators),
    employees: str(input.employees),
    contractors: str(input.contractors),
    canPrime: Boolean(input.canPrime),
    canSub: Boolean(input.canSub),
    bondingCapacity: str(input.bondingCapacity),
    maxContractCapacity: str(input.maxContractCapacity),
    certifications: str(input.certifications),
    licenses: str(input.licenses),
    revenue2023: str(input.revenue2023),
    revenue2024: str(input.revenue2024),
    revenue2025: str(input.revenue2025),
    revenueYtd: str(input.revenueYtd),
    monthlyRecurringRevenue: str(input.monthlyRecurringRevenue),
    currentCash: str(input.currentCash),
    currentDebt: str(input.currentDebt),
    fundingAmountRequested: str(input.fundingAmountRequested),
    fundingMinimum: str(input.fundingMinimum),
    useOfFunds: str(input.useOfFunds),
    jobsCreated: str(input.jobsCreated),
    projectTimeline: str(input.projectTimeline),
    lanesOfInterest: str(input.lanesOfInterest),
    topProjects: str(input.topProjects),
    biggestGoal: str(input.biggestGoal),
    biggestGap: str(input.biggestGap),
    scCounty: str(input.scCounty),
    scMunicipality: str(input.scMunicipality),
    scCongressionalDistrict: str(input.scCongressionalDistrict),
    scRuralUrban: str(input.scRuralUrban),
    scHubzoneStatus: str(input.scHubzoneStatus) || 'unknown',
    scSosStatus: str(input.scSosStatus) || 'unknown',
    scMbeStatus: str(input.scMbeStatus) || 'unknown',
    scScdotStatus: str(input.scScdotStatus) || 'unknown',
    targetScAgencies: str(input.targetScAgencies),
    targetFederalInstallations: str(input.targetFederalInstallations),
    extended: input.extended && typeof input.extended === 'object' ? input.extended : {},
    readinessNotes: str(input.readinessNotes),
    createdAt: now,
    updatedAt: now,
  }
}

// ---------------------------------------------------------------------------
// Opportunity fit-scoring engine (spec section 15)
// ---------------------------------------------------------------------------

export type OpportunityType =
  | 'government-contract'
  | 'grant'
  | 'sbir-sttr'
  | 'vc-angel'
  | 'loan'
  | 'sponsorship'
  | 'accelerator'
  | 'corporate-supplier'

export type OpportunityScoreInput = {
  opportunityType: OpportunityType
  // Eligibility inputs
  applicantTypeEligible?: boolean
  locationEligible?: boolean
  requiredCertificationHeld?: boolean
  requiredCertificationNeeded?: boolean
  samActiveThroughAward?: boolean
  deadlineFeasible?: boolean
  matchFundingAvailable?: boolean
  matchFundingRequired?: boolean
  requiredLicenseHeld?: boolean
  requiredLicenseNeeded?: boolean
  conflictOfInterestClear?: boolean
  requiredExperienceProvable?: boolean
  wouldRequireFalseCertification?: boolean
  // Weighted factors, each 0-100 (percentage of the max points available for that factor)
  capabilityAlignmentPct?: number
  pastPerformancePct?: number
  customerAgencyAlignmentPct?: number
  geographicAlignmentPct?: number
  financialCapacityPct?: number
  competitivePositioningPct?: number
  deadlineReadinessPct?: number
  strategicValuePct?: number
  eligibilityPct?: number
}

export const FIT_SCORE_WEIGHTS = {
  eligibility: 20,
  capabilityAlignment: 15,
  pastPerformance: 15,
  customerAgencyAlignment: 10,
  geographicAlignment: 10,
  financialCapacity: 10,
  competitivePositioning: 10,
  deadlineReadiness: 5,
  strategicValue: 5,
} as const

export type ScoreBreakdown = Record<keyof typeof FIT_SCORE_WEIGHTS, number>

export type DecisionBand =
  | 'priority-pursuit'
  | 'strong-pursuit'
  | 'pursue-with-partner'
  | 'monitor'
  | 'no-bid'
  | 'reject'

export function decisionBandFor(score: number, hasDisqualifier: boolean): DecisionBand {
  if (hasDisqualifier) return 'reject'
  if (score >= 90) return 'priority-pursuit'
  if (score >= 80) return 'strong-pursuit'
  if (score >= 70) return 'pursue-with-partner'
  if (score >= 60) return 'monitor'
  return 'no-bid'
}

export function evaluateHardDisqualifiers(input: OpportunityScoreInput): string[] {
  const flags: string[] = []
  if (input.applicantTypeEligible === false) flags.push('Applicant type is ineligible for this opportunity.')
  if (input.locationEligible === false) flags.push('Business location is ineligible for this opportunity.')
  if (input.requiredCertificationNeeded && input.requiredCertificationHeld === false) {
    flags.push('Required certification is absent.')
  }
  if (input.samActiveThroughAward === false) flags.push('SAM registration will not be active through expected award.')
  if (input.deadlineFeasible === false) flags.push('Deadline is impossible to meet.')
  if (input.matchFundingRequired && input.matchFundingAvailable === false) {
    flags.push('Required matching funds are unavailable.')
  }
  if (input.requiredLicenseNeeded && input.requiredLicenseHeld === false) {
    flags.push('Required license is absent.')
  }
  if (input.conflictOfInterestClear === false) flags.push('Conflict-of-interest rule cannot be satisfied.')
  if (input.requiredExperienceProvable === false) flags.push('Required experience cannot be proven with acceptable evidence.')
  if (input.wouldRequireFalseCertification) flags.push('Submission would require a false certification — automatic reject.')
  return flags
}

function pct(value: number | undefined) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

export function scoreOpportunity(input: OpportunityScoreInput): {
  disqualifiers: string[]
  breakdown: ScoreBreakdown
  totalScore: number
  band: DecisionBand
} {
  const disqualifiers = evaluateHardDisqualifiers(input)

  const breakdown: ScoreBreakdown = {
    eligibility: Math.round((pct(input.eligibilityPct) / 100) * FIT_SCORE_WEIGHTS.eligibility),
    capabilityAlignment: Math.round((pct(input.capabilityAlignmentPct) / 100) * FIT_SCORE_WEIGHTS.capabilityAlignment),
    pastPerformance: Math.round((pct(input.pastPerformancePct) / 100) * FIT_SCORE_WEIGHTS.pastPerformance),
    customerAgencyAlignment: Math.round((pct(input.customerAgencyAlignmentPct) / 100) * FIT_SCORE_WEIGHTS.customerAgencyAlignment),
    geographicAlignment: Math.round((pct(input.geographicAlignmentPct) / 100) * FIT_SCORE_WEIGHTS.geographicAlignment),
    financialCapacity: Math.round((pct(input.financialCapacityPct) / 100) * FIT_SCORE_WEIGHTS.financialCapacity),
    competitivePositioning: Math.round((pct(input.competitivePositioningPct) / 100) * FIT_SCORE_WEIGHTS.competitivePositioning),
    deadlineReadiness: Math.round((pct(input.deadlineReadinessPct) / 100) * FIT_SCORE_WEIGHTS.deadlineReadiness),
    strategicValue: Math.round((pct(input.strategicValuePct) / 100) * FIT_SCORE_WEIGHTS.strategicValue),
  }

  const totalScore = Object.values(breakdown).reduce((sum, value) => sum + value, 0)
  const band = decisionBandFor(totalScore, disqualifiers.length > 0)

  return { disqualifiers, breakdown, totalScore, band }
}

// ---------------------------------------------------------------------------
// Required human / AOR approval gates (spec section 16)
// ---------------------------------------------------------------------------

export const APPROVAL_GATES = [
  'banking-details',
  'tax-identifiers',
  'ownership-certifications',
  'demographic-certifications',
  'lobbying-disclosures',
  'debarment-certifications',
  'grant-assurances',
  'final-pricing',
  'equity-terms',
  'loan-guarantees',
  'legal-representations',
  'application-submission',
] as const

export type ApprovalGate = (typeof APPROVAL_GATES)[number]

export function isKnownGate(value: string): value is ApprovalGate {
  return (APPROVAL_GATES as readonly string[]).includes(value)
}

// The 24-folder master business data room (spec section 14)
export const DATA_ROOM_FOLDERS = [
  '01-Corporate',
  '02-Ownership',
  '03-Registrations',
  '04-Certifications',
  '05-Licenses',
  '06-Insurance',
  '07-Financials',
  '08-Tax-Returns',
  '09-Past-Performance',
  '10-Capabilities',
  '11-Products-and-Services',
  '12-Team-and-Resumes',
  '13-Customers-and-Traction',
  '14-Contracts',
  '15-Intellectual-Property',
  '16-Grant-Library',
  '17-Proposal-Library',
  '18-Investor-Data-Room',
  '19-Sponsorship',
  '20-Policies-and-Compliance',
  '21-Awards-and-References',
  '22-Opportunity-Research',
  '23-Submitted-Applications',
  '24-Post-Award-Reporting',
] as const

export type DataRoomFolder = (typeof DATA_ROOM_FOLDERS)[number]

export function isKnownFolder(value: string): value is DataRoomFolder {
  return (DATA_ROOM_FOLDERS as readonly string[]).includes(value)
}
