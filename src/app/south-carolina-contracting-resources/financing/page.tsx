import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import { FINANCING_RESOURCES } from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'Bonding & Contract Financing for South Carolina Contractors',
  description:
    'SBA Surety Bond Guarantee program for bid, payment, and performance bonds, plus South Carolina financing resources: SC SSBCI, SC Capital Access Program, certified SC CDFIs, and community loan funds.',
  canonical: '/south-carolina-contracting-resources/financing',
})

export default function FinancingResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' },
        { label: 'Financing', href: '/south-carolina-contracting-resources/financing' },
      ]} />

      <VaultHero
        eyebrow="Bonding & Financing"
        title="Bid, payment, and performance bonds — and working capital."
        description="The SBA Surety Bond Guarantee program helps qualifying small businesses obtain bonding. South Carolina-specific financing programs help cover the working-capital gap between award and payment."
      />
      <VaultSubNav />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Bonding & Financing"
            title="Surety bonds and South Carolina financing programs"
          />
          <ResourceVault resources={FINANCING_RESOURCES} filters={['trust']} compact />
        </div>
      </section>

      <CTASection />
    </>
  )
}
