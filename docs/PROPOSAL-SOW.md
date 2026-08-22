# The Contracting Preacher — Proposal & Statement of Work

**Prepared for:** Dr. Lonzell McKnight ("The Contracting Preacher")
**Prepared by:** Rick Jefferson / RJ Business Solutions
**Project:** thecontractingpreacher.com — federal contracting consulting platform
**Document date:** August 22, 2026
**Status:** System built, deployed, and live in production

---

## 1. Executive Summary

This document is the full accounting of what was proposed, built, and delivered
for The Contracting Preacher platform — from the first line of code through the
live, custom-domain, production system running today. It exists so that
everyone involved — Dr. McKnight, his team, and any future partner or investor
— can see in one place: **what was built, what it does, when each piece was
added, and what the whole system is worth.**

In short: what started as a marketing website has grown into a complete
client-acquisition and service-delivery platform — a public website, a lead
and CRM engine wired directly into GoHighLevel, a live federal contract/grant
search engine, an AI research assistant, a client portal, a private business
command center, a built-in interactive training system, and now a fully live
custom domain with secured admin access and anti-spoofing email protection.

**Total system value: approximately $25,000–$50,000+ in equivalent
build cost**, delivered and running on infrastructure that costs close to
**$0/month** at current traffic levels (see Section 5 for the full breakdown).

---

## 2. Statement of Work — What Was Built, Phase by Phase

This is the actual build history, in the order it happened, grouped into
phases. Every phase below is **complete and live** unless marked otherwise.

### Phase 1 — Core Website Foundation
*(Feb 2026)*

- Full marketing website built on Next.js (App Router) with Tailwind CSS —
  fast, modern, mobile-responsive on every page.
- Complete page set: Home, About, Services, Testimonials, FAQ, Blog, Contact,
  Free Consultation, Privacy Policy, Terms of Service.
- Deployed to Cloudflare Pages (global CDN — fast load times anywhere in the
  US).
- Senior-level code audit and fixes applied before go-live.

### Phase 2 — Real Business Content & Brand Accuracy
*(Mar–Apr 2026)*

- Replaced every placeholder with Dr. McKnight's real information: name,
  phone `(202) 276-2913`, all **15 real office locations** (SC, NC, FL, GA,
  PR, DC, VA, NY, NV, IL), real email, and real social profiles.
- Added Dr. McKnight's professional photo to the homepage hero, About page,
  and blog author box (later upgraded to a new professional headshot in
  August 2026).
- Built the booking calendar UI, UTM/marketing-attribution tracking, and the
  first set of backend API routes.
- Full audit pass on blog rendering, Cloudflare Functions routing, and
  sitemap conflicts.

### Phase 3 — SEO, Compliance & Trust
*(Apr–Jul 2026)*

- Search engine optimization pass: fixed missing page headings, fixed
  duplicate page titles, added proper metadata to every page, refreshed
  `llms.txt` (so AI search tools like ChatGPT/Perplexity describe the
  business correctly), sitemap and robots.txt hardened.
- Removed unverified marketing claims and fake certification badges —
  everything on the site now reflects only what's real and verifiable.
- Added a small "site by RJ Business Solutions" footer credit.
- Aligned the entire site to Dr. McKnight's real brand kit: logo, favicon,
  installable app icon (PWA), and the maroon brand accent color used
  consistently site-wide.

### Phase 4 — Federal Funding Intelligence Platform
*(Jun–Jul 2026)*

This is where the site stopped being "just a website" and became a working
product:

- **Live federal contract/grant search engine** — pulls real-time data from
  SAM.gov (contracts), Grants.gov, USAspending.gov, SBIR.gov, and the Federal
  Register, unified into one searchable interface (`/opportunities`).
- **South Carolina Government Contracting Resource Vault** — a dedicated
  local resource hub (`/south-carolina-contracting-resources`).
