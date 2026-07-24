export type LeadInput = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  website?: string
  employees?: string
  annualRevenue?: string
  naics?: string
  samStatus?: string
  certifications?: string
  services?: string
  goals?: string
  // Lead source / attribution (blueprint section 4: "Lead record requirements").
  source?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrer?: string
  // Consent capture (CAN-SPAM / TCPA-aligned; blueprint section 4 + 6).
  consentEmail?: boolean
  consentSms?: boolean
}

export type ScoreFactor = {
  factor: string
  points: number
  maxPoints: number
  explanation: string
}

export type LeadRecord = Required<Pick<LeadInput, 'firstName' | 'lastName' | 'email' | 'phone' | 'company' | 'industry' | 'services' | 'goals'>> & {
  id: string
  website: string
  employees: string
  annualRevenue: string
  naics: string
  samStatus: string
  certifications: string
  readinessScore: number
  stage: string
  strengths: string[]
  risks: string[]
  scoreExplanation: ScoreFactor[]
  source: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  referrer: string
  consentEmail: boolean
  consentSms: boolean
  createdAt: string
  updatedAt: string
}

export function validateLead(input: LeadInput) {
  const required: Array<keyof LeadInput> = ['firstName', 'lastName', 'email', 'phone', 'company', 'industry', 'services', 'goals']
  const missing = required.filter((key) => !String(input[key] || '').trim())
  if (missing.length) {
    return `Missing required fields: ${missing.join(', ')}`
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email))) {
    return 'Invalid email address'
  }
  return ''
}

/**
 * Explainable lead scoring. Per the blueprint ("The AI must explain the
 * score. No unexplained black-box rejection"), every point awarded or
 * withheld is tied to a named factor with a plain-language explanation,
 * returned alongside the total so the admin CRM UI (and, if surfaced, the
 * client portal) can show exactly why a lead has the score it has.
 */
export function scoreLeadExplained(input: LeadInput): { readinessScore: number; strengths: string[]; risks: string[]; stage: string; factors: ScoreFactor[] } {
  const base = 25
  const factors: ScoreFactor[] = [
    { factor: 'baseline', points: base, maxPoints: base, explanation: 'Baseline score for a completed intake submission.' },
  ]
  const strengths: string[] = []
  const risks: string[] = []

  if (input.samStatus === 'active') {
    factors.push({ factor: 'sam_status', points: 20, maxPoints: 20, explanation: 'SAM.gov reported as active (self-reported, not yet independently verified).' })
    strengths.push('SAM.gov appears active according to client self-report.')
  } else if (input.samStatus === 'in-progress') {
    factors.push({ factor: 'sam_status', points: 10, maxPoints: 20, explanation: 'SAM.gov registration is in progress but not yet complete.' })
    risks.push('SAM.gov registration still needs completion and official verification.')
  } else {
    factors.push({ factor: 'sam_status', points: 0, maxPoints: 20, explanation: 'SAM.gov status is unknown, missing, expired, or not started.' })
    risks.push('SAM.gov status is unknown, missing, expired, or not started.')
  }

  if (input.naics?.trim()) {
    factors.push({ factor: 'naics_provided', points: 12, maxPoints: 12, explanation: 'Client supplied NAICS code(s) for opportunity matching.' })
    strengths.push('Client provided NAICS information for initial opportunity matching.')
  } else {
    factors.push({ factor: 'naics_provided', points: 0, maxPoints: 12, explanation: 'No NAICS codes were provided yet.' })
    risks.push('NAICS codes need selection before serious opportunity matching.')
  }

  if (input.certifications?.trim()) {
    factors.push({ factor: 'certification_interest', points: 12, maxPoints: 12, explanation: 'Client has or is interested in a socio-economic certification.' })
    strengths.push('Existing certification or certification interest can support set-aside strategy.')
  } else {
    factors.push({ factor: 'certification_interest', points: 0, maxPoints: 12, explanation: 'No certification held or of interest was noted.' })
    risks.push('Certification fit still needs review for 8(a), HUBZone, WOSB/EDWOSB, and SDVOSB/VOSB paths.')
  }

  if (input.website?.trim()) {
    factors.push({ factor: 'web_presence', points: 6, maxPoints: 6, explanation: 'Business has a website that supports a credibility review.' })
    strengths.push('Business has a web presence that can support credibility review.')
  } else {
    factors.push({ factor: 'web_presence', points: 0, maxPoints: 6, explanation: 'No website was provided.' })
  }

  if (input.goals && input.goals.length > 120) {
    factors.push({ factor: 'goal_detail', points: 10, maxPoints: 10, explanation: 'Client gave a detailed goals statement (>120 characters).' })
    strengths.push('Client gave enough detail to begin a capture roadmap.')
  } else {
    factors.push({ factor: 'goal_detail', points: 0, maxPoints: 10, explanation: 'Goals statement was short; more detail is needed before capture planning.' })
    risks.push('Goals need more detail before proposal or capture planning.')
  }

  if (input.services?.toLowerCase().includes('proposal') || input.services?.toLowerCase().includes('bid')) {
    factors.push({ factor: 'service_alignment', points: 8, maxPoints: 8, explanation: 'Requested services already reference proposal/bid support.' })
    strengths.push('Client is already oriented toward proposal/capture support.')
  } else {
    factors.push({ factor: 'service_alignment', points: 0, maxPoints: 8, explanation: 'Requested services do not yet mention proposal/bid support.' })
  }

  if (!input.annualRevenue?.trim()) {
    risks.push('Revenue and financial readiness need confirmation before contract-sizing advice.')
  }

  const rawTotal = factors.reduce((sum, factor) => sum + factor.points, 0)

  return {
    readinessScore: Math.min(rawTotal, 96),
    strengths,
    risks,
    stage: 'new-intake',
    factors,
  }
}

