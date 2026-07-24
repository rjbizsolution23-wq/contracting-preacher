import { adminGateReason, ipHint, json, logAuditEvent, options } from '../../_shared/http'
import { LeadInput, makeLead, seededLeads, validateLead } from '../../_shared/scoring'

type Env = {
  ADMIN_ACCESS_CODE?: string
  DB?: D1Database
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

  return json({
    success: true,
    lead,
    warning: env.DB ? undefined : 'D1 binding DB is not configured. Intake was scored but not persisted.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()
