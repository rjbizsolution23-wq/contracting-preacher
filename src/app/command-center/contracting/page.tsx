import type { Metadata } from 'next'
import Link from 'next/link'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  BID_NO_BID_QUESTIONS,
  CONTRACT_ADMIN_DOCUMENT_CHECKLIST,
  PROPOSAL_CONTENT_LIBRARY_MODULES,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Government Contract Readiness | Business Funding Command Center',
  description: 'Administrative documents, a reusable proposal content library, and the 13-question bid/no-bid gate that protects time by chasing fit, not noise.',
  canonical: '/command-center/contracting',
})

export default function ContractingReadinessPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Contracting', href: '/command-center/contracting' }]} />
      <CCHero
        eyebrow="Section 9 · Government-Contract Readiness"
        title="No-bid weak opportunities early. Protect time. Chase fit, not noise."
        description="Before writing a word, the AI checks eligibility, mandatory requirements, past performance, licensing, financing, bonding, deadline realism, incumbent vulnerability, and profit justification."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Administrative documents" items={CONTRACT_ADMIN_DOCUMENT_CHECKLIST} columns={2} />
        <FieldChecklist title="Proposal content library (reusable, evidence-backed modules)" items={PROPOSAL_CONTENT_LIBRARY_MODULES} columns={2} />
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-accent text-lg font-bold text-brand-navy">Bid/no-bid criteria \u2014 13 questions before writing</h3>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {BID_NO_BID_QUESTIONS.map((question, index) => (
              <li key={question} className="flex gap-3 rounded-lg bg-brand-offWhite p-4 text-sm text-gray-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">{index + 1}</span>
                {question}
              </li>
            ))}
          </ol>
        </div>
        <Link href="/command-center/scoring" className="btn-navy w-fit">Run the bid/no-bid scoring engine</Link>
      </section>
    </div>
  )
}
