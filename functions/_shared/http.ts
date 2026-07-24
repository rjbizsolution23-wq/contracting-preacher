export const jsonHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
}

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {}),
    },
  })
}

export function options() {
  return new Response(null, {
    status: 204,
    headers: jsonHeaders,
  })
}

/**
 * Admin/privileged-endpoint gate.
 *
 * SECURITY: this now fails CLOSED. If `expected` (the configured secret,
 * e.g. env.ADMIN_ACCESS_CODE) is not set, access is denied rather than
 * silently allowed. The previous behavior ("no secret configured means
 * let everyone in") is a real production risk -- it means forgetting to
 * run `wrangler pages secret put ADMIN_ACCESS_CODE` would leave every
 * admin/business/* endpoint open with no authentication at all.
 *
 * Call sites should treat a `false` return the same whether it was caused
 * by a missing secret or a wrong token -- the caller only needs "allowed"
 * vs "not allowed". Use `adminGateReason()` if you need to log *why* to
 * the audit trail (e.g. "secret_not_configured" vs "invalid_token").
 */
export function requireAdmin(request: Request, expected?: string) {
  if (!expected) return false
  const header = request.headers.get('Authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  return token.length > 0 && token === expected
}

/**
 * Same admission decision as requireAdmin(), but also returns a
 * machine-readable reason suitable for writing to audit_events without
 * ever logging the actual secret or submitted token value.
 */
export function adminGateReason(request: Request, expected?: string): { allowed: boolean; reason: string } {
  if (!expected) return { allowed: false, reason: 'secret_not_configured' }
  const header = request.headers.get('Authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (!token) return { allowed: false, reason: 'missing_token' }
  if (token !== expected) return { allowed: false, reason: 'invalid_token' }
  return { allowed: true, reason: 'ok' }
}

export function normalizeQuery(request: Request) {
  const url = new URL(request.url)
  return {
    url,
    q: (url.searchParams.get('q') || 'small business').trim().slice(0, 120),
    source: (url.searchParams.get('source') || 'contracts').trim().toLowerCase(),
    limit: Math.min(Math.max(Number(url.searchParams.get('limit') || 10), 1), 25),
  }
}

/**
 * Best-effort, privacy-conscious IP hint for audit logging. Never store a
 * full raw IP in the audit trail long-term identity graph -- this trims to
 * a coarse hint (first three octets / first three hextets) which is enough
 * for anomaly triage without being a durable per-person identifier.
 */
export function ipHint(request: Request): string {
  const raw = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || ''
  const ip = raw.split(',')[0]?.trim() || ''
  if (!ip) return ''
  if (ip.includes(':')) {
    return ip.split(':').slice(0, 3).join(':') + ':***'
  }
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.***`
  }
  return ''
}

type AuditEnv = { DB?: D1Database }

/**
 * Append-only privileged-action audit log (blueprint section 21/22:
 * audit_events). Never throws -- a logging failure must never block the
 * underlying request. No-ops silently if the D1 binding or the
 * audit_events table (migration 0003) is not yet available.
 */
export async function logAuditEvent(
  env: AuditEnv,
  event: {
    actor?: string
    action: string
    resourceType?: string
    resourceId?: string
    result?: 'success' | 'denied' | 'error'
    detail?: string
    ipHint?: string
  }
) {
  if (!env.DB) return
  try {
    await env.DB.prepare(
      `INSERT INTO audit_events (id, actor, action, resource_type, resource_id, result, detail, ip_hint, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        crypto.randomUUID(),
        event.actor || 'unknown',
        event.action,
        event.resourceType || '',
        event.resourceId || '',
        event.result || 'success',
        event.detail || '',
        event.ipHint || '',
        new Date().toISOString()
      )
      .run()
  } catch {
    // Audit logging is best-effort. If the table doesn't exist yet
    // (migration not applied) or D1 is briefly unavailable, swallow the
    // error rather than failing the real request.
  }
}
