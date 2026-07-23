import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { UNIVERSITY_RESOURCES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina Colleges & Universities Procurement Resources',
  description:
    'Procurement and supplier portals for the University of South Carolina, Clemson University, MUSC, College of Charleston, South Carolina State University, and the SC Technical College System.',
  canonical: '/south-carolina-contracting-resources/universities',
})

export default function UniversitiesResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Universities', href: '/south-carolina-contracting-resources/universities' },
      ]} />

      <VaultHero
        eyebrow="Higher Education"
        title="South Carolina college and university procurement."
        description="Public higher-education institutions run their own procurement and supplier portals, separate from state agency purchasing."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Colleges & Universities"
            title="Direct procurement and supplier portals"
          />
          <ResourceVault resources={UNIVERSITY_RESOURCES} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
