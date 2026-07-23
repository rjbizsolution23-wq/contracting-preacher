import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import {
  COMPLIANCE_POLICY_CHECKLIST,
  CONTRACT_DOCUMENT_CHECKLIST,
  CORPORATE_DOCUMENT_CHECKLIST,
  INSURANCE_CHECKLIST,
} from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Legal, Compliance & Risk Information | Business Funding Command Center',
  description: 'Corporate documents, contracts, insurance, and compliance policies needed across every funding lane, kept current and ready for due diligence.',
  canonical: '/command-center/legal-compliance',
})

export default function LegalCompliancePage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Legal & Compliance', href: '/command-center/legal-compliance' }]} />
      <CCHero
        eyebrow="Section 13 · Legal, Compliance and Risk"
        title="Due diligence moves fast when these documents are already organized."
        description="Contracts, insurance, and compliance policy documentation are requested in nearly every funding lane \u2014 government, investor, sponsor, and lender diligence alike."
      />
      <CCSubNav />
      <section className="container-custom grid gap-6 py-12">
        <FieldChecklist title="Corporate" items={CORPORATE_DOCUMENT_CHECKLIST} columns={2} />
        <FieldChecklist title="Contracts" items={CONTRACT_DOCUMENT_CHECKLIST} columns={2} />
        <FieldChecklist title="Insurance" items={INSURANCE_CHECKLIST} columns={2} />
        <FieldChecklist title="Compliance" items={COMPLIANCE_POLICY_CHECKLIST} columns={2} />
      </section>
    </div>
  )
}
