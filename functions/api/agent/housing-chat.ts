import { json, options } from '../../_shared/http'

type AiBinding = {
  run: (model: string, input: Record<string, unknown>) => Promise<unknown>
}

type Env = {
  AI?: AiBinding
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
  AGENT_MODEL?: string
  SAM_API_KEY?: string
  SAMS_API_KEY?: string
  SIMPLER_GRANTS_API_KEY?: string
  DATA_GOV_API_KEY?: string
}

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type ToolResult = {
  tool: string
  label: string
  live: boolean
  warning?: string
  data: unknown
}

// Marcus — Affordable Housing, Sober Living / Recovery Housing, HUD Grants &
// Government Housing Contracts Intelligence Agent, scoped to South Carolina.
// Converted from the general/national "Marcus" research framework into a
// live agent that reuses the site's existing federal-data tools
// (/api/funding/discover) with housing-specific search framing, plus the
// static SC agency/funding/scoring reference data in src/lib/housingIntel.ts.
const SYSTEM_PROMPT = `You are Marcus, the affordable housing, sober living / recovery housing, HUD grants, and government housing contracts intelligence agent for Dr. McKnight's South Carolina practice.

Mission:
- Help identify South Carolina and federal funding for affordable housing, recovery housing, and supportive housing projects (grants, forgivable loans, low-interest loans, tax credits, rental subsidies, and government contracts).
- Help identify South Carolina public housing authority (PHA) Section 8 / Housing Choice Voucher and Project-Based Voucher opportunities.
- Help identify South Carolina government housing/recovery-services contracts and RFPs (recovery residence services, transitional housing, reentry housing, homeless services).
- Score opportunities using funding size, probability, accessibility, time-to-money, strategic fit, repeatability, and competitive advantage (weights: 20/20/15/15/15/10/5, out of 100).
- Always separate a SCARR-certified recovery residence / sober living home (voluntary certification, not a licensed medical facility) from a DHEC/DAODAS-licensed substance-use treatment facility. Never conflate the two.

Rules:
- Never present an expired or closed program as currently open.
- Never assert a specific award amount, approval odds, or guaranteed funding outcome.
- Never fabricate a South Carolina agency, program, deadline, or citation that cannot be sourced. If a tool returns no data, say so plainly.
- Never structure or suggest referral fees, kickbacks, or patient-brokering arrangements.
- Flag red-flag requirements (match funds, bonding, Davis-Bacon prevailing wage, environmental/NEPA review, nonprofit-only eligibility, long-term affordability covenants) instead of hiding them.
- Distinguish the funding-type taxonomy explicitly: grant vs. forgivable loan vs. low-interest loan vs. contract vs. rental subsidy vs. tax credit vs. reimbursement vs. property incentive.
- Do not provide legal advice. Tell users to verify zoning, licensure, and program requirements against the current official source before relying on them.
- Give concise, actionable next steps a housing operator or Dr. McKnight's team can act on.`

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => ({})) as { messages?: ChatMessage[]; context?: string }
  const messages = (body.messages || [])
    .filter((message) => message && typeof message.content === 'string')
    .slice(-8)
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content || ''

  if (!lastUserMessage.trim()) {
    return json({ error: 'Message is required.' }, { status: 400 })
  }

  const tools = await runTools(request, lastUserMessage)
  const answer = await generateAgentAnswer(env, messages, tools)

  return json({
    source: 'Marcus — Housing & Recovery Housing Intelligence Agent',
    live: Boolean(env.AI || env.OPENAI_API_KEY),
    model: env.AGENT_MODEL || env.OPENAI_MODEL || '@cf/meta/llama-3.1-8b-instruct',
    checkedAt: new Date().toISOString(),
    answer,
    tools,
    warning: env.AI || env.OPENAI_API_KEY
      ? undefined
      : 'No LLM binding is configured. This response used deterministic tool summarization. Add Cloudflare Workers AI binding AI or OPENAI_API_KEY for full live chat generation.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()

async function runTools(request: Request, message: string): Promise<ToolResult[]> {
  const query = buildHousingQuery(message)
  const wantsScoring = /score|priority|worth pursuing|rank|weight/i.test(message)
  const wantsRedFlags = /red flag|risk|match funds|bonding|davis-bacon|nepa|environmental review|catch/i.test(message)
  const wantsPha = /pha|voucher|section 8|hcv|pbv|housing authority/i.test(message)
  const wantsRecovery = /sober|recovery resid|scarr|oxford house|narr|treatment facility/i.test(message)

  const tools: Array<Promise<ToolResult>> = []

  tools.push(callLocalTool(
    request,
    `/api/funding/discover?q=${encodeURIComponent(query)}&limit=6&state=SC`,
    'housing_funding_discovery',
    'HUD, grants.gov, SAM.gov, USAspending, and NOFO search for South Carolina housing/recovery-housing opportunities'
  ))

  if (wantsScoring) {
    tools.push(Promise.resolve({
      tool: 'housing_scoring_framework',
      label: 'Housing opportunity scoring framework',
      live: true,
      data: {
        factors: [
          { factor: 'Funding size', weight: 20 },
          { factor: 'Probability', weight: 20 },
          { factor: 'Accessibility', weight: 15 },
          { factor: 'Time to money', weight: 15 },
          { factor: 'Strategic fit', weight: 15 },
          { factor: 'Repeatability', weight: 10 },
          { factor: 'Competitive advantage', weight: 5 },
        ],
        decisionBands: [
          { range: '90-100', label: 'Priority A — pursue immediately' },
          { range: '75-89', label: 'Priority B — strong opportunity' },
          { range: '60-74', label: 'Priority C — worth developing' },
          { range: 'Below 60', label: 'Monitor or deprioritize' },
        ],
      },
    }))
  }

  if (wantsRedFlags) {
    tools.push(Promise.resolve({
      tool: 'housing_red_flags',
      label: 'Red-flag requirements to surface (not automatic disqualifiers)',
      live: true,
      data: {
        redFlags: [
          'Reimbursement-only funding structure (cash flow burden before payment)',
          'Large required match funds',
          'Extensive prior-HUD or prior-development experience requirements',
          'Bonding requirements',
          'Audited financial statements or substantial reserve requirements',
          'Nonprofit-only eligibility (may require a fiscal-sponsor or JV structure)',
          'Long-term affordability restrictions (deed covenants)',
          'Davis-Bacon prevailing-wage requirements',
          'Environmental review requirements (NEPA or state equivalent)',
          'Restrictive local zoning for group residential use',
        ],
      },
    }))
  }

  if (wantsPha) {
    tools.push(Promise.resolve({
      tool: 'sc_pha_checklist',
      label: 'South Carolina PHA / Section 8 research checklist',
      live: true,
      data: {
        checklist: [
          'Official PHA name and territory served',
          'Housing Choice Voucher availability and current wait-list status',
          'Payment standards and utility allowance schedule',
          'Landlord enrollment procedure and required inspection standard (HQS/UPCS-V)',
          'Existing or upcoming Project-Based Voucher (PBV) solicitations',
          'HUD-VASH, Mainstream, and other special-purpose voucher allocations',
          'RAD conversion or disposition activity',
          'Contact information and official procurement/RFP page',
        ],
      },
    }))
  }

  if (wantsRecovery) {
    tools.push(Promise.resolve({
      tool: 'sc_recovery_housing_distinctions',
      label: 'SC recovery residence vs. licensed treatment facility distinctions',
      live: true,
      data: {
        recoveryResidence: 'Voluntary SCARR (NARR affiliate) certification, or SC Oxford House — required for SC Recovery Housing Program eligibility. Not a licensed medical facility. Zoning should be evaluated as residential use; Fair Housing Act reasonable-accommodation requests can apply.',
        licensedTreatmentFacility: 'Requires DHEC/DAODAS-recognized licensure for clinical treatment services. Distinct compliance track and distinct funding streams (Medicaid behavioral-health billing) from recovery-housing operating funds.',
        agencies: [
          { name: 'SC Housing', url: 'https://schousing.sc.gov/' },
          { name: 'SC Opioid Recovery Fund (SCORF)', url: 'https://scorf.sc.gov/' },
          { name: 'SC BHDD — Office of Substance Use Services', url: 'https://bhdd.sc.gov/office-substance-use-services/services/recovery/applications-recovery-housing-assistance' },
          { name: 'SCARR', url: 'https://scarronline.org/' },
        ],
      },
    }))
  }

  return Promise.all(tools)
}

async function callLocalTool(request: Request, path: string, tool: string, label: string): Promise<ToolResult> {
  const url = new URL(path, request.url)
  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  return {
    tool,
    label,
    live: Boolean(data.live || response.ok),
    warning: typeof data.warning === 'string'
      ? data.warning
      : Array.isArray(data.warnings) ? (data.warnings as string[]).join(' | ') : undefined,
    data,
  }
}

async function generateAgentAnswer(env: Env, messages: ChatMessage[], tools: ToolResult[]) {
  const toolSummary = summarizeTools(tools)
  const model = env.AGENT_MODEL || env.OPENAI_MODEL || '@cf/meta/llama-3.1-8b-instruct'
  const prompt = `${SYSTEM_PROMPT}

Tool results:
${toolSummary}

Conversation:
${messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n')}

Answer as Marcus. Include useful source status, the funding-type taxonomy where relevant, and clear next steps.`

  if (env.AI) {
    const response = await env.AI.run(model, { prompt, max_tokens: 900 })
    return extractGeneratedText(response) || fallbackAnswer(tools)
  }

  if (env.OPENAI_API_KEY) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Tool results:\n${toolSummary}\n\nConversation:\n${messages.map((message) => `${message.role}: ${message.content}`).join('\n')}` },
        ],
      }),
    })
    const data = await response.json().catch(() => ({})) as { choices?: Array<{ message?: { content?: string } }> }
    if (!response.ok) return `${fallbackAnswer(tools)}\n\nLLM warning: OpenAI returned HTTP ${response.status}.`
    return data.choices?.[0]?.message?.content || fallbackAnswer(tools)
  }

  return fallbackAnswer(tools)
}

function extractGeneratedText(response: unknown) {
  if (typeof response === 'string') return response
  if (!response || typeof response !== 'object') return ''
  const value = response as Record<string, unknown>
  return text(value.response) || text(value.result) || text(value.answer) || text(value.text)
}

function fallbackAnswer(tools: ToolResult[]) {
  const discovery = tools.find((tool) => tool.tool === 'housing_funding_discovery')?.data as Record<string, unknown> | undefined
  const results = Array.isArray(discovery?.results) ? discovery.results.slice(0, 6) as Array<Record<string, unknown>> : []
  const sources = Array.isArray(discovery?.sources) ? discovery.sources as Array<Record<string, unknown>> : []
  const warnings = sources
    .filter((source) => source.warning)
    .map((source) => `- ${source.source}: ${source.warning}`)
    .join('\n')

  const lines = results.map((item, index) => {
    const title = text(item.title) || 'Untitled result'
    const source = text(item.source) || 'source'
    const agency = text(item.agency)
    const closeDate = text(item.closeDate)
    return `${index + 1}. ${title} (${source}${agency ? `, ${agency}` : ''}${closeDate ? `, date: ${closeDate}` : ''})`
  })

  return [
    'I searched the connected federal/state housing funding tools and prepared the current opportunity summary.',
    lines.length ? `Top matches:\n${lines.join('\n')}` : 'No normalized matches came back from the currently live sources for this South Carolina housing search.',
    warnings ? `Source warnings:\n${warnings}` : '',
    'Reminder: verify the official program page for current open/closed status, eligible uses, and match requirements. Confirm whether a recovery-housing project is SCARR-certified (or SC Oxford House) before assuming SC Recovery Housing Program eligibility.',
    'Next step: score this opportunity against funding size, probability, accessibility, time-to-money, strategic fit, repeatability, and competitive advantage, then note any red-flag requirements before committing capture time.',
  ].filter(Boolean).join('\n\n')
}

function summarizeTools(tools: ToolResult[]) {
  return JSON.stringify(tools.map((tool) => ({
    tool: tool.tool,
    label: tool.label,
    live: tool.live,
    warning: tool.warning,
    data: trimData(tool.data),
  })), null, 2).slice(0, 16000)
}

function trimData(data: unknown) {
  if (!data || typeof data !== 'object') return data
  const value = data as Record<string, unknown>
  return {
    source: value.source,
    live: value.live,
    query: value.query,
    warnings: value.warnings,
    sources: value.sources,
    results: Array.isArray(value.results) ? value.results.slice(0, 6) : value.results,
    checklist: value.checklist,
    redFlags: value.redFlags,
    factors: value.factors,
    decisionBands: value.decisionBands,
    recoveryResidence: value.recoveryResidence,
    licensedTreatmentFacility: value.licensedTreatmentFacility,
    agencies: value.agencies,
  }
}

function buildHousingQuery(message: string) {
  const withoutFiller = message
    .replace(/find|search|show|look up|for|me|please|what|is|are|the|a|an/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const base = withoutFiller || message || 'affordable housing recovery housing'
  // Keep it housing-scoped even if the user's message was generic.
  const alreadyHousingScoped = /housing|recovery|sober|hud|voucher|section 8|homeless|shelter/i.test(base)
  const scoped = alreadyHousingScoped ? base : `${base} affordable housing`
  return scoped.slice(0, 120)
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}
