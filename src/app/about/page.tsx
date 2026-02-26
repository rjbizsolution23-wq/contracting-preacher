import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CTASection from '@/components/home/CTASection'
import AboutContent from './AboutContent'

export const metadata: Metadata = generateSEO({
  title: 'About Pastor McKnight — The Contracting Preacher',
  description:
    'Meet Pastor McKnight, the licensed preacher and federal contracting expert helping small businesses win government contracts from South Carolina. 15+ years experience, 89% win rate, $50M+ in contracts won.',
  keywords: [
    'Pastor McKnight',
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
