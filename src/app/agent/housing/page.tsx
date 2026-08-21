import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import HousingAgentClient from './HousingAgentClient'

export const metadata: Metadata = generateSEO({
  title: 'Marcus — AI Housing & Recovery Housing Agent (South Carolina)',
  description:
    'Ask Marcus, the AI agent for South Carolina affordable housing, sober living / recovery housing, HUD grants, and government housing contracts. Get funding matches, PHA/Section 8 checklists, opportunity scoring, and red-flag review.',
  keywords: ['South Carolina affordable housing AI agent', 'recovery housing funding search', 'HUD grants South Carolina', 'sober living funding South Carolina', 'SC PHA Section 8 voucher search'],
  canonical: '/agent/housing',
})

export default function HousingAgentPage() {
  return <HousingAgentClient />
}
