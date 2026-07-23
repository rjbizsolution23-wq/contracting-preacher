import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import { MARKET_EVIDENCE_FIELDS, TARGET_CUSTOMER_TYPES } from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Customer & Market Evidence | Business Funding Command Center',
  description: 'Target customer types and market evidence metrics investors, accelerators, and grant reviewers use to evaluate traction and demand.',
  canonical: '/command-center/market-evidence',
})

export default function MarketEvidencePage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Market Evidence', href: '/command-center/market-evidence' }]} />
      <CCHero
        eyebrow="Section 5 · Customer & Market Evidence"
        title="VCs, accelerators, and grant reviewers evaluate proof \u2014 not just the idea."
        description="Investors evaluate team, validation, progress, and market potential. Grant reviewers evaluate need and evidence. This section captures the proof points both require."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Target customer types" items={TARGET_CUSTOMER_TYPES} columns={2} />
        <FieldChecklist title="Market evidence metrics" items={MARKET_EVIDENCE_FIELDS} columns={3} />
      </section>
    </div>
  )
}