- **AI Contracting Assistant** (`/agent`) — a client-facing chat assistant
  (built on Cloudflare Workers AI) that answers federal-contracting
  questions and searches live opportunity data on request.
- **Marcus** — a second AI agent specialized in South Carolina housing and
  recovery-housing intelligence, for related outreach work.
- Additional open-data enrichment sources wired in: OpenCorporates,
  OpenSanctions, university/college data, Wikipedia/Wikidata, and more —
  used to enrich lead and business research.
- Integrated real government API keys: SAM.gov, Simpler.Grants.gov,
  CourtListener, Data.gov Catalog.

### Phase 5 — CRM, Security & Data Integrity Hardening
*(Jul 2026)*

A full robustness pass across the private/admin side of the system:

- **Admin CRM** (`/admin`) — fail-closed authentication (the system now
  *denies* access by default if a secret is ever missing, instead of the
  more common — and dangerous — mistake of defaulting to "open").
- **Audit log** — every login attempt and privileged action is recorded.
- **Lead attribution & consent tracking**, and persisted contact, booking,
  and newsletter submissions (nothing was ever silently dropped).
- **Explainable readiness scoring** — when a lead is scored, the system shows
  *why* (specific strengths/risks), not just a number.
- **Client health score** and **real client portal data lookups** — the
  client portal shows a real client's actual record instead of generic
  placeholder data once that client exists in the system.

### Phase 6 — Onboarding & Guided Tours
*(Aug 22, 2026)*

- Built a full **interactive, click-through guided tour system** that lives
  on every major page — a gold "?" help button that walks any user through
  exactly what that page does and how to use it, step by step, with no
  training video or live call required.
- Deployed tours for: **Command Center**, **Admin CRM**, **Client Portal**,
  **AI Agent**, **Contact form**, **Free Consultation booking**,
  **Client Intake form**, and **Newsletter signup** — every public-facing
  form on the site now has its own walkthrough.

### Phase 7 — Real CRM & Calendar Integration (GoHighLevel)
*(Aug 22, 2026)*

- Wired **every lead-capturing form on the site** (Contact, Free
  Consultation booking, Client Intake, Newsletter) directly into Dr.
  McKnight's **GoHighLevel** CRM — every submission creates or updates a
  real GHL contact automatically, with no manual data entry.
- Upgraded the booking calendar from "just notify by email" to **creating a
  real, live appointment directly on Dr. McKnight's GoHighLevel calendar** —
  correctly time-zoned (Eastern), assigned to the right team member, and
  confirmed. This was tested end-to-end against the live production system
  (a real test appointment was created and verified, then cleaned up).

### Phase 8 — Custom Domain, Email Security & Live Launch
*(Aug 22, 2026)*

- Diagnosed and fixed the domain being completely unreachable — the
  `thecontractingpreacher.com` zone existed on Cloudflare but had **zero DNS
  records**, meaning nothing could load.
- Connected both `thecontractingpreacher.com` and
  `www.thecontractingpreacher.com` to the live site, each with a valid,
  auto-issued SSL certificate (the padlock in the browser).
- Turned on **email receiving** for the domain (Cloudflare Email Routing) so
  mail sent to any `@thecontractingpreacher.com` address forwards to a real
  inbox — where previously no email at the domain could be received at all.
- Fixed the **email spoofing vulnerability** flagged by Cloudflare: added and
  correctly configured SPF, DKIM, and DMARC records so that mail *actually
  sent* by this business (via SendGrid) is authenticated, and mail *forged*
  to look like it's from this business is rejected/quarantined by receiving
  mail servers instead of reaching victims' inboxes.
- **Closed a real security gap found during this rollout:** the private
  admin/command-center login wall (Cloudflare Access) had not been extended
  to the new custom domain, meaning `/admin` and `/command-center` were
  briefly reachable without a login challenge on the new domain (though
  still protected on the original address). This was caught and fixed the
  same day, before being made public knowledge — all three protected
  applications now correctly require login on **every** address the site
  answers to.
