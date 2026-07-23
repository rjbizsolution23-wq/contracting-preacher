import { json, options, requireAdmin } from '../../_shared/http'
import { BusinessProfileInput, makeBusinessProfile, validateBusinessProfile } from '../../_shared/dataRoom'

type Env = {
  ADMIN_ACCESS_CODE?: string
  DB?: D1Database
}

const COLUMNS = [
  'id', 'legal_name', 'dba_name', 'entity_type', 'state_of_formation', 'formation_date',
  'principal_address', 'mailing_address', 'phone', 'email', 'website', 'service_area',
  'profit_status', 'fiscal_year_end', 'operating_status', 'ein_on_file', 'uei', 'cage_code',
  'sam_status', 'sam_expiration', 'sc_vendor_number', 'sceis_status', 'grants_gov_status',
  'grants_gov_aor', 'sbir_registry_id', 'primary_naics', 'secondary_naics', 'psc_fsc_codes',
  'core_offering', 'differentiators', 'employees', 'contractors', 'can_prime', 'can_sub',
  'bonding_capacity', 'max_contract_capacity', 'certifications', 'licenses', 'revenue_2023',
  'revenue_2024', 'revenue_2025', 'revenue_ytd', 'monthly_recurring_revenue', 'current_cash',
  'current_debt', 'funding_amount_requested', 'funding_minimum', 'use_of_funds', 'jobs_created',
  'project_timeline', 'lanes_of_interest', 'top_projects', 'biggest_goal', 'biggest_gap',
  'sc_county', 'sc_municipality', 'sc_congressional_district', 'sc_rural_urban',
  'sc_hubzone_status', 'sc_sos_status', 'sc_mbe_status', 'sc_scdot_status',
  'target_sc_agencies', 'target_federal_installations', 'extended_json', 'readiness_notes',
  'created_at', 'updated_at',
]

function rowFromRecord(record: ReturnType<typeof makeBusinessProfile>) {
  return [
    record.id, record.legalName, record.dbaName, record.entityType, record.stateOfFormation,
    record.formationDate, record.principalAddress, record.mailingAddress, record.phone,
    record.email, record.website, record.serviceArea, record.profitStatus, record.fiscalYearEnd,
    record.operatingStatus, record.einOnFile ? 1 : 0, record.uei, record.cageCode,
    record.samStatus, record.samExpiration, record.scVendorNumber, record.sceisStatus,
    record.grantsGovStatus, record.grantsGovAor, record.sbirRegistryId, record.primaryNaics,
    record.secondaryNaics, record.pscFscCodes, record.coreOffering, record.differentiators,
    record.employees, record.contractors, record.canPrime ? 1 : 0, record.canSub ? 1 : 0,
    record.bondingCapacity, record.maxContractCapacity, record.certifications, record.licenses,
    record.revenue2023, record.revenue2024, record.revenue2025, record.revenueYtd,
    record.monthlyRecurringRevenue, record.currentCash, record.currentDebt,
    record.fundingAmountRequested, record.fundingMinimum, record.useOfFunds, record.jobsCreated,
    record.projectTimeline, record.lanesOfInterest, record.topProjects, record.biggestGoal,
    record.biggestGap, record.scCounty, record.scMunicipality, record.scCongressionalDistrict,
    record.scRuralUrban, record.scHubzoneStatus, record.scSosStatus, record.scMbeStatus,
    record.scScdotStatus, record.targetScAgencies, record.targetFederalInstallations,
    JSON.stringify(record.extended || {}), record.readinessNotes, record.createdAt, record.updatedAt,
  ]
}

