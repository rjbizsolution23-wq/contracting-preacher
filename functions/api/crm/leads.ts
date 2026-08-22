import { adminGateReason, ipHint, json, logAuditEvent, options } from '../../_shared/http'
import { LeadInput, makeLead, seededLeads, validateLead } from '../../_shared/scoring'
import { pushToGhl } from '../../_shared/ghl'

type Env = {
  ADMIN_ACCESS_CODE?: string
  DB?: D1Database
  GHL_PIT?: string
  GHL_LOCATION_ID?: string
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = adminGateReason(request, env.ADMIN_ACCESS_CODE)
  if (!gate.allowed) {
    await logAuditEvent(env, {
      action: 'crm.leads.list',
      resourceType: 'leads',
      result: 'denied',
      detail: gate.reason,
      ipHint: ipHint(request),
    })
    return json({ error: 'Unauthorized admin CRM request.' }, { status: 401 })
  }

  if (!env.DB) {
    return json({
      leads: seededLeads,
      warning: 'D1 binding DB is not configured. Returning seeded demo leads.',
    })
  }

  const rows = await env.DB.prepare(
    `SELECT id, first_name, last_name, email, phone, company, industry, website, employees,
      annual_revenue, naics, sam_status, certifications, services, goals, readiness_score,
      stage, strengths, risks, source, utm_source, utm_medium, utm_campaign, referrer,
      consent_email, consent_sms, score_explanation, created_at, updated_at
     FROM leads
     ORDER BY created_at DESC
     LIMIT 100`
  ).all()

  await logAuditEvent(env, {
    action: 'crm.leads.list',
    resourceType: 'leads',
    result: 'success',
    detail: `returned ${(rows.results || []).length} rows`,
    ipHint: ipHint(request),
  })

  return json({
    leads: (rows.results || []).map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      industry: row.industry,
      website: row.website,
      employees: row.employees,
      annualRevenue: row.annual_revenue,
      naics: row.naics,
      samStatus: row.sam_status,
      certifications: row.certifications,
      services: row.services,
      goals: row.goals,
      readinessScore: row.readiness_score,
      stage: row.stage,
      strengths: JSON.parse(String(row.strengths || '[]')),
      risks: JSON.parse(String(row.risks || '[]')),
      source: row.source,
      utmSource: row.utm_source,
      utmMedium: row.utm_medium,
      utmCampaign: row.utm_campaign,
      referrer: row.referrer,
      consentEmail: Boolean(row.consent_email),
      consentSms: Boolean(row.consent_sms),
      scoreExplanation: JSON.parse(String(row.score_explanation || '[]')),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
  })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const input: LeadInput = await request.json().catch(() => ({}))
  const error = validateLead(input)
  if (error) return json({ error }, { status: 400 })

  const lead = makeLead(input)

  if (env.DB) {
    await env.DB.prepare(
      `INSERT INTO leads (
        id, first_name, last_name, email, phone, company, industry, website, employees,
        annual_revenue, naics, sam_status, certifications, services, goals, readiness_score,
        stage, strengths, risks, source, utm_source, utm_medium, utm_campaign, referrer,
        consent_email, consent_sms, score_explanation, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        lead.id,
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.phone,
        lead.company,
        lead.industry,
        lead.website,
        lead.employees,
        lead.annualRevenue,
        lead.naics,
        lead.samStatus,
        lead.certifications,
        lead.services,
        lead.goals,
        lead.readinessScore,
        lead.stage,
        JSON.stringify(lead.strengths),
        JSON.stringify(lead.risks),
        lead.source,
        lead.utmSource,
        lead.utmMedium,
        lead.utmCampaign,
        lead.referrer,
        lead.consentEmail ? 1 : 0,
        lead.consentSms ? 1 : 0,
        JSON.stringify(lead.scoreExplanation),
        lead.createdAt,
        lead.updatedAt
      )
      .run()

    await logAuditEvent(env, {
      actor: lead.email,
      action: 'crm.leads.create',
      resourceType: 'lead',
      resourceId: lead.id,
      result: 'success',
      detail: `source=${lead.source} readinessScore=${lead.readinessScore}`,
      ipHint: ipHint(request),
    })
  }

  // Push to GoHighLevel CRM (best-effort; never blocks the response).
  const tags = ['master-intake']
  if (lead.samStatus === 'active') tags.push('sam-active')
  else if (lead.samStatus === 'not-started' || lead.samStatus === 'unknown') tags.push('sam-not-started')
  if (lead.certifications?.trim()) tags.push('certification-interested')
  if (lead.consentEmail) tags.push('consent-email-yes')
  if (lead.consentSms) tags.push('consent-sms-yes')
  else tags.push('consent-sms-no')
  if (lead.readinessScore >= 60) tags.push('readiness-high')
  else tags.push('readiness-low')

  await pushToGhl(env, {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    companyName: lead.company,
    website: lead.website,
    tags,
    customFields: {
      company: lead.company,
      industry: lead.industry,
      employees: lead.employees,
      annual_revenue: lead.annualRevenue,
      naics_codes: lead.naics,
      samgov_status: lead.samStatus,
      certifications: lead.certifications,
      services_needed: lead.services,
      goals__deadlines__contract_targets: lead.goals,
      readiness_score: lead.readinessScore,
      pipeline_stage: lead.stage,
      strengths: lead.strengths.join('; '),
      risk_flags: lead.risks.join('; '),
      score_explanation: JSON.stringify(lead.scoreExplanation),
      lead_source: lead.source || 'intake-form',
      utm_source: lead.utmSource || '',
      utm_medium: lead.utmMedium || '',
      utm_campaign: lead.utmCampaign || '',
      referrer_url: lead.referrer || '',
      consent__email_updates: lead.consentEmail ? ['Yes'] : [],
      consent__smstext_messages: lead.consentSms ? ['Yes'] : [],
    },
  })

  return json({
    success: true,
    lead,
    warning: env.DB ? undefined : 'D1 binding DB is not configured. Intake was scored but not persisted.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()
