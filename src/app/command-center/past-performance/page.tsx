import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import { ACCEPTABLE_PAST_PERFORMANCE_EVIDENCE, PAST_PERFORMANCE_FIELDS } from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Past Performance Records | Business Funding Command Center',
  description: 'Past performance is one of the strongest government-contracting assets. Capture every engagement record with acceptable, verifiable evidence.',
  canonical: '/command-center/past-performance',
})

export default function PastPerformancePage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Past Performance', href: '/command-center/past-performance' }]} />
      <CCHero
        eyebrow="Section 6 · Past Performance"
        title="Past performance is one of the strongest government-contracting assets."
        description="Every completed or active engagement should be recorded with acceptable evidence. If government past performance is limited, comparable commercial experience can be translated honestly \u2014 never relabeled as federal experience."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Fields to capture per engagement" items={PAST_PERFORMANCE_FIELDS} columns={2} />
        <FieldChecklist title="Acceptable evidence" items={ACCEPTABLE_PAST_PERFORMANCE_EVIDENCE} columns={2} />
        <div className="flex gap-3 rounded-lg bg-yellow-50 p-5 text-sm text-yellow-900">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          The AI must not relabel commercial work as federal past performance, and must not invent
          outcomes, references, or ratings that are not backed by supporting evidence.
        </div>
      </section>
    </div>
  )
}
