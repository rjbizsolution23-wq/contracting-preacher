import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import CommandCenterIntakeClient from './CommandCenterIntakeClient'

export const metadata: Metadata = generateSEO({
  title: 'Business Funding Command Center — Master Intake',
  description:
    'The master business intake for the Funding + Contracting AI Command Center: entity details, registrations, NAICS codes, certifications, and readiness gaps in one profile.',
  keywords: ['business funding intake', 'government contract readiness intake', 'SAM registration status', 'grants.gov status'],
  canonical: '/command-center/intake',
})

export default function CommandCenterIntakePage() {
  return <CommandCenterIntakeClient />
}
