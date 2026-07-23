import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { HOUSING_RESOURCES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina Housing Authority Procurement Resources',
  description:
    'SC Housing procurement opportunities plus local public housing authority procurement pages for Columbia, Florence, Rock Hill, Spartanburg, and Union — with HUD-funded authorities across the state to track.',
  canonical: '/south-carolina-contracting-resources/housing',
})

export default function HousingResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Housing', href: '/south-carolina-contracting-resources/housing' },
      ]} />

      <VaultHero
        eyebrow="Housing Authorities"
        title="South Carolina public housing authority procurement."
        description="SC Housing runs the statewide housing finance agency. Local public housing authorities across the state, many HUD-funded, also run independent procurement processes for Charleston, Greenville, North Charleston, Beaufort, Myrtle Beach, Sumter, and other service areas."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Housing Authorities"
            title="SC Housing and local authority procurement pages"
          />
          <ResourceVault resources={HOUSING_RESOURCES} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
