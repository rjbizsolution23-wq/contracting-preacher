import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, ShieldAlert } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  CAPITAL_STACK_EXAMPLE,
  FUNDING_TYPE_TAXONOMY,
  HOUSING_CONTRACT_SEARCH_TERMS,
  HOUSING_DECISION_BANDS,
  HOUSING_MODULE_STATS,
  HOUSING_PARTNER_CATEGORIES,
  HOUSING_PROJECT_INTAKE_FIELDS,
  HOUSING_RED_FLAGS,
  HOUSING_SCORE_TOTAL,
  HOUSING_SCORING_FACTORS,
  MARCUS_CAN,
  MARCUS_MUST_NOT,
  RECOVERY_HOUSING_MODEL_DISTINCTIONS,
  SC_FUNDING_MATRIX,
  SC_HOUSING_AGENCIES,
  SC_PHA_RESEARCH_CHECKLIST,
} from '@/lib/housingIntel'

export const metadata: Metadata = generateSEO({
  title: 'Housing & Recovery Housing Intelligence (Marcus) | Business Funding Command Center',
  description: 'South Carolina affordable housing, sober living / recovery housing, HUD grants, and government housing contracts intelligence: agency directory, funding matrix, PHA/Section 8 checklist, opportunity scoring, and red-flag review.',
  canonical: '/command-center/housing-recovery',
})

