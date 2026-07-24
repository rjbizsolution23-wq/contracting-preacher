import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import IntakeClient from './IntakeClient'

export const metadata: Metadata = generateSEO({
  title: 'Client Intake — Start Your Federal Contracting Roadmap',
  description:
    'Give Dr. McKnight the facts before the strategy call. This intake form feeds the admin CRM, readiness score, certification fit review, and your first 12-month roadmap draft.',
  canonical: '/intake',
})

export default function IntakePage() {
  return <IntakeClient />
}
