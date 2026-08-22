'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import {
  TOURS,
  getSeenTours,
  getToursEnabled,
  markTourSeen,
  prefersReducedMotion,
  setToursEnabled,
} from '@/lib/onboarding'

interface GuidedTourProps {
  /** Which tour from TOURS to run on this page. */
  tourId: string
}

type Rect = { top: number; left: number; width: number; height: number }

/**
 * Self-contained guided walkthrough overlay. No external tour library --
 * this highlights the target element for the current step (if any) and
 * shows an explanation card with Back / Next / Skip controls.
 *
 * Auto-starts once per tour, per browser, unless the user has turned
 * tours off globally. Can always be replayed later via the site-wide
 * Help button (see HelpMenu.tsx), which dispatches a `tcp:start-tour`
 * window event that this component listens for.
 */
export default function GuidedTour({ tourId }: GuidedTourProps) {
  const tour = TOURS[tourId]
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  const start = useCallback(() => {
    setStepIndex(0)
    setActive(true)
  }, [])

  // Auto-start on first visit (once per tour, unless tours are disabled).
  useEffect(() => {
    if (!tour) return
    const enabled = getToursEnabled()
    const seen = getSeenTours()
    if (enabled && !seen.includes(tour.id)) {
      const timer = window.setTimeout(() => start(), 500)
      return () => window.clearTimeout(timer)
    }
  }, [tour, start])

  // Allow the Help menu (or any other UI) to force-start this tour again.
  useEffect(() => {
    if (!tour) return
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ tourId: string }>).detail
      if (detail?.tourId === tour.id) start()
    }
    window.addEventListener('tcp:start-tour', handler)
    return () => window.removeEventListener('tcp:start-tour', handler)
  }, [tour, start])

  const step = tour?.steps[stepIndex]

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null)
      return
    }
    const el = document.querySelector(step.target)
    if (!el) {
      setRect(null)
      return
    }
    const box = el.getBoundingClientRect()
    setRect({ top: box.top, left: box.left, width: box.width, height: box.height })
  }, [step])

  useEffect(() => {
    if (!active) return
    const initial = window.setTimeout(measure, 0)
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(measure)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    if (step?.target) {
      document.querySelector(step.target)?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'center',
      })
      // remeasure after the scroll settles
      const t = window.setTimeout(measure, 400)
      return () => {
        window.clearTimeout(initial)
        window.clearTimeout(t)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }
    return () => {
      window.clearTimeout(initial)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [active, step, measure])

  const finish = useCallback(() => {
    if (tour) markTourSeen(tour.id)
    setActive(false)
  }, [tour])

  const skip = finish

  const next = useCallback(() => {
    if (!tour) return
    if (stepIndex < tour.steps.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      finish()
    }
  }, [tour, stepIndex, finish])

  const back = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1))
  }, [])

  const disableAllTours = useCallback(() => {
    setToursEnabled(false)
    finish()
  }, [finish])

  if (!mounted || !tour || !active || !step) return null

  const total = tour.steps.length
  const isLast = stepIndex === total - 1

  // Card placement: near the highlighted element when there is one,
  // otherwise centered on screen.
  const cardStyle: React.CSSProperties = rect
    ? {
        position: 'fixed',
        top: Math.min(
          Math.max(rect.top + rect.height + 16, 16),
          window.innerHeight - 260
        ),
        left: Math.min(Math.max(rect.left, 16), window.innerWidth - 380),
        maxWidth: 360,
        zIndex: 10001,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 400,
        zIndex: 10001,
      }

  return createPortal(
    <>
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 z-[10000] bg-brand-navy/60"
        onClick={skip}
        aria-hidden="true"
      />

      {/* Spotlight ring around the target element */}
      {rect && (
        <div
          className="pointer-events-none fixed z-[10000] rounded-lg ring-4 ring-brand-gold shadow-[0_0_0_9999px_rgba(10,22,40,0.55)]"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            transition: prefersReducedMotion() ? undefined : 'all 0.25s ease',
          }}
        />
      )}

      {/* Explanation card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tcp-tour-title"
        className="rounded-xl border border-brand-gold/30 bg-white p-5 shadow-2xl"
        style={cardStyle}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-accent text-xs font-bold uppercase tracking-widest text-brand-gold">
            {tour.name} &middot; Step {stepIndex + 1} of {total}
          </p>
          <button
            type="button"
            onClick={skip}
            aria-label="Close walkthrough"
            className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h3 id="tcp-tour-title" className="mt-2 font-accent text-lg font-bold text-brand-navy">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">{step.body}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={disableAllTours}
            className="text-xs font-semibold text-gray-400 underline-offset-2 hover:text-brand-darkMaroon hover:underline"
          >
            Don&apos;t show tours automatically
          </button>
          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-brand-navy hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-gold px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-darkGold"
            >
              {isLast ? (
                <>
                  Done <CheckCircle2 className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
