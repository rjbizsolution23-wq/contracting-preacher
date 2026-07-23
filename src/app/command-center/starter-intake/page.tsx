import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldAlert } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import StarterIntakeClient from './StarterIntakeClient'
import { INTAKE_EXCLUSIONS, LAUNCH_REQUIREMENTS } from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Copy-and-Complete Starter Intake | Business Funding Command Center',
  description: 'A plain-text fillable template that captures everything needed to start searching for contracts, grants, investors, sponsors, and loans \u2014 without passwords, SSNs, or banking credentials.',
  canonical: '/command-center/starter-intake',
})

export default function StarterIntakePage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Starter Intake', href: '/command-center/starter-intake' }]} />
      <CCHero
        eyebrow="Section 19-20 · Starter Intake & Launch Requirements"
        title="Send this first."
        description="Copy the template below, fill it out, and send it back. Do not include passwords, bank account numbers, full SSNs, or MFA codes."
      />
      <CCSubNav />

      <section className="container-custom grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <StarterIntakeClient />

        <aside className="space-y-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h3 className="flex items-center gap-2 font-accent text-lg font-bold text-red-900">
              <ShieldAlert className="h-5 w-5" /> Never include
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-red-900">
              {INTAKE_EXCLUSIONS.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="rounded-lg bg-brand-navy p-6 text-white">
            <h3 className="font-accent text-lg font-bold">Immediate launch requirements</h3>
            <ol className="mt-4 space-y-2 text-sm text-gray-200">
              {LAUNCH_REQUIREMENTS.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-navy">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <Link href="/command-center/intake" className="btn-primary w-full text-center">
            Prefer a guided form? Start the intake wizard
            <ArrowRight className="ml-2 inline h-5 w-5" />
          </Link>
        </aside>
      </section>
    </div>
  )
}
