import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import { AI_DELIVERABLES, REQUIRED_APPROVAL_GATES, WORKFLOW_STEPS } from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'End-to-End AI Workflow & Approval Gates | Business Funding Command Center',
  description: 'The full pipeline from business intake to business-memory update, with the required owner/AOR approval gates before anything legally binding is submitted.',
  canonical: '/command-center/workflow',
})

export default function WorkflowPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'AI Workflow', href: '/command-center/workflow' }]} />
      <CCHero
        eyebrow="Section 16-17 · End-to-End AI Workflow"
        title="Every step from intake to award, with a human in the loop where it matters."
        description="The AI runs search, verification, scoring, and drafting. A human or authorized representative approves anything legally binding before submission."
        stats={[{ label: 'Pipeline steps', value: String(WORKFLOW_STEPS.length) }, { label: 'Required approval gates', value: String(REQUIRED_APPROVAL_GATES.length) }]}
      />
      <CCSubNav />

      <section className="container-custom py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-accent text-2xl font-bold text-brand-navy">The pipeline</h2>
          <ol className="mt-6 space-y-2">
            {WORKFLOW_STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-4 rounded-lg bg-brand-offWhite p-4 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">{index + 1}</span>
                <span className="font-bold text-brand-navy">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-custom pb-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="font-accent text-2xl font-bold text-red-900">Required owner/AOR approval gates</h2>
          <p className="mt-2 text-sm text-red-900">
            The AI must not complete these on the business owner&apos;s behalf without an explicit, recorded approval.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REQUIRED_APPROVAL_GATES.map((gate) => (
              <div key={gate.key} className="rounded-lg bg-white p-4 text-sm font-bold text-red-900">{gate.label}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom pb-16">
        <h2 className="mb-6 font-accent text-2xl font-bold text-brand-navy">What the AI should generate, once the profile is verified</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(AI_DELIVERABLES).map(([category, items]) => (
            <div key={category} className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-accent font-bold text-brand-navy">{category}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
