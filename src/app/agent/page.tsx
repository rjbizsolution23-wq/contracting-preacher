import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import AgentClient from './AgentClient'

export const metadata: Metadata = generateSEO({
  title: 'AI Contracting Assistant — Search Federal Opportunities in Plain Language',
  description:
    'Ask the AI contracting assistant for federal contracts, grants, SBIR/STTR funding, agency notices, and award history. Get plain-language next steps for winning government work.',
  keywords: ['federal contracting AI assistant', 'government contract search AI', 'grants search assistant', 'SBIR search tool'],
  canonical: '/agent',
})

export default function AgentPage() {
  return <AgentClient />
}
