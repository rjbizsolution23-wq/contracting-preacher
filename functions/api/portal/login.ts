import { ipHint, json, logAuditEvent, options } from '../../_shared/http'

type Env = {
  PORTAL_ACCESS_CODE?: string
  DB?: D1Database
}

/**
 * Client portal login.
 *
 * SECURITY NOTE: this remains a single shared access-code gate (one code
 * for every client), not per-client authentication. That is a real
 * limitation -- per-client login/MFA (blueprint section 21) is a payments-
 * and-identity-adjacent change and is explicitly out of scope for this
 * 🟢 architecture-only pass. What this endpoint now does differently:
 *
 * 1. It no longer silently falls back to a hardcoded 'demo-portal' code
 *    when PORTAL_ACCESS_CODE is unset -- that fallback effectively meant
 *    "the portal has no real protection until someone remembers to set a
 *    secret," which is the same class of bug fixed in requireAdmin().
 * 2. If a D1-backed lead record matching the submitted email exists, the
 *    portal now returns that lead's real company name, readiness score,
 *    stage, and explainable strengths/risks instead of always returning
 *    identical hardcoded mock data. If no matching record exists (or DB
 *    is not configured), it still returns clearly-labeled starter content
 *    rather than fabricating a specific score for a business that was
 *    never scored.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => ({} as Record<string, string>))
  const email = String(body.email || '').trim().toLowerCase()
  const accessCode = String(body.accessCode || '').trim()

  if (!email || !accessCode) {
    return json({ error: 'Email and access code are required.' }, { status: 400 })
  }

  if (!env.PORTAL_ACCESS_CODE) {
    await logAuditEvent(env, { actor: email, action: 'portal.login', result: 'denied', detail: 'secret_not_configured', ipHint: ipHint(request) })
    return json({
      error: 'The client portal is not yet configured. Ask the site administrator to set PORTAL_ACCESS_CODE.',
    }, { status: 503 })
  }

  if (accessCode !== env.PORTAL_ACCESS_CODE) {
    await logAuditEvent(env, { actor: email, action: 'portal.login', result: 'denied', detail: 'invalid_token', ipHint: ipHint(request) })
    return json({ error: 'Invalid portal access code.' }, { status: 401 })
  }

  await logAuditEvent(env, { actor: email, action: 'portal.login', result: 'success', ipHint: ipHint(request) })

  const real = env.DB ? await lookupRealClient(env.DB, email) : null

  if (real) {
    return json({
      success: true,
      portal: {
        client: {
          name: `${real.firstName} ${real.lastName}`.trim() || email.split('@')[0],
          company: real.company || 'Client Company',
          readinessScore: real.readinessScore,
          stage: real.stage,
        },
        roadmap: real.strengths.length || real.risks.length
          ? [...real.strengths.map((item) => `Strength: ${item}`), ...real.risks.map((item) => `Next step: ${item}`)]
          : DEFAULT_ROADMAP,
        watchlist: DEFAULT_WATCHLIST,
        documents: DEFAULT_DOCUMENTS,
        deadlines: DEFAULT_DEADLINES,
        dataSource: 'crm-record',
      },
    })
  }

  return json({
    success: true,
    portal: {
      client: {
        name: email.split('@')[0].replace(/[._-]/g, ' '),
        company: 'Client Company',
        readinessScore: 0,
        stage: 'not-yet-scored',
      },
      roadmap: [
        'No CRM intake record was found for this email yet.',
        'Complete the intake form so ContractingPreacher AI can generate a real readiness score.',
        ...DEFAULT_ROADMAP,
      ],
      watchlist: DEFAULT_WATCHLIST,
      documents: DEFAULT_DOCUMENTS,
      deadlines: DEFAULT_DEADLINES,
      dataSource: 'starter-content',
    },
  })
}

async function lookupRealClient(db: D1Database, email: string) {
  try {
    const row = await db
      .prepare(
        `SELECT first_name, last_name, company, readiness_score, stage, strengths, risks
         FROM leads WHERE email = ? ORDER BY created_at DESC LIMIT 1`
      )
      .bind(email)
      .first<Record<string, unknown>>()
    if (!row) return null
    return {
      firstName: String(row.first_name || ''),
      lastName: String(row.last_name || ''),
      company: String(row.company || ''),
      readinessScore: Number(row.readiness_score || 0),
      stage: String(row.stage || 'new-intake'),
      strengths: JSON.parse(String(row.strengths || '[]')) as string[],
      risks: JSON.parse(String(row.risks || '[]')) as string[],
    }
  } catch {
    // Table may not exist yet in an older DB snapshot; degrade gracefully.
    return null
  }
}

const DEFAULT_ROADMAP = [
  'Verify SAM.gov entity registration and UEI status against the official record.',
  'Finalize NAICS and PSC target list for the first capture lane.',
  'Package capability statement and past-performance proof.',
  'Select 3 target agencies and build a 90-day opportunity watchlist.',
]

const DEFAULT_WATCHLIST = [
  'SAM.gov contract search tied to client NAICS and keywords.',
  'USAspending competitor award history for top agency targets.',
  'Federal Register NOFO alerts for notices and funding announcements.',
  'SBIR/STTR opportunities if technology R&D funding is relevant.',
]

const DEFAULT_DOCUMENTS = [
  'Articles of organization or incorporation',
  'EIN confirmation letter',
  'Capability statement',
  'Insurance, bonding, and licenses',
  'Certification ownership/control documents if applicable',
]

const DEFAULT_DEADLINES = [
  'Initial readiness call: schedule after intake review',
  'SAM verification: before any proposal submission',
  'Certification document review: within 7 business days',
  'Weekly pipeline check: every Monday',
]

export const onRequestOptions: PagesFunction = async () => options()