- Updated all technical documentation (README, API docs, deployment docs,
  and the client-facing Starter Pack) to reflect the live domain.

### Phase 9 — Lonnie's Personal Admin Access
*(Aug 22, 2026 — complete)*

- **Investigated the outer login layer (Cloudflare Access):** confirmed that
  all three protected applications (`TCP - Admin`, `TCP - Command Center`,
  `TCP - API Business`) already allow-list `fmimmi29@gmail.com` — and that
  the domain's own registrant of record is "Lonzell McKnight" at that same
  address. In other words, the Cloudflare Access checkpoint (email + one-time
  code) was already Dr. McKnight's own login; no change was needed there.
- **Issued a dedicated personal admin passcode.** Previously, the second lock
  on `/admin` (`ADMIN_ACCESS_CODE`) used a generic placeholder code left over
  from development (`mcknight1`), shared by anyone who had it. Generated a
  new, unique, high-entropy code for Dr. McKnight and deployed it to
  production as the live `ADMIN_ACCESS_CODE` secret.
- **Verified end-to-end on every live address:** confirmed the old code now
  fails (`401`) and the new personal code succeeds (`200`) on
  `contracting-preacher-fyf.pages.dev`, `thecontractingpreacher.com`, and
  `www.thecontractingpreacher.com`. Also re-confirmed the outer Cloudflare
  Access checkpoint still correctly challenges (`302`) `/admin` and
  `/command-center` on all three addresses — nothing was loosened while
  making this change.
- **Delivered the new code directly to Dr. McKnight's team** — see
  `docs/STARTER-PACK.md` §1 ("Your personal admin access code").

---

## 3. Full Deliverables Inventory

### Public-facing pages
Home · About · Services · Testimonials · FAQ · Blog · Contact ·
Free Consultation (booking) · Client Intake · Privacy Policy ·
Terms of Service · South Carolina Contracting Resources ·
Opportunities (live federal search) · Intelligence overview · AI Agent

### Private/protected areas (Cloudflare Access login required)
Admin CRM (`/admin`) · Command Center (`/command-center`) ·
Business API (`/api/business/*`)

### Client-facing tools
Client Portal (`/portal`, access-code protected) ·
AI Contracting Assistant (public) · Marcus, SC Housing Assistant

### Backend systems (Cloudflare Pages Functions)
- Contact form handler → GoHighLevel + email confirmation
- Booking handler → GoHighLevel contact + **real calendar appointment**
- Client intake handler → CRM lead scoring + GoHighLevel
- Newsletter handler → GoHighLevel + welcome email
- Admin CRM leads API (secured)
- Business profile / health-score / opportunities / documents / approvals
  APIs (all secured)
- Federal funding discover/search/status APIs (SAM.gov, Grants.gov,
  USAspending, SBIR, Federal Register)
- Open-data search API (OpenCorporates, OpenSanctions, Wikipedia/Wikidata,
  college/university data, and more)
- AI agent chat + status APIs
- Portal login API

### Infrastructure
- Cloudflare Pages hosting (global CDN, auto-scaling, free at current
  traffic)
- Cloudflare D1 database (CRM lead storage)
- Cloudflare KV cache (federal data caching for speed)
- Cloudflare Workers AI binding (AI agent)
- Cloudflare Access (private-area login security)
- Cloudflare Email Routing + SPF/DKIM/DMARC (domain email + anti-spoofing)
- Live custom domain: `thecontractingpreacher.com` +
  `www.thecontractingpreacher.com`, both with valid SSL
- GoHighLevel CRM + calendar integration
- SendGrid transactional email (confirmations, welcome emails)
- Built-in interactive guided-tour training system (8 tours across every
  major page/form)

