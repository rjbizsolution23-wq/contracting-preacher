'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HelpCircle, RotateCcw, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { TOURS, getToursEnabled, setToursEnabled } from '@/lib/onboarding'

interface HelpMenuProps {
  /** Which tours to offer for replay from this button. Defaults to all tours. */
  tourIds?: string[]
}

/**
 * Floating "Help & walkthroughs" button. Lets a client or staff member:
 *  - Replay any guided walkthrough on demand (dispatches `tcp:start-tour`,
 *    which GuidedTour.tsx listens for).
 *  - Turn automatic first-visit walkthroughs on or off for this browser.
 *
 * Positioned bottom-left so it never collides with the bottom-right
 * ScrollToTop button.
 */
export default function HelpMenu({ tourIds }: HelpMenuProps) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true)
      setEnabled(getToursEnabled())
    }, 0)
    return () => clearTimeout(t)
  }, [])

  const ids = tourIds && tourIds.length ? tourIds : Object.keys(TOURS)
  const tours = ids.map((id) => TOURS[id]).filter((tour): tour is (typeof TOURS)[string] => Boolean(tour))

  const replay = (tourId: string) => {
    window.dispatchEvent(new CustomEvent('tcp:start-tour', { detail: { tourId } }))
    setOpen(false)
  }

  const toggleEnabled = () => {
    const next = !enabled
    setToursEnabled(next)
    setEnabled(next)
  }

  if (!mounted) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Help and walkthroughs"
        aria-expanded={open}
        className="fixed bottom-8 left-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-brand-gold shadow-lg transition-all duration-300 hover:bg-brand-darkNavy hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            role="dialog"
            aria-label="Help and walkthroughs"
            className="fixed bottom-24 left-8 z-50 w-80 rounded-xl border border-gray-200 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-accent text-base font-bold text-brand-navy">Help &amp; walkthroughs</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close help menu"
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-navy"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Replay a guided walkthrough of any screen, any time.
            </p>

            <ul className="mt-4 space-y-2">
              {tours.map((tour) => (
                <li key={tour.id}>
                  <button
                    type="button"
                    onClick={() => replay(tour.id)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left text-sm font-bold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold"
                  >
                    {tour.replayLabel}
                    <RotateCcw className="h-4 w-4 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <div>
                <p className="text-sm font-bold text-brand-navy">Auto-play walkthroughs</p>
                <p className="text-xs text-gray-500">
                  {enabled
                    ? 'On \u2014 shows once per screen automatically.'
                    : 'Off \u2014 use Replay above any time.'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleEnabled}
                aria-pressed={enabled}
                aria-label={enabled ? 'Turn off automatic walkthroughs' : 'Turn on automatic walkthroughs'}
                className="shrink-0 text-brand-gold"
              >
                {enabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8 text-gray-300" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
