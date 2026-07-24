import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import PortalClient from './PortalClient'

export const metadata: Metadata = generateSEO({
  title: 'Client Portal — Contracting Roadmap, Documents & Opportunity Watchlist',
  description:
    'Review your federal contracting plan, track required documents, watch matching opportunities, and see the next steps your business should complete.',
  noIndex: true,
  canonical: '/portal',
})

export default function PortalPage() {
  return <PortalClient />
}
