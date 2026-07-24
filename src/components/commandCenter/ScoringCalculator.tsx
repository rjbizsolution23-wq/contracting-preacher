'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, Loader2, ShieldAlert, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import { FIT_SCORE_FACTORS, OPPORTUNITY_TYPES } from '@/lib/commandCenter'

type DisqualifierKey =
  | 'applicantTypeEligible'
  | 'locationEligible'
  | 'requiredCertificationHeld'
  | 'samActiveThroughAward'
  | 'deadlineFeasible'
  | 'matchFundingAvailable'
  | 'requiredLicenseHeld'
  | 'conflictOfInterestClear'
  | 'requiredExperienceProvable'
  | 'wouldRequireFalseCertification'

type RequirementKey = 'requiredCertificationNeeded' | 'matchFundingRequired' | 'requiredLicenseNeeded'

const DISQUALIFIER_TOGGLES: Array<{ key: DisqualifierKey; label: string; invert?: boolean }> = [
  { key: 'applicantTypeEligible', label: 'Applicant type is eligible' },
  { key: 'locationEligible', label: 'Business location is eligible' },
  { key: 'samActiveThroughAward', label: 'SAM will be active through expected award' },
  { key: 'deadlineFeasible', label: 'Deadline is feasible' },
  { key: 'conflictOfInterestClear', label: 'No unresolved conflict of interest' },
  { key: 'requiredExperienceProvable', label: 'Required experience can be proven with evidence' },
  { key: 'wouldRequireFalseCertification', label: 'Submission would require a false certification', invert: true },
]

// Conditional requirements: the "needed/required" flag must be on before the matching
// "held/available" checkbox can trigger a hard disqualifier — mirrors the spec's logic
// that these three checks only apply "if required."
const CONDITIONAL_REQUIREMENTS: Array<{
  requiredKey: RequirementKey
  requiredLabel: string
  heldKey: DisqualifierKey
  heldLabel: string
}> = [
  {
    requiredKey: 'requiredCertificationNeeded',
    requiredLabel: 'A specific certification is required for this opportunity',
    heldKey: 'requiredCertificationHeld',
    heldLabel: 'That certification is currently held',
  },
  {
    requiredKey: 'matchFundingRequired',
    requiredLabel: 'Matching funds are required for this opportunity',
    heldKey: 'matchFundingAvailable',
    heldLabel: 'Matching funds are available',
  },
  {
    requiredKey: 'requiredLicenseNeeded',
    requiredLabel: 'A specific license is required for this opportunity',
    heldKey: 'requiredLicenseHeld',
    heldLabel: 'That license is currently held',
  },
]

type Result = {
  disqualifiers: string[]
  breakdown: Record<string, number>
  totalScore: number
  band: string
}

const BAND_LABELS: Record<string, string> = {
  'priority-pursuit': 'Priority pursuit (90-100)',
  'strong-pursuit': 'Strong pursuit (80-89)',
  'pursue-with-partner': 'Pursue with partner or gap plan (70-79)',
  monitor: 'Monitor (60-69)',
  'no-bid': 'No-bid (below 60)',
  reject: 'Reject (hard disqualifier)',
}

const BAND_TONE: Record<string, string> = {
  'priority-pursuit': 'bg-green-100 text-green-800',
  'strong-pursuit': 'bg-green-100 text-green-800',
  'pursue-with-partner': 'bg-yellow-100 text-yellow-800',
  monitor: 'bg-yellow-100 text-yellow-800',
  'no-bid': 'bg-gray-200 text-gray-700',
  reject: 'bg-brand-maroon/10 text-brand-darkMaroon',
}

