/**
 * GoHighLevel (GHL) CRM push integration.
 *
 * Every form-submission endpoint on the site (contact, booking, newsletter,
 * intake, command-center master intake) calls `pushToGhl()` after its own
 * primary work (SendGrid email + D1 persistence) is done. This is always
 * best-effort: a GHL outage, missing credentials, or a rejected field must
 * never fail the user-facing request. Failures are only logged.
 *
 * Auth: a GHL "Private Integration Token" (PIT) scoped to a single
 * location, set via the GHL_PIT and GHL_LOCATION_ID secrets. If either is
 * missing, pushToGhl() is a silent no-op (mirrors the SENDGRID_API_KEY
 * "not configured" fallback pattern already used elsewhere in functions/).
 *
 * Field keys below were provisioned once via scripts/ghl_setup_fields.py
 * and must stay in sync with that script (and with GHL's live
 * customFields list) if you rename/add fields.
 */

export type GhlEnv = {
  GHL_PIT?: string
  GHL_LOCATION_ID?: string
}

const GHL_BASE = 'https://services.leadconnectorhq.com'
const GHL_VERSION = '2021-07-28'

export type GhlCustomFieldValue = string | number | string[]

export type GhlContactPush = {
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  companyName?: string
  website?: string
  tags?: string[]
  /** Keyed by the GHL fieldKey suffix (e.g. "company", "readiness_score") — NOT the human-readable name. */
  customFields?: Record<string, GhlCustomFieldValue>
}

function isConfigured(env: GhlEnv): boolean {
  return Boolean(env.GHL_PIT && env.GHL_LOCATION_ID)
}

/**
 * Upserts a GHL contact (create-or-update, matched by email/phone per the
 * location's configured unique identifiers). Never throws -- returns a
 * result object the caller can log or ignore.
 */
export async function pushToGhl(
  env: GhlEnv,
  contact: GhlContactPush
): Promise<{ ok: boolean; skipped?: boolean; status?: number; error?: string }> {
  if (!isConfigured(env)) {
    return { ok: false, skipped: true, error: 'ghl_not_configured' }
  }
  if (!contact.email) {
    return { ok: false, error: 'missing_email' }
  }

  const customFields = Object.entries(contact.customFields || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, field_value]) => ({ key, field_value }))

  const body: Record<string, unknown> = {
    locationId: env.GHL_LOCATION_ID,
    email: contact.email.trim().toLowerCase(),
  }
  if (contact.firstName) body.firstName = contact.firstName
  if (contact.lastName) body.lastName = contact.lastName
  if (contact.phone) body.phone = contact.phone
  if (contact.companyName) body.companyName = contact.companyName
  if (contact.website) body.website = contact.website
  if (contact.tags?.length) body.tags = contact.tags
  if (customFields.length) body.customFields = customFields

  try {
    const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GHL_PIT}`,
        Version: GHL_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('GHL upsert failed:', res.status, text)
      return { ok: false, status: res.status, error: text.slice(0, 500) }
    }
    return { ok: true, status: res.status }
  } catch (err) {
    console.error('GHL upsert error:', err)
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
