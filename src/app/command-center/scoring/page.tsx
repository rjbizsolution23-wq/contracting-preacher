import type { Metadata } from 'next'
import { ShieldAlert } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import ScoringCalculator from '@/components/commandCenter/ScoringCalculator'
import {
  DECISION_BANDS,
  FIT_SCORE_FACTORS,
  FIT_SCORE_TOTAL,
  HARD_DISQUALIFIERS,
  OPPORTUNITY_TYPES,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'AI Opportunity-Scoring Engine | Business Funding Command Center',
  description: 'Hard disqualifiers, a 9-factor weighted fit score out of 100, and decision bands from priority pursuit to reject \u2014 with a live calculator.',
  canonical: '/command-center/scoring',
})

const BAND_TONE: Record<string, string> = {
  'priority-pursuit': 'bg-green-100 text-green-800',
  'strong-pursuit': 'bg-green-100 text-green-800',
  'pursue-with-partner': 'bg-yellow-100 text-yellow-800',
  monitor: 'bg-yellow-100 text-yellow-800',
  'no-bid': 'bg-gray-200 text-gray-700',
  reject: 'bg-red-100 text-red-800',
}

export default function ScoringPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Scoring Engine', href: '/command-center/scoring' }]} />
      <CCHero
        eyebrow="Section 15 · AI Opportunity-Scoring Engine"
        title="Hard disqualifiers first. Then a weighted, evidence-based fit score."
        description="Any hard disqualifier means reject, regardless of score. Otherwise, nine weighted factors produce a score out of 100 and a clear decision band."
        stats={[{ label: 'Hard disqualifiers', value: String(HARD_DISQUALIFIERS.length) }, { label: 'Weighted factors', value: String(FIT_SCORE_FACTORS.length) }, { label: 'Max score', value: String(FIT_SCORE_TOTAL) }]}
      />
      <CCSubNav />

      <section className="container-custom grid gap-8 py-12 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h3 className="flex items-center gap-2 font-accent text-lg font-bold text-red-900">
              <ShieldAlert className="h-5 w-5" /> Hard disqualifiers (automatic reject)
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-red-900">
              {HARD_DISQUALIFIERS.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-accent text-lg font-bold text-brand-navy">Weighted fit score (100 total)</h3>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Factor</th>
                  <th className="py-2 text-right">Weight</th>
                </tr>
              </thead>
              <tbody>
                {FIT_SCORE_FACTORS.map((factor) => (
                  <tr key={factor.key} className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">{factor.factor}</td>
                    <td className="py-2 text-right font-bold text-brand-navy">{factor.weight}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 font-bold text-brand-navy">Total</td>
                  <td className="py-2 text-right font-bold text-brand-gold">{FIT_SCORE_TOTAL}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-accent text-lg font-bold text-brand-navy">Decision bands</h3>
            <div className="mt-4 space-y-2">
              {DECISION_BANDS.map((band) => (
                <div key={band.label} className="flex items-center justify-between gap-3 rounded-lg bg-brand-offWhite p-3 text-sm">
                  <span className="font-bold text-brand-navy">{band.range}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${BAND_TONE[band.tone] || ''}`}>{band.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-accent text-lg font-bold text-brand-navy">Separate scoring models by opportunity type</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {OPPORTUNITY_TYPES.map((type) => (
                <span key={type.key} className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold uppercase text-brand-darkGold">{type.label}</span>
              ))}
            </div>
          </div>
        </div>

        <ScoringCalculator />
      </section>
    </div>
  )
}
