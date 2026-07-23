import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  GRANT_BUDGET_FIELDS,
  GRANT_DOCUMENT_CHECKLIST,
  GRANT_ELIGIBILITY_FIELDS,
  GRANT_PROJECT_DESIGN_FIELDS,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Grant Readiness | Business Funding Command Center',
  description: 'Eligibility, project design, grant budget, and required grant documents \u2014 the full grant-readiness profile the AI needs before drafting any application.',
  canonical: '/command-center/grants',
})

export default function GrantsPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Grants', href: '/command-center/grants' }]} />
      <CCHero
        eyebrow="Section 8 · Grant-Readiness Information"
        title="Federal grant applicants generally need active SAM.gov registration and a UEI before applying."
        description="Grants.gov submission requires an Authorized Organizational Representative (AOR) role. Final certifications and legally binding submissions stay behind an owner/AOR approval gate."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Eligibility" items={GRANT_ELIGIBILITY_FIELDS} columns={2} />
        <FieldChecklist title="Project design" items={GRANT_PROJECT_DESIGN_FIELDS} columns={2} />
        <FieldChecklist title="Grant budget" items={GRANT_BUDGET_FIELDS} columns={2} />
        <FieldChecklist title="Grant documents" items={GRANT_DOCUMENT_CHECKLIST} columns={2} />
        <div className="rounded-lg bg-brand-navy p-6 text-sm leading-6 text-gray-200">
          <a
            href="https://www.grants.gov/applicants/applicant-registration"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-brand-gold hover:underline"
          >
            Grants.gov Applicant Registration <ExternalLink className="h-4 w-4" />
          </a>
          <span className="ml-2">confirms organizations need SAM/UEI registration, and authorized organization roles control submission.</span>
        </div>
        <Link href="/command-center/scoring" className="btn-navy w-fit">Score a grant opportunity</Link>
      </section>
    </div>
  )
}
