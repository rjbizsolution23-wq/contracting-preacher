import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { UTILITY_RESOURCES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina Utilities & Special-Purpose District Procurement',
  description:
    'Santee Cooper, Greenville Water, Charleston Water System, Grand Strand Water & Sewer Authority, private utility supplier programs (Dominion Energy, Duke Energy), and South Carolina special-purpose district directories.',
  canonical: '/south-carolina-contracting-resources/utilities',
})

export default function UtilitiesResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Utilities', href: '/south-carolina-contracting-resources/utilities' },
      ]} />

      <VaultHero
        eyebrow="Utilities & Special Districts"
        title="Water, sewer, power, and special-purpose district procurement."
        description="South Carolina has numerous water, fire, sewer, recreation, and service districts. Each can run its own procurement process. Private utilities like Dominion Energy and Duke Energy are not government agencies, but they create significant South Carolina supplier opportunities."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Utilities & Districts"
            title="State/regional utilities, private supplier programs, and special-purpose districts"
          />
          <ResourceVault resources={UTILITY_RESOURCES} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
