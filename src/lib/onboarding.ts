/**
 * Lightweight, dependency-free onboarding/tour system.
 *
 * Design goals (per product requirement):
 *  - Auto-shows the right walkthrough the first time someone lands on a
 *    key screen (Command Center, Admin CRM, Client Portal, AI Agent).
 *  - Every step explains what the screen/section actually does, in plain
 *    language, using real product terminology (no invented features).
 *  - Fully skippable/dismissible at any point.
 *  - Replayable later via the floating Help button.
 *  - Users can turn automatic tours off entirely (persisted per browser).
 *
 * No third-party tour library is used -- this keeps bundle size small and
 * avoids any React 19 / Next 16 compatibility risk from unmaintained
 * onboarding packages. State is persisted in localStorage only (no
 * server-side tracking), which matches this app's existing patterns
 * (see AdminClient.tsx's `tcp-admin-code` and UTMTracker.tsx).
 */

export type TourStep = {
  id: string
  /** CSS selector for the element this step explains. Null = no specific
   *  target (used for steps describing content that only appears after
   *  an action, e.g. "after you log in you'll see..."). */
  target: string | null
  title: string
  body: string
}

export type Tour = {
  id: string
  name: string
  /** Human label shown in the Help panel, e.g. "Command Center tour". */
  replayLabel: string
  steps: TourStep[]
}

export const TOURS: Record<string, Tour> = {
  'command-center': {
    id: 'command-center',
    name: 'Command Center Introduction',
    replayLabel: 'Command Center walkthrough',
    steps: [
      {
        id: 'cc-hero',
        target: "[data-tour='cc-hero']",
        title: 'One business profile, six opportunity lanes',
        body:
          'Enter a business\u2019s verified information once. This same profile gets reused for federal contracts, grants, SBIR/STTR, investor readiness, sponsorships, and loans \u2014 you never re-enter it.',
      },
      {
        id: 'cc-subnav',
        target: "[data-tour='cc-subnav']",
        title: '18 sections of the same client file',
        body:
          'Every tab here is a different part of one client\u2019s profile \u2014 Capabilities, Financials, the Data Room, the Scoring Engine, and more. Start with "Intake," then fill in the others as you have information.',
      },
      {
        id: 'cc-launch',
        target: "[data-tour='cc-launch-requirements']",
        title: 'Start with these 12 items',
        body:
          'These are the minimum facts needed before any search or scoring can run for a client. Never collect passwords, SSNs, full tax returns, or banking credentials in chat \u2014 those go in the restricted document vault only.',
      },
      {
        id: 'cc-intake-cta',
        target: "[data-tour='cc-start-intake']",
        title: 'Begin the Master Intake',
        body:
          'This is the most important next step. Everything else in the Command Center \u2014 scoring, the data room, opportunity search \u2014 depends on this being filled in first.',
      },
    ],
  },
  admin: {
    id: 'admin',
    name: 'Admin CRM Introduction',
    replayLabel: 'Admin CRM walkthrough',
    steps: [
      {
        id: 'admin-access',
        target: "[data-tour='admin-access-code']",
        title: 'Unlock the CRM with your access code',
        body:
          'Enter the private admin access code issued for Dr. McKnight\u2019s team. This browser remembers it after your first successful unlock, so you won\u2019t need to re-enter it every visit.',
      },
      {
        id: 'admin-metrics',
        target: "[data-tour='admin-metrics']",
        title: 'Your pipeline at a glance',
        body:
          'Total CRM leads, average readiness score, and open risk flags across every client \u2014 updates automatically as new intakes come in.',
      },
      {
        id: 'admin-pipeline',
        target: "[data-tour='admin-pipeline']",
        title: 'Client Pipeline',
        body:
          'Every submitted intake appears here with its readiness score and a plain-language list of strengths and risks. Click "Refresh" any time to pull the latest.',
      },
      {
        id: 'admin-search',
        target: "[data-tour='admin-live-search']",
        title: 'Search live federal data',
        body:
          'Search SAM.gov contracts, Grants.gov, USAspending awards, SBIR/STTR, and more \u2014 directly from here. A green "live" badge means the source is connected; yellow "config needed" means it still needs an API key set up.',
      },
    ],
  },
  portal: {
    id: 'portal',
    name: 'Client Portal Introduction',
    replayLabel: 'Client Portal walkthrough',
    steps: [
      {
        id: 'portal-login',
        target: "[data-tour='portal-login-form']",
        title: 'Log in with your email and access code',
        body:
          'Your access code was issued by The Contracting Preacher team when your intake was processed. Don\u2019t have one yet? Use the "Need a portal? Start intake" link below instead.',
      },
      {
        id: 'portal-after-login',
        target: null,
        title: 'What you\u2019ll see after logging in',
        body:
          'Once you\u2019re in, you\u2019ll see your readiness score, a 12-month roadmap of next steps, an opportunity watchlist matched to your business, a document checklist, and upcoming deadline alerts \u2014 plus a link to ask the AI Agent any question about your results.',
      },
    ],
  },
  agent: {
    id: 'agent',
    name: 'AI Contracting Assistant Introduction',
    replayLabel: 'AI Agent walkthrough',
    steps: [
      {
        id: 'agent-capabilities',
        target: "[data-tour='agent-capabilities']",
        title: 'What this assistant can do',
        body:
          'It searches federal contracts, grants, SBIR/STTR funding, and past award history, checks what your business should fix before bidding, and turns results into plain-language next steps.',
      },
      {
        id: 'agent-prompts',
        target: "[data-tour='agent-prompts']",
        title: 'Not sure what to ask? Start here',
        body:
          'Click any of these starter prompts to see how the assistant responds \u2014 or type your own question below about contracts, grants, deadlines, or readiness.',
      },
      {
        id: 'agent-chat',
        target: "[data-tour='agent-chat']",
        title: 'The conversation happens here',
        body:
          'Ask follow-up questions any time \u2014 the assistant keeps the conversation in view so you can refer back to earlier answers.',
      },
    ],
  },
}

/** Maps an exact pathname to the tour that should auto-play there. */
export const PATH_TOUR_MAP: Record<string, string> = {
  '/command-center': 'command-center',
  '/admin': 'admin',
  '/portal': 'portal',
  '/agent': 'agent',
}

const STORAGE_KEYS = {
  enabled: 'tcp_tours_enabled',
  seen: 'tcp_tours_seen',
}

function safeLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function getToursEnabled(): boolean {
  const storage = safeLocalStorage()
  if (!storage) return true
  const raw = storage.getItem(STORAGE_KEYS.enabled)
  return raw === null ? true : raw === 'true'
}

export function setToursEnabled(enabled: boolean): void {
  const storage = safeLocalStorage()
  storage?.setItem(STORAGE_KEYS.enabled, String(enabled))
}

export function getSeenTours(): string[] {
  const storage = safeLocalStorage()
  if (!storage) return []
  try {
    const raw = storage.getItem(STORAGE_KEYS.seen)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function markTourSeen(tourId: string): void {
  const storage = safeLocalStorage()
  if (!storage) return
  const seen = getSeenTours()
  if (!seen.includes(tourId)) {
    storage.setItem(STORAGE_KEYS.seen, JSON.stringify([...seen, tourId]))
  }
}

export function clearTourSeen(tourId: string): void {
  const storage = safeLocalStorage()
  if (!storage) return
  const seen = getSeenTours().filter((id) => id !== tourId)
  storage.setItem(STORAGE_KEYS.seen, JSON.stringify(seen))
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}
