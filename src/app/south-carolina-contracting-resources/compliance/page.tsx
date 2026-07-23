import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { COMPLIANCE_RESOURCES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina Business Compliance Resources for Contractors',
  description:
    'Business entity registration, SC Business One Stop, state tax registration, contractor and residential builder licensing, license verification, workers\u2019 compensation, and bonding/wage-determination guidance for South Carolina contractors.',
  canonical: '/south-carolina-contracting-resources/compliance',
})

export default function ComplianceResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Compliance', href: '/south-carolina-contracting-resources/compliance' },
      ]} />

      <VaultHero
        eyebrow="Compliance"
        title="What South Carolina contractors need before bidding."
        description="Before bidding, contractors may need some combination of business entity registration, state tax registration, contractor licensing, workers' compensation coverage, and bonding. Local business licenses may be required separately by cities and counties."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Business Compliance"
            title="Registration, licensing, and bonding requirements"
          />
          <ResourceVault resources={COMPLIANCE_RESOURCES} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
