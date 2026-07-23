import { json, options } from '../../_shared/http'
import { OpportunityScoreInput, scoreOpportunity } from '../../_shared/dataRoom'

export const onRequestPost: PagesFunction = async ({ request }) => {
  const input: OpportunityScoreInput = await request.json().catch(() => ({} as OpportunityScoreInput))

  if (!input || typeof input !== 'object' || !input.opportunityType) {
    return json({ error: 'opportunityType is required.' }, { status: 400 })
  }

  const result = scoreOpportunity(input)

  return json({
    ...result,
    disclaimer: 'This score reflects the inputs you supplied. It does not verify eligibility, certifications, or SAM status against official sources, and it never invents facts about the business.',
  })
}

export const onRequestOptions: PagesFunction = async () => options()