function rowToProfile(row: Record<string, unknown>) {
  return {
    id: row.id,
    legalName: row.legal_name,
    dbaName: row.dba_name,
    entityType: row.entity_type,
    stateOfFormation: row.state_of_formation,
    formationDate: row.formation_date,
    principalAddress: row.principal_address,
    mailingAddress: row.mailing_address,
    phone: row.phone,
    email: row.email,
    website: row.website,
    serviceArea: row.service_area,
    profitStatus: row.profit_status,
    fiscalYearEnd: row.fiscal_year_end,
    operatingStatus: row.operating_status,
    einOnFile: Boolean(row.ein_on_file),
    uei: row.uei,
    cageCode: row.cage_code,
    samStatus: row.sam_status,
    samExpiration: row.sam_expiration,
    scVendorNumber: row.sc_vendor_number,
    sceisStatus: row.sceis_status,
    grantsGovStatus: row.grants_gov_status,
    grantsGovAor: row.grants_gov_aor,
    sbirRegistryId: row.sbir_registry_id,
    primaryNaics: row.primary_naics,
    secondaryNaics: row.secondary_naics,
    pscFscCodes: row.psc_fsc_codes,
    coreOffering: row.core_offering,
    differentiators: row.differentiators,
    employees: row.employees,
    contractors: row.contractors,
    canPrime: Boolean(row.can_prime),
    canSub: Boolean(row.can_sub),
    bondingCapacity: row.bonding_capacity,
    maxContractCapacity: row.max_contract_capacity,
    certifications: row.certifications,
    licenses: row.licenses,
    revenue2023: row.revenue_2023,
    revenue2024: row.revenue_2024,
    revenue2025: row.revenue_2025,
    revenueYtd: row.revenue_ytd,
    monthlyRecurringRevenue: row.monthly_recurring_revenue,
    currentCash: row.current_cash,
    currentDebt: row.current_debt,
    fundingAmountRequested: row.funding_amount_requested,
    fundingMinimum: row.funding_minimum,
    useOfFunds: row.use_of_funds,
    jobsCreated: row.jobs_created,
    projectTimeline: row.project_timeline,
    lanesOfInterest: row.lanes_of_interest,
    topProjects: row.top_projects,
    biggestGoal: row.biggest_goal,
    biggestGap: row.biggest_gap,
    scCounty: row.sc_county,
    scMunicipality: row.sc_municipality,
    scCongressionalDistrict: row.sc_congressional_district,
    scRuralUrban: row.sc_rural_urban,
    scHubzoneStatus: row.sc_hubzone_status,
    scSosStatus: row.sc_sos_status,
    scMbeStatus: row.sc_mbe_status,
    scScdotStatus: row.sc_scdot_status,
    targetScAgencies: row.target_sc_agencies,
    targetFederalInstallations: row.target_federal_installations,
    extended: JSON.parse(String(row.extended_json || '{}')),
    readinessNotes: row.readiness_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!requireAdmin(request, env.ADMIN_ACCESS_CODE)) {
    return json({ error: 'Unauthorized business data room request.' }, { status: 401 })
  }

  if (!env.DB) {
    return json({ profiles: [], warning: 'D1 binding DB is not configured. No profiles persisted yet.' })
  }

  const rows = await env.DB.prepare(
    `SELECT * FROM business_profiles ORDER BY updated_at DESC LIMIT 100`
  ).all()

  return json({ profiles: (rows.results || []).map((row) => rowToProfile(row as Record<string, unknown>)) })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const input: BusinessProfileInput = await request.json().catch(() => ({}))
  const error = validateBusinessProfile(input)
  if (error) return json({ error }, { status: 400 })

  const record = makeBusinessProfile(input)

  if (env.DB) {
    const placeholders = COLUMNS.map(() => '?').join(', ')
    await env.DB.prepare(
      `INSERT INTO business_profiles (${COLUMNS.join(', ')}) VALUES (${placeholders})`
    ).bind(...rowFromRecord(record)).run()
  }

  return json({
    success: true,
    profile: record,
    warning: env.DB ? undefined : 'D1 binding DB is not configured. Profile was validated but not persisted.',
    reminder: 'This intake never collects passwords, bank account numbers, full SSNs, or MFA codes. Owner personal financial data belongs in an encrypted restricted vault, not this form.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()