export default function ScoringCalculator() {
  const [opportunityType, setOpportunityType] = useState<string>('government-contract')
  const [toggles, setToggles] = useState<Record<DisqualifierKey, boolean>>({
    applicantTypeEligible: true,
    locationEligible: true,
    requiredCertificationHeld: true,
    samActiveThroughAward: true,
    deadlineFeasible: true,
    matchFundingAvailable: true,
    requiredLicenseHeld: true,
    conflictOfInterestClear: true,
    requiredExperienceProvable: true,
    wouldRequireFalseCertification: false,
  })
  const [requirements, setRequirements] = useState<Record<RequirementKey, boolean>>({
    requiredCertificationNeeded: false,
    matchFundingRequired: false,
    requiredLicenseNeeded: false,
  })
  const [factors, setFactors] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    FIT_SCORE_FACTORS.forEach((f) => { initial[f.key] = 70 })
    return initial
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const factorKeys = useMemo(() => FIT_SCORE_FACTORS.map((f) => f.key), [])

  const run = async () => {
    setLoading(true)
    setError('')
    try {
      const payload: Record<string, unknown> = {
        opportunityType,
        ...toggles,
        ...requirements,
      }
      factorKeys.forEach((key) => {
        payload[`${key}Pct`] = factors[key]
      })

      const response = await fetch('/api/business/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to score opportunity right now.')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to score opportunity right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-brand-gold" />
        <h3 className="font-accent text-xl font-bold text-brand-navy">Live fit-score calculator</h3>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Move the sliders to reflect verified facts about a specific opportunity, then calculate the
        weighted fit score and decision band. This never invents facts \u2014 you supply the inputs.
      </p>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-bold text-brand-navy">Opportunity type</span>
        <select className="input-field" value={opportunityType} onChange={(event) => setOpportunityType(event.target.value)}>
          {OPPORTUNITY_TYPES.map((type) => (
            <option key={type.key} value={type.key}>{type.label}</option>
          ))}
        </select>
      </label>

      <div className="mt-6">
        <h4 className="font-accent text-sm font-bold uppercase text-brand-navy">Hard-disqualifier checks</h4>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DISQUALIFIER_TOGGLES.map((toggle) => (
            <label key={toggle.key} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={toggles[toggle.key]}
                onChange={(event) => setToggles((current) => ({ ...current, [toggle.key]: event.target.checked }))}
                className="h-4 w-4"
              />
              {toggle.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-accent text-sm font-bold uppercase text-brand-navy">Conditional requirements</h4>
        <p className="mt-1 text-xs text-gray-500">
          Only check &quot;required&quot; if this specific opportunity actually demands it — then confirm whether it is held.
        </p>
        <div className="mt-3 space-y-3">
          {CONDITIONAL_REQUIREMENTS.map((req) => (
            <div key={req.requiredKey} className="grid gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={requirements[req.requiredKey]}
                  onChange={(event) => setRequirements((current) => ({ ...current, [req.requiredKey]: event.target.checked }))}
                  className="h-4 w-4"
                />
                {req.requiredLabel}
              </label>
              <label className={`flex items-center gap-2 text-sm ${requirements[req.requiredKey] ? 'text-gray-700' : 'text-gray-400'}`}>
                <input
                  type="checkbox"
                  checked={toggles[req.heldKey]}
                  disabled={!requirements[req.requiredKey]}
                  onChange={(event) => setToggles((current) => ({ ...current, [req.heldKey]: event.target.checked }))}
                  className="h-4 w-4"
                />
                {req.heldLabel}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-accent text-sm font-bold uppercase text-brand-navy">Weighted factors (0-100%)</h4>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {FIT_SCORE_FACTORS.map((factor) => (
            <label key={factor.key} className="block">
              <span className="mb-1 flex justify-between text-xs font-bold text-gray-600">
                <span>{factor.factor} (weight {factor.weight})</span>
                <span>{factors[factor.key]}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={factors[factor.key]}
                onChange={(event) => setFactors((current) => ({ ...current, [factor.key]: Number(event.target.value) }))}
                className="w-full"
              />
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-5 flex gap-2 rounded-lg bg-brand-maroon/5 p-3 text-sm text-brand-darkMaroon">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <Button type="button" className="mt-6" onClick={run} loading={loading}>
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
        Calculate fit score
      </Button>

      {result && (
        <div className="mt-6 rounded-lg bg-brand-offWhite p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-3xl font-bold text-brand-navy">{result.totalScore}<span className="text-lg text-gray-500">/100</span></div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${BAND_TONE[result.band] || 'bg-gray-200 text-gray-700'}`}>
              {BAND_LABELS[result.band] || result.band}
            </span>
          </div>
          {result.disqualifiers.length > 0 && (
            <div className="mt-4 rounded-lg bg-brand-maroon/5 p-4 text-sm text-brand-darkMaroon">
              <div className="mb-2 flex items-center gap-2 font-bold"><ShieldAlert className="h-4 w-4" /> Hard disqualifiers triggered</div>
              <ul className="space-y-1">
                {result.disqualifiers.map((flag) => <li key={flag}>{flag}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div key={key} className="rounded bg-white p-3 text-xs">
                <div className="font-bold text-brand-navy">{key.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-gray-600">{value} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
