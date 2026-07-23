import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { CITIES, CITY_DIRECTORIES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: '271 South Carolina Municipalities — City & Town Bid Portals',
  description:
    'South Carolina has 271 incorporated cities and towns. This vault lists direct bid pages for the municipalities that maintain one, plus statewide municipal directories for the rest.',
  keywords: ['south carolina city bids', 'municipal procurement south carolina', 'SC town RFP'],
  canonical: '/south-carolina-contracting-resources/cities',
})

export default function CitiesResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Cities', href: '/south-carolina-contracting-resources/cities' },
      ]} />

      <VaultHero
        eyebrow="271 Municipalities"
        title="South Carolina city and town bid portals."
        description="Not every municipality maintains a standalone procurement portal. This vault lists direct records for municipalities with an identified bid page, and statewide directories for the rest. For municipalities without a bid page, contact the clerk/administrator or finance office directly, and monitor SCBO and local legal-notice sources."
        stats={[{ value: `${CITIES.length}+`, label: 'Cities with direct bid pages' }, { value: '271', label: 'Total SC municipalities' }]}
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Direct Municipal Records"
            title="Municipalities with identified bid pages"
            description="Each municipality below is tracked individually — not shown as one generic directory link."
          />
          <ResourceVault resources={CITIES} filters={['trust']} compact />
        </div>
      </section>

      <section className="section-padding bg-brand-offWhite">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Everything Else"
            title="Statewide municipal coverage"
            description="For the 200+ municipalities without an identified standalone bid page, use these statewide resources: official website, clerk/administrator contact, finance or purchasing contact, SCBO search, public notices page, and local legal-notice source."
          />
          <ResourceVault resources={CITY_DIRECTORIES} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
