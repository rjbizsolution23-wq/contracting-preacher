import type { Metadata } from 'next'
import { LockKeyhole } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  FORECAST_FIELDS,
  FUNDING_REQUEST_FIELDS,
  HISTORICAL_FINANCIAL_FIELDS,
  OWNER_FINANCIAL_RESTRICTED_FIELDS,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Financial Information & Restricted Owner Vault | Business Funding Command Center',
  description: 'Historical financials, forecasts, and the funding request \u2014 plus a separate encrypted restricted vault for owner personal financial information (SBA Form 413, personal tax returns).',
  canonical: '/command-center/financials',
})

export default function FinancialsPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Financials', href: '/command-center/financials' }]} />
      <CCHero
        eyebrow="Section 7 · Financial Information"
        title="Business financials feed every lane. Owner financials stay in a restricted vault."
        description="Historical financials, forecasts, and a clear funding request unlock contracts, grants, loans, and investment. Owner personal financial data is handled separately and never in ordinary chat, email, or shared folders."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Historical financials (up to 3 years)" items={HISTORICAL_FINANCIAL_FIELDS} columns={2} />
        <FieldChecklist title="Forecasts" items={FORECAST_FIELDS} columns={2} />
        <FieldChecklist title="Funding request" items={FUNDING_REQUEST_FIELDS} columns={2} />
        <div className="rounded-lg border border-brand-maroon/30 bg-brand-maroon/5 p-6">
          <h3 className="flex items-center gap-2 font-accent text-lg font-bold text-brand-darkMaroon">
            <LockKeyhole className="h-5 w-5" /> Owner financial information \u2014 restricted vault only
          </h3>
          <p className="mt-2 text-sm text-brand-darkMaroon">
            Only collect when a specific application requires it. This belongs in an encrypted
            restricted vault \u2014 not in ordinary chat, email, or shared folders.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {OWNER_FINANCIAL_RESTRICTED_FIELDS.map((item) => (
              <li key={item} className="rounded bg-white p-3 text-sm text-brand-darkMaroon">{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
