import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  GraduationCap,
  Landmark,
  Layers,
  MapPin,
  ShieldCheck,
  Ship,
  Wallet,
} from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import SectionHeading from '@/components/ui/SectionHeading'
import CTASection from '@/components/home/CTASection'
import VaultHero from '@/components/resources/VaultHero'
import VaultSubNav from '@/components/resources/VaultSubNav'
import ResourceVault from '@/components/resources/ResourceVault'
import {
  ALL_RESOURCES,
  ESSENTIAL_STACK,
  PLATFORMS,
  RESOURCE_STATS,
} from '@/lib/scResources'

export const metadata: Metadata = generateSEO({
  title: 'South Carolina Government Contracting Resource Vault',
  description:
    'A searchable procurement vault covering every South Carolina government buyer — 46 counties, 271 municipalities, state agencies, schools, universities, transportation, utilities, housing authorities, and federal installations — with bid portals, registration links, and certifications.',
  keywords: [
    'south carolina government contracting',
    'south carolina county bids',
    'south carolina city bids',
    'SCBO',
    'SC vendor registration',
    'SC procurement',
    'south carolina bid portal directory',
  ],
  canonical: '/south-carolina-contracting-resources',
})

const SECTIONS = [
  { href: '/south-carolina-contracting-resources/federal', icon: ShieldCheck, title: 'Federal', description: 'SAM.gov, certifications, wage determinations, SC federal installations.' },
  { href: '/south-carolina-contracting-resources/state', icon: Landmark, title: 'State', description: 'SCEIS, SCBO, statewide term contracts, construction, procurement law.' },
  { href: '/south-carolina-contracting-resources/counties', icon: MapPin, title: 'Counties', description: 'All 46 South Carolina county procurement offices and bid portals.' },
  { href: '/south-carolina-contracting-resources/cities', icon: Building2, title: 'Cities', description: '271 incorporated municipalities — direct bid pages plus statewide directories.' },
  { href: '/south-carolina-contracting-resources/schools', icon: GraduationCap, title: 'Schools', description: 'Public school district procurement across South Carolina.' },
  { href: '/south-carolina-contracting-resources/universities', icon: GraduationCap, title: 'Universities', description: 'USC, Clemson, MUSC, College of Charleston, SC State, and the technical college system.' },
  { href: '/south-carolina-contracting-resources/transportation', icon: Ship, title: 'Transportation', description: 'SCDOT, airports, the SC Ports Authority, and transit agencies.' },
  { href: '/south-carolina-contracting-resources/utilities', icon: Layers, title: 'Utilities', description: 'Water, sewer, power utilities, and special-purpose districts.' },
  { href: '/south-carolina-contracting-resources/housing', icon: Building2, title: 'Housing', description: 'SC Housing and local public housing authority procurement.' },
  { href: '/south-carolina-contracting-resources/certifications', icon: ShieldCheck, title: 'Certifications', description: '8(a), HUBZone, WOSB, SDVOSB, SC MBE, and SCDOT DBE/SBE.' },
  { href: '/south-carolina-contracting-resources/financing', icon: Wallet, title: 'Financing', description: 'SBA surety bonds, SC SSBCI, CDFIs, and community loan funds.' },
  { href: '/south-carolina-contracting-resources/compliance', icon: ShieldCheck, title: 'Compliance', description: 'Entity registration, tax accounts, contractor licensing, workers\u2019 comp.' },
]

export default function SouthCarolinaResourceVaultPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'South Carolina Contracting Resources', href: '/south-carolina-contracting-resources' }]} />

      <VaultHero
        eyebrow="South Carolina Government Contracting Resource Vault"
        title="Every South Carolina government buyer, bid portal, and certification — in one searchable vault."
        description="South Carolina has 46 counties, 271 incorporated cities and towns, dozens of state agencies, school districts, colleges, airports, ports, utilities, housing authorities, transit systems, and federal installations. No single official portal captures every opportunity. This vault tracks each buyer, its bid portal, registration system, certifications, and contact channel — verified July 23, 2026."
        stats={[
          { value: `${RESOURCE_STATS.totalResources}+`, label: 'Tracked resources' },
          { value: String(RESOURCE_STATS.counties), label: 'Counties mapped' },
          { value: `${RESOURCE_STATS.cities}+`, label: 'Cities with direct bid pages' },
          { value: String(RESOURCE_STATS.platforms), label: 'Bidding platforms monitored' },
        ]}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/free-consultation" className="btn-primary">
            Get Help Bidding
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/south-carolina-contracting-resources/counties" className="btn-secondary">
            Browse All 46 Counties
          </Link>
        </div>
      </VaultHero>

      <VaultSubNav />

      {/* Truth banner */}
      <section className="bg-yellow-50 border-b border-yellow-200">
        <div className="container-custom flex items-start gap-3 py-4 text-sm text-yellow-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>
            <strong>No static page can promise permanent, complete coverage.</strong> South Carolina procurement is fragmented
            across 46 counties, 271 municipalities, school districts, colleges, special-purpose districts, housing authorities,
            utilities, airports, and federal installations — each running its own systems. This vault is checked and updated on
            a rolling basis; always confirm registration requirements and deadlines on the official source before bidding.
          </p>
        </div>
      </section>

      {/* Section cards */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Browse by Buyer Type"
            title="Twelve categories. Every South Carolina government buyer."
            description="Jump straight to the level of government you're targeting, or search the full vault below."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="card-elevated p-6 group hover:border-brand-gold/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center mb-4">
                  <section.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-lg font-heading font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{section.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-gold">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Essential stack */}
      <section className="section-padding bg-brand-offWhite">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Start Here"
            title="The essential South Carolina contracting stack"
            description="These are the first resources every South Carolina contractor needs before touching a solicitation."
          />
          <ResourceVault resources={ESSENTIAL_STACK} filters={['trust']} compact />
        </div>
      </section>

      {/* Platforms */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Watch List"
            title="Procurement platforms contractors must monitor"
            description="South Carolina buyers use many disconnected e-procurement systems. Registering on one does not register you on the others."
          />
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-navy text-white">
                <tr>
                  <th className="px-4 py-3 font-bold">Platform</th>
                  <th className="px-4 py-3 font-bold">Known South Carolina Usage</th>
                  <th className="px-4 py-3 font-bold">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {PLATFORMS.map((row) => (
                  <tr key={row.platform}>
                    <td className="px-4 py-3 font-bold text-brand-navy">{row.platform}</td>
                    <td className="px-4 py-3 text-gray-600">{row.usage}</td>
                    <td className="px-4 py-3">
                      {row.url ? (
                        <a href={row.url} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-gold hover:underline">
                          Visit
                        </a>
                      ) : (
                        <span className="text-gray-400">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Full vault search */}
      <section className="section-padding bg-brand-offWhite">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Search Everything"
            title="Full resource vault"
            description={`Search across all ${RESOURCE_STATS.totalResources}+ tracked South Carolina government buyers, portals, and programs in one place.`}
          />
          <ResourceVault resources={ALL_RESOURCES} />
        </div>
      </section>

      <CTASection />
    </>
  )
}
