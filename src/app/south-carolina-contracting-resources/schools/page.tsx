import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { SCHOOL_RESOURCES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina School District Procurement Resources',
  description:
    'SC Department of Education procurement, statewide school and district directory, SCBO education opportunities, and major school district procurement pages including Charleston, Greenville, Berkeley, Fort Mill, Lee, Marion, and Union County.',
  canonical: '/south-carolina-contracting-resources/schools',
})

export default function SchoolsResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Schools', href: '/south-carolina-contracting-resources/schools' },
      ]} />

      <VaultHero
        eyebrow="K-12 Education"
        title="South Carolina public school district procurement."
        description="Statewide education resources plus direct procurement pages for major school districts. Most districts also advertise through SCBO."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="School Districts"
            title="Statewide resources and major district procurement pages"
          />
          <ResourceVault resources={SCHOOL_RESOURCES} filters={['county', 'trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
