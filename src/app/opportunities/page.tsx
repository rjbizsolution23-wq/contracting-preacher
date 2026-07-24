import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import OpportunitiesClient from './OpportunitiesClient'

export const metadata: Metadata = generateSEO({
  title: 'Federal Opportunity Finder — Contracts, Grants, SBIR/STTR & Award Intelligence',
  description:
    'Search the full federal opportunity stack in one place: SAM.gov contracts, Grants.gov, USAspending award history, SBIR.gov solicitations, and Federal Register notices.',
  keywords: ['federal contract search', 'SAM.gov opportunities search', 'grants.gov search', 'SBIR STTR search', 'federal register notices'],
  canonical: '/opportunities',
})

export default function OpportunitiesPage() {
  return <OpportunitiesClient />
}