### Documentation delivered
- `README.md` — project overview and quick reference
- `docs/ARCHITECTURE.md` — technical architecture
- `docs/API.md` — full API reference
- `docs/PRODUCT.md` — product/workflow brief
- `docs/OPERATIONS.md` — day-to-day operations runbook
- `docs/DEPLOYMENT.md` — deployment procedure
- `docs/DATA-SOURCES.md` — federal/open-data source reference
- `docs/RELEASE-CHECKLIST.md` — pre-release QA checklist
- `docs/STARTER-PACK.md` — plain-language client guide (login steps, how
  everything works, monetary value)
- `docs/PROPOSAL-SOW.md` — this document

---

## 4. Real Business Impact Already Documented

The site's own testimonials record a client who won a **$350,000 federal
contract** within 6 months of working with Dr. McKnight through this system.
Published service pricing (from the live site) shows the direct revenue
opportunity per client:

| Service | Starting price |
| --- | --- |
| SAM.gov Registration | $497 |
| Bid & Proposal Writing | $1,497 |
| HUBZone Certification | $1,997 |
| WOSB/EDWOSB Certification | $1,497 |
| SDVOSB/VOSB Certification | $1,497 |
| SBA 8(a) Certification | $2,497 |

A single client who converts through the free-consultation funnel and
purchases two services is worth roughly **$2,000–$4,500**, before counting
any of the ongoing proposal-writing revenue a long-term client generates.

---

## 5. Total System Value

| What it does | Equivalent cost if built/bought separately |
| --- | --- |
| 24/7 lead capture across 4 entry points (contact, booking, intake, newsletter) with automatic email + CRM sync | $1,500–$3,000 |
| Automatic GoHighLevel contact + real calendar-appointment sync (no manual entry, no missed bookings) | $1,500–$4,000 |
| Live federal contract/grant/SBIR/USAspending search built into the CRM | $8,000–$20,000+ |
| AI assistant trained on federal contracting + live opportunity search | $5,000–$15,000 |
| Client-facing portal with readiness scoring and roadmaps | $10,000+ to build custom, or $100–$500/month as SaaS |
| Built-in, self-updating interactive tutorial system on every page | $2,000–$6,000 (professional onboarding video production) |
| Cloudflare Access security checkpoint on all private admin tools | $50–$300/month recurring (enterprise SSO/access control) |
| Custom domain, SSL, DNS, and anti-spoofing email security (SPF/DKIM/DMARC) setup | $500–$1,500 one-time + ongoing IT support |
| Full technical + client documentation set (9 documents) | $1,500–$3,000 |

### **Total equivalent build value: ~$25,000–$50,000+**

Running today on infrastructure that costs **close to $0/month** at current
traffic (Cloudflare Pages free tier), with no seat licenses, no per-user
fees, and no large recurring software bill hidden behind it. See
`docs/STARTER-PACK.md` §8(C) for the itemized ongoing-cost breakdown
(GoHighLevel subscription already owned, SendGrid free/low tier, free
government API keys, small pay-per-use AI cost).

---

## 6. What Remains / Next Step

Everything requested in this engagement to date is **complete**, including
Dr. McKnight's personal admin login (Phase 9 above). Two smaller loose ends
are worth tracking:

1. **Email forwarding destination is still "unverified."** Cloudflare emailed
   a one-time confirmation link to `fmimmi29@gmail.com` when email routing
   was enabled for the domain. Until that link is clicked, mail sent to
   `@thecontractingpreacher.com` addresses will not actually forward to that
   inbox yet. Action: check that inbox for a "Verify your email routing
   destination" message from Cloudflare and click confirm.
2. **Optional hygiene:** rotate the Cloudflare API token that has been used
   throughout this engagement's deployment work, now that all outstanding
   setup tasks are finished, as a routine security best practice (not
   required, no known exposure).

---

## 7. Acceptance

This document reflects the system as built and delivered as of August 22,
2026. It will be updated as additional phases are completed.

| | Name | Date |
| --- | --- | --- |
| Prepared by | Rick Jefferson / RJ Business Solutions | 2026-08-22 |
| Reviewed by | Dr. Lonzell McKnight | ______________ |
