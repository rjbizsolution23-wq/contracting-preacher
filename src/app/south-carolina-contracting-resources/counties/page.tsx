import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { COUNTIES, COUNTY_DIRECTORY } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'All 46 South Carolina County Procurement Offices & Bid Portals',
  description:
    'Every South Carolina county government procurement office, bid portal, and contact — Abbeville to York. County solicitations do not always appear in SCBO, so each county needs its own tracked record.',
  keywords: ['south carolina county bids', 'county procurement south carolina', 'SC county RFP'],
  canonical: '/south-carolina-contracting-resources/counties',
})

export default function CountiesResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Counties', href: '/south-carolina-contracting-resources/counties' },
      ]} />

      <VaultHero
        eyebrow="All 46 Counties"
        title="Every South Carolina county procurement office, mapped."
        description="County solicitations do not always appear in SCBO. Many counties run their own bid portal — OpenGov, Bonfire, BidNet Direct, Vendor Registry, IonWave, BeaconBid, or a manually maintained bid page. This page tracks all 46."
        stats={[{ value: '46', label: 'Counties tracked' }]}
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="County Government"
            title="Search and filter all 46 counties"
            description="Filter by trust label to separate official county sites from government-adopted third-party portals, or find counties with no dedicated portal identified."
          />
          <ResourceVault resources={[...COUNTIES, COUNTY_DIRECTORY]} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
