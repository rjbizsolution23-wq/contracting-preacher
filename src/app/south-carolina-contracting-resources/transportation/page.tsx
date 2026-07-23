import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { TRANSPORTATION_RESOURCES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina Transportation, Ports & Airport Contracting',
  description:
    'SCDOT vendor registration and DBE/SBE certification, South Carolina airports (Columbia Metropolitan, Charleston International, and more), the SC Ports Authority, and transit agencies including CARTA, Coast RTA, and Pee Dee RTA.',
  canonical: '/south-carolina-contracting-resources/transportation',
})

export default function TransportationResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Transportation', href: '/south-carolina-contracting-resources/transportation' },
      ]} />

      <VaultHero
        eyebrow="Transportation, Ports & Airports"
        title="SCDOT, airports, ports, and transit agencies."
        description="SCDOT administers statewide DBE/SBE certification for federally assisted transportation work. Airports, the SC Ports Authority, and transit agencies each run separate procurement processes."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="SCDOT, Airports, Ports & Transit"
            title="Transportation contracting resources"
          />
          <ResourceVault resources={TRANSPORTATION_RESOURCES} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
