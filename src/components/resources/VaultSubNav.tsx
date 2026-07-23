'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const SUB_LINKS = [
  { href: '/south-carolina-contracting-resources', label: 'Overview' },
  { href: '/south-carolina-contracting-resources/federal', label: 'Federal' },
  { href: '/south-carolina-contracting-resources/state', label: 'State' },
  { href: '/south-carolina-contracting-resources/counties', label: 'Counties' },
  { href: '/south-carolina-contracting-resources/cities', label: 'Cities' },
  { href: '/south-carolina-contracting-resources/schools', label: 'Schools' },
  { href: '/south-carolina-contracting-resources/universities', label: 'Universities' },
  { href: '/south-carolina-contracting-resources/transportation', label: 'Transportation' },
  { href: '/south-carolina-contracting-resources/utilities', label: 'Utilities' },
  { href: '/south-carolina-contracting-resources/housing', label: 'Housing' },
  { href: '/south-carolina-contracting-resources/certifications', label: 'Certifications' },
  { href: '/south-carolina-contracting-resources/financing', label: 'Financing' },
  { href: '/south-carolina-contracting-resources/compliance', label: 'Compliance' },
]

export default function VaultSubNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="South Carolina resource vault sections" className="border-b border-gray-200 bg-white">
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
