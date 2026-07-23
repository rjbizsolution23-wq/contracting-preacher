import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { FEDERAL_RESOURCES, SC_CERTIFICATIONS } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'Federal & South Carolina Contracting Certifications',
  description:
    '8(a), HUBZone, WOSB, EDWOSB, VOSB, SDVOSB, and Small Disadvantaged Business federal certifications, plus South Carolina MBE certification and SCDOT DBE/SBE certification for transportation contracting.',
  keywords: ['8a certification south carolina', 'HUBZone south carolina', 'SC MBE certification', 'SCDOT DBE SBE'],
  canonical: '/south-carolina-contracting-resources/certifications',
})

export default function CertificationsResourcesPage() {
  const federalCertifications = FEDERAL_RESOURCES.filter((r) => r.level === 'certification-body')

  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Certifications', href: '/south-carolina-contracting-resources/certifications' },
      ]} />

      <VaultHero
        eyebrow="Certifications"
        title="Federal and South Carolina contracting certifications."
        description="Applications through official SBA systems are free. A South Carolina MBE certification and an SCDOT DBE certification are not automatically interchangeable — each serves a different purpose and buyer."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Federal Certifications"
            title="8(a), HUBZone, WOSB, EDWOSB, VOSB, SDVOSB, SDB"
            description="Applications through official SBA systems (certifications.sba.gov, veterans.certify.sba.gov) are free."
          />
          <ResourceVault resources={federalCertifications} filters={['trust']} compact />
        </div>
      </section>

      <section className="section-padding bg-brand-offWhite">
        <div className="container-custom">
          <SectionHeading
            eyebrow="South Carolina Certifications"
            title="SC MBE and SCDOT DBE/SBE"
            description="South Carolina Commission for Minority Affairs administers state MBE certification; SCDOT administers DBE/SBE certification for federally assisted transportation work."
          />
          <ResourceVault resources={SC_CERTIFICATIONS} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
