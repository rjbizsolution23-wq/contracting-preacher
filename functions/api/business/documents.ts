import { json, options, requireAdmin } from '../../_shared/http'
import { isKnownFolder } from '../../_shared/dataRoom'

type Env = {
  ADMIN_ACCESS_CODE?: string
  DB?: D1Database
}

type DocumentInput = {
  profileId?: string
  folder?: string
  name?: string
  owner?: string
  version?: string
  effectiveDate?: string
  expirationDate?: string
  confidentialityLevel?: string
  verifiedStatus?: string
  supportingEvidence?: string
  allowedUse?: string
  lastReviewedDate?: string
  notes?: string
}

function str(value: unknown) {
  return String(value ?? '').trim()
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!requireAdmin(request, env.ADMIN_ACCESS_CODE)) {
    return json({ error: 'Unauthorized business data room request.' }, { status: 401 })
  }

  const url = new URL(request.url)
  const profileId = url.searchParams.get('profileId') || ''

  if (!env.DB) {
    return json({ documents: [], warning: 'D1 binding DB is not configured.' })
  }

  const rows = profileId
    ? await env.DB.prepare(`SELECT * FROM business_documents WHERE profile_id = ? ORDER BY folder ASC, updated_at DESC`).bind(profileId).all()
    : await env.DB.prepare(`SELECT * FROM business_documents ORDER BY updated_at DESC LIMIT 200`).all()

  return json({ documents: rows.results || [] })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const input: DocumentInput = await request.json().catch(() => ({}))

  const profileId = str(input.profileId)
  const folder = str(input.folder)
  const name = str(input.name)

  if (!profileId) return json({ error: 'profileId is required.' }, { status: 400 })
  if (!name) return json({ error: 'Document name is required.' }, { status: 400 })
  if (!isKnownFolder(folder)) {
    return json({ error: `folder must be one of the 24 master data room folders.` }, { status: 400 })
  }

  const now = new Date().toISOString()
  const id = crypto.randomUUID()

  const record = {
    id,
    profileId,
    folder,
    name,
    owner: str(input.owner),
    version: str(input.version),
    effectiveDate: str(input.effectiveDate),
    expirationDate: str(input.expirationDate),
    confidentialityLevel: str(input.confidentialityLevel) || 'internal',
    verifiedStatus: str(input.verifiedStatus) || 'unverified',
    supportingEvidence: str(input.supportingEvidence),
    allowedUse: str(input.allowedUse),
    lastReviewedDate: str(input.lastReviewedDate),
    notes: str(input.notes),
    createdAt: now,
    updatedAt: now,
  }

  if (env.DB) {
    await env.DB.prepare(
      `INSERT INTO business_documents (
        id, profile_id, folder, name, owner, version, effective_date, expiration_date,
        confidentiality_level, verified_status, supporting_evidence, allowed_use,
        last_reviewed_date, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      record.id, record.profileId, record.folder, record.name, record.owner, record.version,
      record.effectiveDate, record.expirationDate, record.confidentialityLevel,
      record.verifiedStatus, record.supportingEvidence, record.allowedUse,
      record.lastReviewedDate, record.notes, record.createdAt, record.updatedAt
    ).run()
  }

  return json({
    success: true,
    document: record,
    warning: env.DB ? undefined : 'D1 binding DB is not configured. Document was validated but not persisted.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()
