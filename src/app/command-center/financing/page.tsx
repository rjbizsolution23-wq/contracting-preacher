import type { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import { LOAN_READINESS_DOCUMENT_CHECKLIST } from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Loans & Financing Readiness | Business Funding Command Center',
  description: 'Lender-ready documents and the SBA Form 413 personal financial statement requirement, handled through an encrypted restricted vault.',
  canonical: '/command-center/financing',
})

export default function FinancingPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Financing', href: '/command-center/financing' }]} />
      <CCHero
        eyebrow="Section 12 · Loans and Financing"
        title="The SBA provides formal business-plan guidance and uses Form 413 for personal financial information."
        description="Loan readiness combines standard business financial documents with, in applicable programs, a personal financial statement from ownership \u2014 always handled through the encrypted restricted vault."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Loan-readiness documents" items={LOAN_READINESS_DOCUMENT_CHECKLIST} columns={2} />
        <div className="grid gap-3 rounded-lg bg-brand-navy p-6 text-sm leading-6 text-gray-200">
          <a href="https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-brand-gold hover:underline">
            SBA: Write Your Business Plan <ExternalLink className="h-4 w-4" />
          </a>
          <a href="https://www.sba.gov/document/sba-form-413-personal-financial-statement" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-brand-gold hover:underline">
            SBA Form 413 \u2014 Personal Financial Statement <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
