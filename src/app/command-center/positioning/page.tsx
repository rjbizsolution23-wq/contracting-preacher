import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  COMPETITIVE_ANALYSIS_FIELDS,
  PROBLEM_STATEMENT_QUESTIONS,
  SOLUTION_STATEMENT_QUESTIONS,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Problem, Solution & Competitive Positioning | Business Funding Command Center',
  description: 'One approved truth set from which every narrative is generated: problem statement, solution statement, and competitive analysis for five or more competitors.',
  canonical: '/command-center/positioning',
})

export default function PositioningPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Positioning', href: '/command-center/positioning' }]} />
      <CCHero
        eyebrow="Section 4 · Problem, Solution & Competitive Positioning"
        title="One approved truth set. Every narrative draws from it."
        description="The AI drafts narratives from this truth set only \u2014 it never invents claims about the problem, the solution, or the competition."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Problem statement" items={PROBLEM_STATEMENT_QUESTIONS} columns={1} />
        <FieldChecklist title="Solution statement" items={SOLUTION_STATEMENT_QUESTIONS} columns={1} />
        <FieldChecklist title="Competitive analysis (5+ competitors)" items={COMPETITIVE_ANALYSIS_FIELDS} columns={2} />
      </section>
    </div>
  )
}
