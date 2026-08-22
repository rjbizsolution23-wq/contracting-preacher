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
 *
 * Calendar/appointment booking (createGhlAppointment): the booking form
 * (functions/api/booking.ts) additionally creates a real bookable
 * appointment on a GHL Calendar, so the slot actually lands on Dr.
 * McKnight's GHL calendar (and any connected Google Calendar) instead of
 * only existing as a tagged Contact. Requires GHL_CALENDAR_ID, set once
 * the "Free Consultation" (or equivalent) calendar has been created in
 * GHL under Settings -> Calendars, with at least one team member
 * assigned. Like pushToGhl(), this is best-effort and never throws.
 */

export type GhlEnv = {
  GHL_PIT?: string
  GHL_LOCATION_ID?: string
  GHL_CALENDAR_ID?: string
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
): Promise<{ ok: boolean; skipped?: boolean; status?: number; error?: string; contactId?: string }> {
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
    const data = (await res.json().catch(() => null)) as { contact?: { id?: string } } | null
    return { ok: true, status: res.status, contactId: data?.contact?.id }
  } catch (err) {
    console.error('GHL upsert error:', err)
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

export type GhlAppointmentPush = {
  /** GHL contact id (from pushToGhl()'s returned contactId). Required by the GHL API. */
  contactId: string
  /** ISO-8601 date-time WITH a numeric timezone offset (e.g. "2026-09-05T10:00:00-04:00").
   * GHL's appointments endpoint silently misinterprets bare/UTC timestamps against the
   * calendar's configured slots, so an explicit offset must always be supplied. */
  startTime: string
  /** Defaults to startTime + the calendar's own slot duration if omitted. */
  endTime?: string
  title?: string
}

/**
 * Books a real appointment on the configured GHL Calendar (GHL_CALENDAR_ID).
 * Never throws -- returns a result object the caller can log or ignore. This
 * is intentionally separate from pushToGhl(): a contact must already exist
 * (or be upserted first) before an appointment can reference it.
 */
export async function createGhlAppointment(
  env: GhlEnv,
  appt: GhlAppointmentPush
): Promise<{ ok: boolean; skipped?: boolean; status?: number; error?: string; appointmentId?: string }> {
  if (!isConfigured(env) || !env.GHL_CALENDAR_ID) {
    return { ok: false, skipped: true, error: 'ghl_calendar_not_configured' }
  }
  if (!appt.contactId || !appt.startTime) {
    return { ok: false, error: 'missing_contactId_or_startTime' }
  }

  const body: Record<string, unknown> = {
    calendarId: env.GHL_CALENDAR_ID,
    locationId: env.GHL_LOCATION_ID,
    contactId: appt.contactId,
    startTime: appt.startTime,
  }
  if (appt.endTime) body.endTime = appt.endTime
  if (appt.title) body.title = appt.title

  try {
    const res = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
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
      console.error('GHL appointment creation failed:', res.status, text)
      return { ok: false, status: res.status, error: text.slice(0, 500) }
    }
    const data = (await res.json().catch(() => null)) as { id?: string } | null
    return { ok: true, status: res.status, appointmentId: data?.id }
  } catch (err) {
    console.error('GHL appointment creation error:', err)
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
