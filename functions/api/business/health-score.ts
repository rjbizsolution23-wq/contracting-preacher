import { adminGateReason, ipHint, json, logAuditEvent, options } from '../../_shared/http'
import { computeHealthScore } from '../../_shared/healthScore'

type Env = {
  ADMIN_ACCESS_CODE?: string
  DB?: D1Database
}

/**
 * GET /api/business/health-score?profileId=<id>
 *
 * Computes and persists a client health-score snapshot for one business
 * profile, using only data this site actually has (see healthScore.ts for
 * why this is a scoped subset of the blueprint's full 8-factor formula).
 * Admin-gated because it reads the same business_profiles/business_documents
 * data room the rest of the Command Center gates behind ADMIN_ACCESS_CODE.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = adminGateReason(request, env.ADMIN_ACCESS_CODE)
  if (!gate.allowed) {
    await logAuditEvent(env, { action: 'business.healthScore.compute', resourceType: 'client_health_score', result: 'denied', detail: gate.reason, ipHint: ipHint(request) })
    return json({ error: 'Unauthorized business data room request.' }, { status: 401 })
  }

  const url = new URL(request.url)
  const profileId = url.searchParams.get('profileId') || ''
  if (!profileId) {
    return json({ error: 'profileId is required.' }, { status: 400 })
  }

  if (!env.DB) {
    return json({ error: 'D1 binding DB is not configured. Health score cannot be computed without persisted data.' }, { status: 503 })
  }

  const profileRow = await env.DB.prepare(`SELECT * FROM business_profiles WHERE id = ?`).bind(profileId).first<Record<string, unknown>>()
  if (!profileRow) {
    return json({ error: 'No business profile found for that profileId.' }, { status: 404 })
  }

  const [documentsRes, opportunitiesRes, approvalsRes] = await Promise.all([
    env.DB.prepare(`SELECT verified_status as verifiedStatus, updated_at as updatedAt FROM business_documents WHERE profile_id = ?`).bind(profileId).all(),
    env.DB.prepare(`SELECT fit_score as fitScore, decision_band as decisionBand, updated_at as updatedAt FROM business_opportunities WHERE profile_id = ?`).bind(profileId).all(),
    env.DB.prepare(`SELECT COUNT(*) as count FROM business_approvals WHERE profile_id = ? AND decision = 'approved'`).bind(profileId).first<{ count: number }>(),
  ])

  const result = computeHealthScore({
    profile: {
      legalName: profileRow.legal_name,
      email: profileRow.email,
      phone: profileRow.phone,
      entityType: profileRow.entity_type,
      primaryNaics: profileRow.primary_naics,
      coreOffering: profileRow.core_offering,
      employees: profileRow.employees,
      lanesOfInterest: profileRow.lanes_of_interest,
      biggestGoal: profileRow.biggest_goal,
      updatedAt: profileRow.updated_at,
    },
    documents: (documentsRes.results || []) as Array<{ verifiedStatus?: string; updatedAt?: string }>,
    opportunities: (opportunitiesRes.results || []) as Array<{ fitScore?: number; decisionBand?: string; updatedAt?: string }>,
    approvalsCount: Number(approvalsRes?.count || 0),
  })

  const id = crypto.randomUUID()
  const computedAt = new Date().toISOString()
  try {
    await env.DB.prepare(
      `INSERT INTO client_health_scores (
        id, profile_id, lead_id, onboarding_score, document_score, pipeline_score,
        engagement_score, total_score, band, explanation, computed_at
      ) VALUES (?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id, profileId, result.onboardingScore, result.documentScore, result.pipelineScore,
        result.engagementScore, result.totalScore, result.band, JSON.stringify(result.explanation), computedAt
      )
      .run()
  } catch (dbError) {
    console.error('Health score persistence error (migration 0003 may not be applied yet):', dbError)
  }

  await logAuditEvent(env, {
    action: 'business.healthScore.compute',
    resourceType: 'client_health_score',
    resourceId: profileId,
    result: 'success',
    detail: `totalScore=${result.totalScore} band=${result.band}`,
  })

  return json({
    profileId,
    ...result,
    computedAt,
    disclaimer: 'This score reflects onboarding completeness, document readiness, and opportunity pipeline health only -- the four factors this site currently tracks. It does not include payment standing, appointment attendance, or support-ticket sentiment, which are not yet implemented in this codebase.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()
