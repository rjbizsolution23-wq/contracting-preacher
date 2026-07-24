import { adminGateReason, ipHint, json, logAuditEvent, options } from '../../_shared/http'
import { decisionBandFor, evaluateHardDisqualifiers, OpportunityScoreInput, scoreOpportunity } from '../../_shared/dataRoom'

type Env = {
  ADMIN_ACCESS_CODE?: string
  DB?: D1Database
}

type OpportunityInput = OpportunityScoreInput & {
  profileId?: string
  title?: string
  agencyOrBuyer?: string
  deadline?: string
  sourceUrl?: string
  notes?: string
  status?: string
}

function str(value: unknown) {
  return String(value ?? '').trim()
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = adminGateReason(request, env.ADMIN_ACCESS_CODE)
  if (!gate.allowed) {
    await logAuditEvent(env, { action: 'business.opportunities.list', resourceType: 'business_opportunity', result: 'denied', detail: gate.reason, ipHint: ipHint(request) })
    return json({ error: 'Unauthorized opportunity pipeline request.' }, { status: 401 })
  }

  if (!env.DB) {
    return json({ opportunities: [], warning: 'D1 binding DB is not configured.' })
  }

  const url = new URL(request.url)
  const profileId = url.searchParams.get('profileId') || ''

  const rows = profileId
    ? await env.DB.prepare(`SELECT * FROM business_opportunities WHERE profile_id = ? ORDER BY fit_score DESC`).bind(profileId).all()
    : await env.DB.prepare(`SELECT * FROM business_opportunities ORDER BY updated_at DESC LIMIT 200`).all()

  return json({ opportunities: rows.results || [] })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const input: OpportunityInput = await request.json().catch(() => ({}))

  const profileId = str(input.profileId)
  const title = str(input.title)
  const opportunityType = str(input.opportunityType)

  if (!profileId) return json({ error: 'profileId is required.' }, { status: 400 })
  if (!title) return json({ error: 'Opportunity title is required.' }, { status: 400 })
  if (!opportunityType) return json({ error: 'opportunityType is required.' }, { status: 400 })

  const scored = scoreOpportunity(input)
  const now = new Date().toISOString()

  const record = {
    id: crypto.randomUUID(),
    profileId,
    opportunityType,
    title,
    agencyOrBuyer: str(input.agencyOrBuyer),
    deadline: str(input.deadline),
    sourceUrl: str(input.sourceUrl),
    hardDisqualifiers: scored.disqualifiers,
    fitScore: scored.totalScore,
    scoreBreakdown: scored.breakdown,
    decisionBand: scored.band,
    bidNoBid: scored.band === 'reject' || scored.band === 'no-bid' ? 'no-bid' : 'pending-review',
    status: str(input.status) || 'researching',
    notes: str(input.notes),
    createdAt: now,
    updatedAt: now,
  }

  if (env.DB) {
    await env.DB.prepare(
      `INSERT INTO business_opportunities (
        id, profile_id, opportunity_type, title, agency_or_buyer, deadline, source_url,
        hard_disqualifiers, fit_score, score_breakdown, decision_band, bid_no_bid, status,
        notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      record.id, record.profileId, record.opportunityType, record.title, record.agencyOrBuyer,
      record.deadline, record.sourceUrl, JSON.stringify(record.hardDisqualifiers), record.fitScore,
      JSON.stringify(record.scoreBreakdown), record.decisionBand, record.bidNoBid, record.status,
      record.notes, record.createdAt, record.updatedAt
    ).run()

    await logAuditEvent(env, {
      action: 'business.opportunities.create',
      resourceType: 'business_opportunity',
      resourceId: record.id,
      result: 'success',
      detail: `profileId=${record.profileId} band=${record.decisionBand} fitScore=${record.fitScore}`,
    })
  }

  return json({
    success: true,
    opportunity: record,
    warning: env.DB ? undefined : 'D1 binding DB is not configured. Opportunity was scored but not persisted.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()

// Re-export for potential reuse/testing.
export { decisionBandFor, evaluateHardDisqualifiers }
