import { adminGateReason, ipHint, json, logAuditEvent, options } from '../../_shared/http'
import { BusinessProfileInput, makeBusinessProfile, validateBusinessProfile } from '../../_shared/dataRoom'
import { pushToGhl } from '../../_shared/ghl'

type Env = {
  ADMIN_ACCESS_CODE?: string
  DB?: D1Database
  GHL_PIT?: string
  GHL_LOCATION_ID?: string
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
  const gate = adminGateReason(request, env.ADMIN_ACCESS_CODE)
  if (!gate.allowed) {
    await logAuditEvent(env, { action: 'business.profile.list', resourceType: 'business_profile', result: 'denied', detail: gate.reason, ipHint: ipHint(request) })
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

    await logAuditEvent(env, {
      actor: record.email,
      action: 'business.profile.create',
      resourceType: 'business_profile',
      resourceId: record.id,
      result: 'success',
      detail: `legalName=${record.legalName}`,
    })
  }

  // Push to GoHighLevel CRM (best-effort; never blocks the response).
  const lanes = String(record.lanesOfInterest || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const tags = ['command-center-intake']
  if (record.samStatus === 'active') tags.push('sam-active')
  else if (record.samStatus === 'not-started' || record.samStatus === 'unknown') tags.push('sam-not-started')
  if (record.certifications && String(record.certifications).trim()) tags.push('certification-interested')
  if (String(record.stateOfFormation || '').toLowerCase().includes('south carolina')) tags.push('south-carolina')
  if (lanes.includes('Federal contracts')) tags.push('federal-contracts-lane')
  if (lanes.includes('Grants')) tags.push('grants-lane')

  await pushToGhl(env, {
    firstName: undefined,
    lastName: undefined,
    email: String(record.email || ''),
    phone: String(record.phone || ''),
    companyName: String(record.legalName || ''),
    website: String(record.website || ''),
    tags,
    customFields: {
      legal_business_name: record.legalName,
      dba__brand_name: record.dbaName,
      entity_type: record.entityType,
      state_of_formation: record.stateOfFormation,
      formation_date: record.formationDate,
      principal_business_address: record.principalAddress,
      service_area: record.serviceArea,
      profit_status: record.profitStatus,
      uei_number: record.uei,
      cage_code: record.cageCode,
      samgov_status: record.samStatus,
      sc_vendor_number: record.scVendorNumber,
      grantsgov_status: record.grantsGovStatus,
      primary_naics: record.primaryNaics,
      secondary_naics: record.secondaryNaics,
      core_offering: record.coreOffering,
      employees: record.employees,
      contractors_1099: record.contractors,
      certifications: record.certifications,
      business_licenses: record.licenses,
      revenue_2023: record.revenue2023,
      revenue_2024: record.revenue2024,
      revenue_2025: record.revenue2025,
      funding_amount_requested: record.fundingAmountRequested,
      use_of_funds: record.useOfFunds,
      lanes_of_interest: lanes,
      top_past_projects: record.topProjects,
      biggest_goal: record.biggestGoal,
      biggest_gap: record.biggestGap,
    },
  })

  return json({
    success: true,
    profile: record,
    warning: env.DB ? undefined : 'D1 binding DB is not configured. Profile was validated but not persisted.',
    reminder: 'This intake never collects passwords, bank account numbers, full SSNs, or MFA codes. Owner personal financial data belongs in an encrypted restricted vault, not this form.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()
