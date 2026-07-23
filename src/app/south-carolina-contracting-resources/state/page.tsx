import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { STATE_RESOURCES, FREE_ASSISTANCE } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina Statewide Procurement — SCEIS, SCBO & Term Contracts',
  description:
    'Vendor registration, South Carolina Business Opportunities (SCBO), statewide term contracts, Office of State Engineer construction procurement, and procurement law/protest resources for South Carolina state government.',
  canonical: '/south-carolina-contracting-resources/state',
})

export default function StateResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'State', href: '/south-carolina-contracting-resources/state' },
      ]} />

      <VaultHero
        eyebrow="South Carolina State Government"
        title="SCEIS, SCBO, statewide term contracts, and state construction procurement."
        description="A vendor must generally register through SCEIS to submit state offers and receive payment. SCBO advertises solicitations for supplies, services, IT, construction, and professional services across state agencies, colleges, and participating local entities."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Statewide Procurement"
            title="Vendor registration, solicitations, term contracts, and construction"
            description="Registration, solicitation search, statewide contract research, and procurement-law resources."
          />
          <ResourceVault resources={STATE_RESOURCES} filters={['trust']} compact />
        </div>
      </section>

      <section className="section-padding bg-brand-offWhite">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Free Help"
            title="Free assistance for South Carolina contractors"
            description="SC APEX Accelerator, SC SBDC, SBA South Carolina, SCORE, SC Commerce, and manufacturing assistance."
          />
          <ResourceVault resources={FREE_ASSISTANCE} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
