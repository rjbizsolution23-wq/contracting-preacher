import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** 'light' = for use on white/light backgrounds (gold shield, navy wordmark).
   *  'dark' = for use on navy/dark backgrounds (gold shield, cream/white wordmark). */
  variant?: 'light' | 'dark'
  /** Hide the wordmark and show only the shield mark (e.g. compact mobile contexts). */
  iconOnly?: boolean
  className?: string
  href?: string | null
}

/** Shield-and-cross mark shared across the header, footer, and brand collateral. */
export function ShieldMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="The Contracting Preacher shield mark"
    >
      <path
        d="M50 4 L88 16 V44 C88 68 72 84 50 92 C28 84 12 68 12 44 V16 Z"
        fill="#C9A84C"
      />
      <path d="M50 4 L88 16 V44 C88 68 72 84 50 92 Z" fill="#A68A3E" />
      <rect x="43" y="24" width="14" height="46" rx="2" fill="#0A1628" />
      <rect x="27" y="40" width="46" height="14" rx="2" fill="#0A1628" />
    </svg>
  )
}

/**
 * Brand logo lockup: shield mark + "Dr. McKnight / The Contracting Preacher" wordmark.
 * Matches the McKnight Brand Kit primary lockup. Renders as a link to home by default;
 * pass href={null} to render a non-link wrapper (e.g. inside a page's own <Link>).
 */
export default function Logo({ variant = 'light', iconOnly = false, className, href = '/' }: LogoProps) {
  const isDark = variant === 'dark'

  const content = (
    <>
      <div className="w-11 h-11 shrink-0">
        <ShieldMark className="w-full h-full" />
      </div>
      {!iconOnly && (
        <div className="hidden sm:block leading-tight">
          <div
            className={cn(
              'text-[10px] font-accent font-bold uppercase tracking-[0.15em]',
              isDark ? 'text-brand-gold/90' : 'text-brand-gold'
            )}
          >
            Dr. McKnight
          </div>
          <div
            className={cn(
              'text-xl font-heading font-bold leading-tight',
              isDark ? 'text-white' : 'text-brand-navy'
            )}
          >
            The Contracting Preacher
          </div>
        </div>
      )}
    </>
  )

  const wrapperClass = cn('flex items-center gap-3 group', className)

  if (href === null) {
    return <div className={wrapperClass}>{content}</div>
  }

  return (
    <Link href={href} className={wrapperClass} aria-label="The Contracting Preacher - Home">
      {content}
    </Link>
  )
}
