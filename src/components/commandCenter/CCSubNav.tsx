'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const SUB_LINKS = [
  { href: '/command-center', label: 'Overview' },
  { href: '/command-center/intake', label: 'Intake' },
  { href: '/command-center/capabilities', label: 'Capabilities' },
  { href: '/command-center/positioning', label: 'Positioning' },
  { href: '/command-center/market-evidence', label: 'Market Evidence' },
  { href: '/command-center/past-performance', label: 'Past Performance' },
  { href: '/command-center/financials', label: 'Financials' },
  { href: '/command-center/grants', label: 'Grants' },
  { href: '/command-center/contracting', label: 'Contracting' },
  { href: '/command-center/investors', label: 'Investors' },
  { href: '/command-center/sponsors', label: 'Sponsors' },
  { href: '/command-center/financing', label: 'Financing' },
  { href: '/command-center/legal-compliance', label: 'Legal & Compliance' },
  { href: '/command-center/data-room', label: 'Data Room' },
  { href: '/command-center/scoring', label: 'Scoring Engine' },
  { href: '/command-center/workflow', label: 'AI Workflow' },
  { href: '/command-center/south-carolina', label: 'South Carolina' },
  { href: '/command-center/starter-intake', label: 'Starter Intake' },
  { href: '/command-center/housing-recovery', label: 'Housing & Recovery' },
]

export default function CCSubNav() {
  const pathname = usePathname()

  return (
    <nav data-tour="cc-subnav" aria-label="Business Funding Command Center sections" className="border-b border-gray-200 bg-white">
      <div className="container-custom">
        <div className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:thin]">
          {SUB_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex-shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-colors',
                pathname === link.href
                  ? 'bg-brand-navy text-white'
                  : 'text-gray-600 hover:bg-brand-offWhite hover:text-brand-navy'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