export default function HousingRecoveryPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Housing & Recovery Housing', href: '/command-center/housing-recovery' }]} />
      <CCHero
        eyebrow="Marcus · Housing & Recovery Housing Intelligence"
        title="Affordable housing, sober living / recovery housing, HUD grants, and government housing contracts — South Carolina."
        description="A structured research framework for South Carolina housing, recovery-housing, and supportive-housing projects: real agencies with official sources, a funding-type taxonomy that never calls every dollar a grant, a PHA/Section 8 checklist, an opportunity-scoring model, and red-flag review before committing capture time."
        stats={HOUSING_MODULE_STATS}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/agent/housing" className="btn-primary">
            Ask Marcus (AI chat)
          </Link>
          <Link href="/command-center/scoring" className="btn-navy">
            General opportunity scoring engine
          </Link>
        </div>
      </CCHero>
      <CCSubNav />

      <section className="container-custom grid gap-6 py-12">
        <div className="rounded-lg border border-brand-gold/40 bg-brand-cream p-6 text-sm leading-6 text-gray-700">
          <p>
            This module is locked to Dr. McKnight&apos;s account. It is scoped to South Carolina — this is a
            converted, SC-specific build of the Marcus housing/recovery-housing research framework, and it does
            not include the separate Texas homeownership-qualification framework.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <FieldChecklist title="What Marcus can do" items={MARCUS_CAN} columns={1} />
          <div className="rounded-lg border border-brand-maroon/30 bg-brand-maroon/5 p-6">
            <h3 className="flex items-center gap-2 font-accent text-lg font-bold text-brand-darkMaroon">
              <ShieldAlert className="h-5 w-5" /> What Marcus must not do
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-darkMaroon">
              {MARCUS_MUST_NOT.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-accent text-lg font-bold text-brand-navy">South Carolina housing &amp; recovery-housing agencies</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SC_HOUSING_AGENCIES.map((agency) => (
              <a
                key={agency.url}
                href={agency.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-brand-gold"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-brand-navy group-hover:text-brand-gold">{agency.name}</span>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-gray-400 group-hover:text-brand-gold" />
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">{agency.role}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-accent text-lg font-bold text-brand-navy">Recovery residence vs. licensed treatment facility</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            These are legally distinct models with different certification/licensure paths and different funding
            streams. Never treat a sober-living / recovery residence as equivalent to a licensed treatment facility.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {RECOVERY_HOUSING_MODEL_DISTINCTIONS.map((group) => (
              <div key={group.title} className="rounded-lg bg-brand-offWhite p-4">
                <h4 className="font-bold text-brand-navy">{group.title}</h4>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-gray-600">
                  {group.fields.map((field) => <li key={field}>{field}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-accent text-lg font-bold text-brand-navy">South Carolina funding matrix</h3>
          <div className="mt-4 grid gap-4">
            {SC_FUNDING_MATRIX.map((category) => (
              <div key={category.category} className="rounded-lg bg-brand-offWhite p-4">
                <h4 className="font-bold text-brand-navy">{category.category}</h4>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-gray-600 sm:grid-cols-2">
                  {category.programs.map((program) => <li key={program}>{program}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-accent text-lg font-bold text-brand-navy">Funding-type taxonomy</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">Never call every dollar a &quot;grant.&quot; Confirm which of these applies before pricing a project.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FUNDING_TYPE_TAXONOMY.map((entry) => (
              <div key={entry.type} className="rounded-lg bg-brand-offWhite p-3 text-sm">
                <span className="font-bold text-brand-navy">{entry.type}: </span>
                <span className="text-gray-600">{entry.description}</span>
              </div>
            ))}
          </div>
        </div>

        <FieldChecklist title="South Carolina PHA / Section 8 research checklist" items={SC_PHA_RESEARCH_CHECKLIST} columns={2} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-accent text-lg font-bold text-brand-navy">Opportunity scoring (out of {HOUSING_SCORE_TOTAL})</h3>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Factor</th>
                  <th className="py-2 text-right">Weight</th>
                </tr>
              </thead>
              <tbody>
                {HOUSING_SCORING_FACTORS.map((factor) => (
                  <tr key={factor.factor} className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">{factor.factor}</td>
                    <td className="py-2 text-right font-bold text-brand-navy">{factor.weight}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 font-bold text-brand-navy">Total</td>
                  <td className="py-2 text-right font-bold text-brand-gold">{HOUSING_SCORE_TOTAL}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-accent text-lg font-bold text-brand-navy">Decision bands</h3>
            <div className="mt-4 space-y-2">
              {HOUSING_DECISION_BANDS.map((band) => (
                <div key={band.label} className="flex items-center justify-between gap-3 rounded-lg bg-brand-offWhite p-3 text-sm">
                  <span className="font-bold text-brand-navy">{band.range}</span>
                  <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold uppercase text-brand-darkGold">{band.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-brand-maroon/30 bg-brand-maroon/5 p-6">
          <h3 className="flex items-center gap-2 font-accent text-lg font-bold text-brand-darkMaroon">
            <ShieldAlert className="h-5 w-5" /> Red-flag requirements to surface (not automatic disqualifiers)
          </h3>
          <ul className="mt-4 grid gap-2 text-sm text-brand-darkMaroon sm:grid-cols-2">
            {HOUSING_RED_FLAGS.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-accent text-lg font-bold text-brand-navy">{CAPITAL_STACK_EXAMPLE.scenario}</h3>
          <div className="mt-4 grid gap-3">
            {CAPITAL_STACK_EXAMPLE.lineItems.map((line) => (
              <div key={line.item} className="rounded-lg bg-brand-offWhite p-3 text-sm">
                <span className="font-bold text-brand-navy">{line.item}: </span>
                <span className="text-gray-600">{line.note}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs italic leading-5 text-gray-500">{CAPITAL_STACK_EXAMPLE.disclaimer}</p>
        </div>

        <FieldChecklist title="Government housing/recovery-services contract search terms (South Carolina)" items={HOUSING_CONTRACT_SEARCH_TERMS} columns={2} />

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-accent text-lg font-bold text-brand-navy">Strategic partner categories</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {HOUSING_PARTNER_CATEGORIES.map((entry) => (
              <div key={entry.partner} className="rounded-lg bg-brand-offWhite p-3 text-sm">
                <span className="font-bold text-brand-navy">{entry.partner}: </span>
                <span className="text-gray-600">{entry.why}</span>
              </div>
            ))}
          </div>
        </div>

        <FieldChecklist title="Housing/recovery-housing project intake fields" items={HOUSING_PROJECT_INTAKE_FIELDS} columns={2} />

        <div className="rounded-lg bg-brand-navy p-6 text-sm leading-6 text-gray-200">
          <Link href="/agent/housing" className="btn-primary inline-flex">
            Ask Marcus for current South Carolina housing opportunities
          </Link>
        </div>
      </section>
    </div>
  )
}
