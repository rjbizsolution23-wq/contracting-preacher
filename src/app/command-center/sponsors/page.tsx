import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  SPONSORSHIP_PACKAGE_FIELDS,
  SPONSORSHIP_PROFILE_FIELDS,
  SPONSOR_INVENTORY_ITEMS,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Sponsorship Readiness | Business Funding Command Center',
  description: 'Sponsors buy access, alignment, and measurable exposure \u2014 not vague goodwill. Build a sponsorship profile, inventory, and tiered packages that prove it.',
  canonical: '/command-center/sponsors',
})

export default function SponsorsPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Sponsors', href: '/command-center/sponsors' }]} />
      <CCHero
        eyebrow="Section 11 · Sponsorship Readiness"
        title="Sponsors buy access, alignment, and measurable exposure \u2014 not vague goodwill."
        description="A strong sponsorship profile quantifies audience, reach, and impact, then packages inventory into tiers with clear deliverables, exclusivity, and reporting."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Sponsorship profile" items={SPONSORSHIP_PROFILE_FIELDS} columns={2} />
        <FieldChecklist title="Sponsor inventory" items={SPONSOR_INVENTORY_ITEMS} columns={2} />
        <FieldChecklist title="Sponsorship package (per tier)" items={SPONSORSHIP_PACKAGE_FIELDS} columns={2} />
      </section>
    </div>
  )
}
