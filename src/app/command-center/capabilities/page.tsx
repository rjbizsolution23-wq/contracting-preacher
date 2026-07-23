import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  CONTRACTING_CAPABILITY_FIELDS,
  CORE_OFFERING_FIELDS,
  GOVERNMENT_CLASSIFICATION_CODES,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Business Capabilities Profile | Business Funding Command Center',
  description: 'Core offering fields, government classification codes (NAICS/PSC/FSC/NIGP/UNSPSC/SIC), and contracting capability metrics the AI needs to match opportunities accurately.',
  canonical: '/command-center/capabilities',
})

export default function CapabilitiesPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Capabilities', href: '/command-center/capabilities' }]} />
      <CCHero
        eyebrow="Section 3 · Business Capabilities"
        title="A precise picture of what the business can actually deliver."
        description="Accurate capability data is what lets the AI match real opportunities instead of guessing. Vague claims produce weak matches; specific, evidence-backed capabilities produce strong ones."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Core offering (per product or service)" items={CORE_OFFERING_FIELDS} columns={2} />
        <FieldChecklist title="Government classification codes" items={GOVERNMENT_CLASSIFICATION_CODES} columns={2} />
        <FieldChecklist title="Contracting capability" items={CONTRACTING_CAPABILITY_FIELDS} columns={2} />
      </section>
    </div>
  )
}
