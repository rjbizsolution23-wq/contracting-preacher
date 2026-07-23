import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { FEDERAL_RESOURCES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'Federal Contracting Resources for South Carolina Businesses',
  description:
    'SAM.gov registration, contract opportunities, award intelligence, wage determinations, federal certifications, and South Carolina federal installations: Savannah River Site, Joint Base Charleston, Fort Jackson, Shaw AFB, MCRD Parris Island, MCAS Beaufort, and USACE Charleston District.',
  canonical: '/south-carolina-contracting-resources/federal',
})

export default function FederalResourcesPage() {
  const installations = FEDERAL_RESOURCES.filter((r) => r.level === 'federal-installation')
  const nonInstallations = FEDERAL_RESOURCES.filter((r) => r.level !== 'federal-installation')

  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Federal', href: '/south-carolina-contracting-resources/federal' },
      ]} />

      <VaultHero
        eyebrow="Federal Contracting"
        title="SAM.gov, certifications, award intelligence, and South Carolina federal installations."
        description="SAM.gov registration is free and mandatory before bidding on any federal contract. This section also tracks federal certifications and the South Carolina-specific federal installations that run their own local purchasing activity: Savannah River Site, Joint Base Charleston, Fort Jackson, Shaw AFB, MCRD Parris Island, MCAS Beaufort, and USACE Charleston District."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Registration, Eligibility & Award Intelligence"
            title="Federal contracting resources"
            description="Registration, wage determinations, and award research — plus SBA certifications relevant to federal set-asides."
          />
          <ResourceVault resources={nonInstallations} filters={['trust']} compact />
        </div>
      </section>

      <section className="section-padding bg-brand-offWhite">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Local Federal Buyers"
            title="South Carolina federal installations"
            description="These installations run South Carolina-specific purchasing activity separate from the general SAM.gov listings."
          />
          <ResourceVault resources={installations} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