/** Back-compat wrapper for existing call sites that only need the summary fields. */
export function scoreLead(input: LeadInput): Pick<LeadRecord, 'readinessScore' | 'strengths' | 'risks' | 'stage'> {
  const { readinessScore, strengths, risks, stage } = scoreLeadExplained(input)
  return { readinessScore, strengths, risks, stage }
}

export function makeLead(input: LeadInput): LeadRecord {
  const explained = scoreLeadExplained(input)
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    firstName: String(input.firstName || '').trim(),
    lastName: String(input.lastName || '').trim(),
    email: String(input.email || '').trim().toLowerCase(),
    phone: String(input.phone || '').trim(),
    company: String(input.company || '').trim(),
    industry: String(input.industry || '').trim(),
    website: String(input.website || '').trim(),
    employees: String(input.employees || '').trim(),
    annualRevenue: String(input.annualRevenue || '').trim(),
    naics: String(input.naics || '').trim(),
    samStatus: String(input.samStatus || 'unknown').trim(),
    certifications: String(input.certifications || '').trim(),
    services: String(input.services || '').trim(),
    goals: String(input.goals || '').trim(),
    source: String(input.source || 'intake-form').trim() || 'intake-form',
    utmSource: String(input.utmSource || '').trim(),
    utmMedium: String(input.utmMedium || '').trim(),
    utmCampaign: String(input.utmCampaign || '').trim(),
    referrer: String(input.referrer || '').trim(),
    consentEmail: Boolean(input.consentEmail),
    consentSms: Boolean(input.consentSms),
    readinessScore: explained.readinessScore,
    strengths: explained.strengths,
    risks: explained.risks,
    stage: explained.stage,
    scoreExplanation: explained.factors,
    createdAt: now,
    updatedAt: now,
  }
}

export const seededLeads: LeadRecord[] = [
  {
    id: 'demo-1',
    firstName: 'Angela',
    lastName: 'Reed',
    email: 'angela@example.com',
    phone: '(555) 010-1240',
    company: 'Reed Facilities Group',
    industry: 'Facilities maintenance',
    website: 'https://example.com',
    employees: '18',
    annualRevenue: '$1.4M',
    naics: '561210, 561720',
    samStatus: 'active',
    certifications: 'WOSB interest',
    services: 'Proposal writing and WOSB certification',
    goals: 'Win a facilities maintenance contract with a military installation in the next 12 months.',
    source: 'intake-form',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'federal-contracting-2026',
    referrer: '',
    consentEmail: true,
    consentSms: false,
    readinessScore: 83,
    stage: 'readiness-review',
    strengths: ['Active SAM self-report', 'Relevant NAICS codes supplied', 'Clear agency target'],
    risks: ['WOSB control documentation still needs review', 'Past performance proof needs packaging'],
    scoreExplanation: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    firstName: 'Marcus',
    lastName: 'Hill',
    email: 'marcus@example.com',
    phone: '(555) 010-8821',
    company: 'Hill Cyber Defense LLC',
    industry: 'Cybersecurity',
    website: '',
    employees: '5',
    annualRevenue: '',
    naics: '541519, 541512',
    samStatus: 'in-progress',
    certifications: 'SDVOSB interest',
    services: 'SAM registration, SDVOSB, contract watchlist',
    goals: 'Build first federal pipeline for cybersecurity compliance support.',
    source: 'intake-form',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    referrer: '',
    consentEmail: true,
    consentSms: false,
    readinessScore: 68,
    stage: 'new-intake',
    strengths: ['Technical service maps to federal demand', 'NAICS codes supplied'],
    risks: ['SAM.gov not complete', 'Revenue and past performance need verification', 'Veteran ownership/control documents required'],
    scoreExplanation: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
