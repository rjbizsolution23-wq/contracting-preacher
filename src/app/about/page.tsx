import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CTASection from '@/components/home/CTASection'
import AboutContent from './AboutContent'

export const metadata: Metadata = generateSEO({
  title: 'About Dr. McKnight',
  description:
    'Meet Dr. McKnight, a faith-driven federal contracting consultant helping small businesses nationwide navigate SAM.gov registration, SBA certifications, and proposal writing.',
  keywords: [
    'Dr. McKnight',
    'the contracting preacher about',
    'federal contracting consultant South Carolina',
    'government contracting expert',
  ],
  canonical: '/about',
})

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />
      <AboutContent />
      <CTASection />
    </>
  )
}
