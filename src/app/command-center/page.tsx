import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Sparkles } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import TruthBanner from '@/components/commandCenter/TruthBanner'
import { COMMAND_CENTER_MODULES, LAUNCH_REQUIREMENTS, WORKFLOW_STEPS } from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Business Funding + Contracting AI Command Center',
  description:
    'A funding-ready business data room: one master profile that lets AI search grants, contracts, investors, sponsors, loans, accelerators, and partnerships, then score fit, draft applications, and track every deadline.',
  keywords: [
    'funding readiness', 'business data room', 'grant readiness', 'government contract readiness',
    'investor readiness', 'sponsorship readiness', 'opportunity scoring', 'bid no-bid', 'SC funding',
  ],
  canonical: '/command-center',
})

export default function CommandCenterPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }]} />
      <CCHero
        eyebrow="Business Funding + Contracting AI Command Center"
        title="One funding-ready business data room. Every opportunity lane, scored honestly."
        description="Enter verified information once. Reuse it across contracts, grants, SBIR/STTR, VC and angel investment, sponsorships, and loans \u2014 with an AI opportunity-scoring engine and a human/AOR approval gate before anything legally binding goes out the door."
        stats={[
          { label: 'Data room folders', value: '24' },
          { label: 'Fit-score factors', value: '9' },
          { label: 'Workflow steps', value: String(WORKFLOW_STEPS.length) },
          { label: 'Opportunity lanes', value: '8' },
        ]}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/command-center/intake" className="btn-primary">
            Start the intake
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/command-center/scoring" className="btn-navy">
            Try the scoring engine
          </Link>
        </div>
      </CCHero>

      <CCSubNav />

      <section className="container-custom py-10">
        <TruthBanner />
      </section>

      <section className="container-custom pb-12">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand-gold" />
          <h2 className="font-accent text-2xl font-bold text-brand-navy">Command center modules</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {COMMAND_CENTER_MODULES.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="font-accent text-lg font-bold text-brand-navy group-hover:text-brand-gold">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{module.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-blue group-hover:text-brand-gold">
                Open module <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-custom pb-16">
        <div className="rounded-lg bg-brand-navy p-8 text-white">
          <h2 className="font-accent text-2xl font-bold">Immediate launch requirements</h2>
          <p className="mt-2 max-w-3xl text-gray-300">
            To start searching without wasting time, we need these 12 items. Do not send passwords,
            SSNs, complete tax returns, or banking credentials in chat.
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {LAUNCH_REQUIREMENTS.map((item, index) => (
              <li key={item} className="flex gap-3 rounded-lg bg-white/10 p-4 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-navy">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
          <Link href="/command-center/starter-intake" className="btn-primary mt-6 inline-flex">
            Copy the starter intake template
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
