import { json, options, requireAdmin } from '../../_shared/http'
import { APPROVAL_GATES, isKnownGate } from '../../_shared/dataRoom'

type Env = {
  ADMIN_ACCESS_CODE?: string
  DB?: D1Database
}

type ApprovalInput = {
  profileId?: string
  opportunityId?: string
  gate?: string
  approvedByName?: string
  approvedByRole?: string
  decision?: string
  notes?: string
}

function str(value: unknown) {
  return String(value ?? '').trim()
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!requireAdmin(request, env.ADMIN_ACCESS_CODE)) {
    return json({ error: 'Unauthorized approval-gate request.' }, { status: 401 })
  }

  if (!env.DB) {
    return json({ approvals: [], gates: APPROVAL_GATES, warning: 'D1 binding DB is not configured.' })
  }

  const url = new URL(request.url)
  const profileId = url.searchParams.get('profileId') || ''

  const rows = profileId
    ? await env.DB.prepare(`SELECT * FROM business_approvals WHERE profile_id = ? ORDER BY created_at DESC`).bind(profileId).all()
    : await env.DB.prepare(`SELECT * FROM business_approvals ORDER BY created_at DESC LIMIT 200`).all()

  return json({ approvals: rows.results || [], gates: APPROVAL_GATES })
}

// Records an owner/AOR approval decision. This endpoint never submits anything
// on its own behalf \u2014 it only creates an audit-trail record that a human made
// the required decision before any submission-type action proceeds.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const input: ApprovalInput = await request.json().catch(() => ({}))

  const profileId = str(input.profileId)
  const gate = str(input.gate)
  const decision = str(input.decision) || 'pending'

  if (!profileId) return json({ error: 'profileId is required.' }, { status: 400 })
  if (!isKnownGate(gate)) {
    return json({ error: `gate must be one of: ${APPROVAL_GATES.join(', ')}` }, { status: 400 })
  }
  if (!['approved', 'denied', 'pending'].includes(decision)) {
    return json({ error: 'decision must be approved, denied, or pending.' }, { status: 400 })
  }
  if (decision === 'approved' && !str(input.approvedByName)) {
    return json({ error: 'An approved decision requires the name of the owner or authorized representative.' }, { status: 400 })
  }

  const record = {
    id: crypto.randomUUID(),
    profileId,
    opportunityId: str(input.opportunityId),
    gate,
    approvedByName: str(input.approvedByName),
    approvedByRole: str(input.approvedByRole),
    decision,
    notes: str(input.notes),
    createdAt: new Date().toISOString(),
  }

  if (env.DB) {
    await env.DB.prepare(
      `INSERT INTO business_approvals (
        id, profile_id, opportunity_id, gate, approved_by_name, approved_by_role, decision, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      record.id, record.profileId, record.opportunityId, record.gate, record.approvedByName,
      record.approvedByRole, record.decision, record.notes, record.createdAt
    ).run()
  }

  return json({
    success: true,
    approval: record,
    warning: env.DB ? undefined : 'D1 binding DB is not configured. Approval was validated but not persisted.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()
