/**
 * Client health score -- scoped subset of blueprint section 23.
 *
 * The blueprint's full formula (onboarding 15 / documents 15 / communication
 * 10 / appointments 10 / payment standing 15 / project progress 15 / support
 * sentiment 10 / renewal likelihood 10) assumes systems this codebase does
 * not have yet: billing/payments, an appointment system, and a support
 * ticket system. Inventing scores for data that doesn't exist would violate
 * the same "AI must never invent facts" rule already enforced elsewhere in
 * this codebase (see dataRoom.ts header comment and score.ts disclaimer).
 *
 * So this implementation re-weights across the four factors this site can
 * actually measure today from `business_profiles`, `business_documents`,
 * and `business_opportunities` / `business_approvals`:
 *
 *   - Onboarding completeness (30 pts): how many of the profile's core
 *     required-for-capture fields are filled in.
 *   - Document readiness (30 pts): coverage across the 24-folder data room,
 *     weighted toward verified documents over unverified uploads.
 *   - Opportunity pipeline health (30 pts): whether there is an active,
 *     scored opportunity pipeline and whether approval gates are moving.
 *   - Recency / engagement proxy (10 pts): how recently the profile or its
 *     documents were touched. This is explicitly a proxy, not a true
 *     communication-engagement metric (no email/SMS open tracking exists
 *     in this codebase) -- callers must not present it as more than that.
 *
 * Every sub-score returns its own explanation string so nothing is a
 * black-box number, consistent with the blueprint's explainability rule.
 */

export type HealthScoreExplanation = {
  factor: string
  points: number
  maxPoints: number
  explanation: string
}

export type HealthScoreResult = {
  onboardingScore: number
  documentScore: number
  pipelineScore: number
  engagementScore: number
  totalScore: number
  band: 'thriving' | 'healthy' | 'needs-attention' | 'at-risk' | 'immediate-intervention' | 'unscored'
  explanation: HealthScoreExplanation[]
}

const ONBOARDING_FIELDS = [
  'legalName', 'email', 'phone', 'entityType', 'primaryNaics', 'coreOffering',
  'employees', 'lanesOfInterest', 'biggestGoal',
] as const

type ProfileLike = Record<string, unknown>

export function scoreOnboarding(profile: ProfileLike): { score: number; explanation: HealthScoreExplanation } {
  const filled = ONBOARDING_FIELDS.filter((field) => String(profile[field] ?? '').trim().length > 0).length
  const points = Math.round((filled / ONBOARDING_FIELDS.length) * 30)
  return {
    score: points,
    explanation: {
      factor: 'onboarding_completeness',
      points,
      maxPoints: 30,
      explanation: `${filled} of ${ONBOARDING_FIELDS.length} core profile fields are filled in.`,
    },
  }
}

export function scoreDocuments(documents: Array<{ verifiedStatus?: string }>): { score: number; explanation: HealthScoreExplanation } {
  const totalFolders = 24
  const verified = documents.filter((doc) => String(doc.verifiedStatus || '').toLowerCase() === 'verified').length
  const uploaded = documents.length
  // Verified documents count fully; unverified uploads count at half weight
  // so the score rewards actually-reviewed evidence over raw upload volume.
  const weighted = verified + (uploaded - verified) * 0.5
  const points = Math.min(30, Math.round((weighted / totalFolders) * 30))
  return {
    score: points,
    explanation: {
      factor: 'document_readiness',
      points,
      maxPoints: 30,
      explanation: `${uploaded} document(s) uploaded across the 24-folder data room, ${verified} marked verified.`,
    },
  }
}

export function scorePipeline(
  opportunities: Array<{ fitScore?: number; decisionBand?: string }>,
  approvalsCount: number
): { score: number; explanation: HealthScoreExplanation } {
  if (!opportunities.length) {
    return {
      score: 0,
      explanation: {
        factor: 'opportunity_pipeline',
        points: 0,
        maxPoints: 30,
        explanation: 'No opportunities have been logged for this client yet.',
      },
    }
  }
  const pursuable = opportunities.filter((opp) => !['reject', 'no-bid'].includes(String(opp.decisionBand || ''))).length
  const avgFit = opportunities.reduce((sum, opp) => sum + Number(opp.fitScore || 0), 0) / opportunities.length
  const pipelinePoints = Math.min(18, Math.round((pursuable / opportunities.length) * 18))
  const fitPoints = Math.min(8, Math.round((avgFit / 100) * 8))
  const approvalPoints = Math.min(4, approvalsCount)
  const points = pipelinePoints + fitPoints + approvalPoints
  return {
    score: points,
    explanation: {
      factor: 'opportunity_pipeline',
      points,
      maxPoints: 30,
      explanation: `${pursuable} of ${opportunities.length} logged opportunities are in a pursuable decision band (avg fit score ${Math.round(avgFit)}/100); ${approvalsCount} approval-gate decision(s) on record.`,
    },
  }
}

export function scoreEngagement(mostRecentTimestampIso: string | null): { score: number; explanation: HealthScoreExplanation } {
  if (!mostRecentTimestampIso) {
    return {
      score: 0,
      explanation: {
        factor: 'recency_proxy',
        points: 0,
        maxPoints: 10,
        explanation: 'No recorded activity yet. This is a recency proxy, not a true communication-engagement metric -- this site does not yet track email/SMS opens.',
      },
    }
  }
  const days = (Date.now() - new Date(mostRecentTimestampIso).getTime()) / (1000 * 60 * 60 * 24)
  let points = 10
  if (days > 60) points = 2
  else if (days > 30) points = 5
  else if (days > 14) points = 8
  return {
    score: points,
    explanation: {
      factor: 'recency_proxy',
      points,
      maxPoints: 10,
      explanation: `Most recent profile/document activity was ${Math.max(0, Math.round(days))} day(s) ago. Proxy only -- not a true engagement metric.`,
    },
  }
}

export function bandFor(totalScore: number): HealthScoreResult['band'] {
  if (totalScore >= 90) return 'thriving'
  if (totalScore >= 75) return 'healthy'
  if (totalScore >= 60) return 'needs-attention'
  if (totalScore >= 40) return 'at-risk'
  return 'immediate-intervention'
}

export function computeHealthScore(input: {
  profile: ProfileLike
  documents: Array<{ verifiedStatus?: string; updatedAt?: string }>
  opportunities: Array<{ fitScore?: number; decisionBand?: string; updatedAt?: string }>
  approvalsCount: number
}): HealthScoreResult {
  const onboarding = scoreOnboarding(input.profile)
  const documents = scoreDocuments(input.documents)
  const pipeline = scorePipeline(input.opportunities, input.approvalsCount)

  const timestamps = [
    String(input.profile.updatedAt || ''),
    ...input.documents.map((doc) => String(doc.updatedAt || '')),
    ...input.opportunities.map((opp) => String(opp.updatedAt || '')),
  ].filter(Boolean)
  const mostRecent = timestamps.length ? timestamps.sort().reverse()[0] : null
  const engagement = scoreEngagement(mostRecent)

  const totalScore = onboarding.score + documents.score + pipeline.score + engagement.score

  return {
    onboardingScore: onboarding.score,
    documentScore: documents.score,
    pipelineScore: pipeline.score,
    engagementScore: engagement.score,
    totalScore,
    band: bandFor(totalScore),
    explanation: [onboarding.explanation, documents.explanation, pipeline.explanation, engagement.explanation],
  }
}
