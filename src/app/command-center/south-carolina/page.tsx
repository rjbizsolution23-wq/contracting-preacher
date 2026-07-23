import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import { SC_SPECIFIC_PROFILE_FIELDS } from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina Profile Addendum | Business Funding Command Center',
  description: 'Additional fields for South Carolina businesses: county, congressional district, HUBZone, SC MBE, SCDOT, SCEIS, and target SC agencies and installations. Free assistance through SC APEX and the SC SBDC.',
  canonical: '/command-center/south-carolina',
})

export default function SouthCarolinaProfilePage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'South Carolina', href: '/command-center/south-carolina' }]} />
      <CCHero
        eyebrow="Section 18 · South Carolina-Specific Profile"
        title="Extra fields that unlock SC-specific set-asides, incentives, and buyers."
        description="Free assistance is available through the SC APEX Accelerator and the South Carolina SBDC for any business working through this profile."
      />
      <CCSubNav />

      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="South Carolina profile fields" items={SC_SPECIFIC_PROFILE_FIELDS} columns={2} />

        <div className="grid gap-4 rounded-lg bg-brand-navy p-6 text-sm leading-6 text-gray-200 sm:grid-cols-2">
          <a href="https://scaccelerator.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-brand-gold hover:underline">
            SC APEX Accelerator <ExternalLink className="h-4 w-4" />
          </a>
          <a href="https://www.scsbdc.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-brand-gold hover:underline">
            South Carolina SBDC <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <Link href="/south-carolina-contracting-resources" className="btn-navy w-fit">
          Browse the full SC Contracting Resource Vault
        </Link>
      </section>
    </div>
  )
}
