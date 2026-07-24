import type { Metadata } from 'next'
import { ExternalLink, ShieldAlert } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  INVESTOR_COMPANY_INFO_FIELDS,
  INVESTOR_DOCUMENT_CHECKLIST,
  INVESTOR_NARRATIVE_FIELDS,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'VC & Angel Investment Readiness | Business Funding Command Center',
  description: 'Company information, investor narrative, and investor documents \u2014 with a clear securities-law disclaimer before soliciting any investment.',
  canonical: '/command-center/investors',
})

export default function InvestorsPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Investors', href: '/command-center/investors' }]} />
      <CCHero
        eyebrow="Section 10 · VC and Angel-Investment Readiness"
        title="Investors evaluate team, validation, progress, and market potential."
        description="Raising money from investors can constitute an offer or sale of securities. The company must use an applicable registration exemption or registered offering path and should involve qualified securities counsel before soliciting investment."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <div className="flex gap-3 rounded-lg border border-brand-maroon/30 bg-brand-maroon/5 p-5 text-sm text-brand-darkMaroon">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>
            The AI drafts investor materials and target-investor research \u2014 it does not provide
            legal advice on securities exemptions and does not solicit on the company&apos;s behalf.
            Consult qualified securities counsel before any offering.
          </span>
        </div>
        <FieldChecklist title="Company information" items={INVESTOR_COMPANY_INFO_FIELDS} columns={2} />
        <FieldChecklist title="Investor narrative" items={INVESTOR_NARRATIVE_FIELDS} columns={2} />
        <FieldChecklist title="Investor documents" items={INVESTOR_DOCUMENT_CHECKLIST} columns={2} />
        <div className="rounded-lg bg-brand-navy p-6 text-sm leading-6 text-gray-200">
          <a
            href="https://www.sec.gov/resources-small-businesses/smallbiz-essentials-what-pathways-are-available-raise-capital-investors"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-brand-gold hover:underline"
          >
            SEC: Capital-Raising Pathways <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
