# The Contracting Preacher — Starter Pack for Dr. McKnight

**Welcome!** This is your all-in-one guide to the system that was built for you. It
covers how to log in, how every part of the site works, what happens behind the
scenes when someone fills out a form, and what this whole system is worth in
dollar terms. Keep this document handy — it's your reference manual.

If you ever get stuck, the short version is: **every page on the site now has a
built-in walkthrough.** Look for the gold circle "?" button in the bottom-left
corner of any screen and click it — it will explain that page to you, step by
step, right on screen.

---

## 1. How to Log In (Cloudflare Access / "TCP Cloud Tunnel")

Four areas of the site are private and only you can open them:

| Area | What it's for | URL |
| --- | --- | --- |
| **Admin CRM** | See every lead/client, search live federal contract data | `/admin` |
| **Command Center** | Full client profile builder — intake, scoring, data room | `/command-center` |
| **Business API** | Behind-the-scenes data endpoints the Command Center calls | `/api/business/*` |
| Everything else (homepage, contact, booking, intake, portal, AI agent) | Public — anyone can see these, no login needed | — |

These four are locked with **Cloudflare Access** — think of it as a security
checkpoint that sits in front of the website, before the website itself even
loads. This is separate from anything inside the site's own code — it's a wall
Cloudflare puts up.

### Step-by-step login

1. Go to any locked page, for example: `https://contracting-preacher-fyf.pages.dev/admin`
2. You'll be automatically redirected to a Cloudflare login screen at an address
   like `flat-recipe-9e67.cloudflareaccess.com`. This is expected — it's not a
   broken link or an error, it's the security checkpoint.
3. Enter your email address: **fmimmi29@gmail.com** (this is the only email
   allowed through — anyone else's email will be rejected here, before they
   ever see the site).
4. Click **"Send me a code."** Cloudflare will email you a 6-digit one-time PIN
   within a few seconds.
5. Check that inbox, copy the 6-digit code, and type it into the login screen.
6. You're in. You'll stay logged in for **24 hours** before you have to repeat
   this (each of the four areas remembers your login separately for 24 hours).
7. After Cloudflare's checkpoint, `/admin` has a **second, simpler** lock — a
   private access code (just a password, no email needed). Enter it once and
   the browser remembers it after that. (Ask whoever manages the site for this
   code if you don't have it — it's stored as `ADMIN_ACCESS_CODE`.)

### If you get stuck

| Problem | What's happening | What to do |
| --- | --- | --- |
| "I never get the email with the code" | Check spam/junk. Cloudflare's sending address is unfamiliar to most inboxes the first time. | Wait 60 seconds, click "Resend code." Still nothing after 2 tries → the email address on file may be wrong; contact your developer to check it. |
| "It says I'm not allowed to log in" | You typed a different email than the one on the allow-list (`fmimmi29@gmail.com`). | Use that exact email. Only that address is approved. |
| "The page just spins / never loads after I enter the code" | Usually a temporary hiccup, not a real problem. | Refresh the page once. If it persists more than a minute, try a different browser or an incognito/private window (clears any stuck login cookies). |
| "I got past the Cloudflare screen but /admin still won't open" | That's the *second* lock — the private access code — not Cloudflare. | Re-enter the `ADMIN_ACCESS_CODE`. If you don't know it, ask your developer — it's stored securely and can be looked up or changed without touching Cloudflare. |
| "I want to log in from my phone too" | Totally fine — Cloudflare Access isn't tied to one device. | Just repeat the same steps on the phone; you'll get a fresh 6-digit code. |

**Nothing to install.** No VPN, no "Cloud Tunnel" app, no software of any kind —
just your email inbox and a web browser. The "tunnel" is entirely on Cloudflare's
side; from your side it just looks like a login screen.

---

## 2. Interactive Walkthroughs — Built Into Every Page

You asked for a tutorial that "pops on the screen" and lets people click through
the steps. That's now live everywhere:

- **Public pages** — Homepage newsletter box, Contact page, Free Consultation
  booking calendar, and the Intake form all have a short walkthrough that
  automatically appears **the first time** any visitor lands on that page.
- **Your private tools** — Command Center, Admin CRM, Client Portal, and the AI
  Agent chat each have their own walkthrough too, tailored to what you (or your
  team) actually do on that screen.
- Every walkthrough:
  - Highlights the exact part of the screen it's talking about with a gold glow.
  - Explains what that section does, in plain language.
  - Has **Back / Next** buttons, and a **Done** button on the last step.
  - Can be skipped any time by clicking the X or clicking outside the box.
  - Only shows automatically **once** per browser — it won't nag people who've
    already seen it.

### The Help button (bottom-left, gold circle with a "?")

This button is on **every page** and lets anyone:
- **Replay** any walkthrough for that page on demand — no need to wait for the
  automatic one-time popup.
- **Turn tours on/off** — if someone doesn't want the automatic popups, one
  toggle turns them all off (they can still replay manually any time).

**This is exactly your "tutorial that pops on the screen, interactive, click
through the steps" requirement — it is live on every page right now.**

---

## 3. How the Forms & Booking System Work (and Connect to GoHighLevel)

Every form on the site does three things automatically, in this order, every
single time someone submits it:

1. **Sends you an email notification** (and the client gets a confirmation
   email too) — powered by SendGrid.
2. **Saves a copy in the site's own database** so you can see it in the Admin
   CRM (`/admin`) even if email fails for any reason.
3. **Pushes the person into GoHighLevel (GHL)** as a Contact — with tags and
   notes describing what they submitted and why.

### The forms wired this way today

| Form | Location | What happens in GHL |
| --- | --- | --- |
| Contact form | `/contact` | Creates/updates the contact, tags `contact-form` |
| Master Intake | `/intake` | Creates/updates the contact, tags `intake`, adds readiness/business details as custom fields |
| Newsletter signup | Homepage | Creates/updates the contact, tags them as a newsletter subscriber |
| **Free Consultation booking** | `/free-consultation` | Creates/updates the contact **and books a real appointment directly on your GHL Calendar** |

### The booking calendar — this is the piece that's new and important

Before this update, a booking request only showed up as a tagged Contact in
GHL — nothing appeared on an actual calendar. Now, when someone books a free
consultation:

1. They pick an open weekday time slot (9:00 AM – 4:30 PM Eastern, closed
   12:00–1:00 PM, no weekends) on the site.
2. The system creates/updates their Contact in GHL.
3. **The system then books a real appointment on your "Free Consultation"
   calendar in GHL**, at the exact time they picked, assigned to you.
4. Because your GHL calendar can sync to Google Calendar (if you've connected
   that in GHL's own settings), the appointment can show up there too —
   automatically, no manual entry.
5. You and the client both get an instant email confirmation from the website
   itself (separate from anything GHL sends).

This whole chain was tested live on the production site on **August 22, 2026**
with a real test submission — contact created, appointment booked at the
correct time with the correct offset, confirmed via GHL's own calendar API,
then removed since it was only a test. It works end-to-end, today, on the live
site.

**What you need to do:** nothing extra — it's already running. If you ever add
a *second* team member who should also take bookings, that's a GHL calendar
setting (add them under the calendar's Team Members), not a website change.

---

## 4. What's in the CRM / Admin Dashboard (`/admin`)

- **Pipeline view** — every intake and booking submission appears here with a
  computed "readiness score" and a plain-language list of strengths/risks.
- **Live federal data search** — search SAM.gov contracts, Grants.gov,
  USAspending awards, and SBIR/STTR opportunities directly from the same
  screen, without leaving the CRM.
- A green "live" badge next to a data source means it's actively connected;
  yellow "config needed" means an API key for that source still needs to be
  added (ask your developer).

## 5. What's in the Command Center (`/command-center`)

This is the deeper tool for building out a *full* client profile — one intake
that automatically feeds federal contract matching, grant matching, SBIR/STTR
matching, investor-readiness scoring, sponsorship matching, and loan matching,
all from the same set of facts entered once. It has 18 sections; start with
"Intake," fill in the rest as you learn more about the client.

## 6. What's in the Client Portal (`/portal`)

This is what *your clients* see once they've been given a portal access code:
their own readiness score, a 12-month roadmap, an opportunity watchlist matched
to their business, a document checklist, and deadline alerts — plus a link to
ask the AI Agent questions about their own results.

## 7. The AI Agent (`/agent`)

A chat assistant that can search federal contracts, grants, SBIR/STTR funding,
and past award history, and turn the results into plain-language next steps.
Public — no login needed, so you can point prospective clients to it directly.

---

## 7.5 Your Own Domain Is Live

`thecontractingpreacher.com` and `www.thecontractingpreacher.com` are both
connected and working — real visitors can reach the site at either address,
with a valid HTTPS padlock (no browser warnings), and both are locked down
by the same Cloudflare Access login on `/admin`, `/command-center`, and the
Business API described in Section 1.

What's set up under the hood, in plain terms:

- **Two DNS records** point your domain names at the website itself, so
  typing `thecontractingpreacher.com` or `www.thecontractingpreacher.com`
  into a browser loads your site.
- **Email routing** is turned on for `@thecontractingpreacher.com`. Anyone who
  emails an address at your domain (e.g. `info@thecontractingpreacher.com`)
  will have that message forwarded straight into your existing inbox — no new
  mailbox or email software needed on your end.
- **Anti-spoofing records** (SPF, DKIM, DMARC) are in place so that email
  claiming to be "from" your domain is verified as genuinely coming from your
  systems (SendGrid, for the site's automated confirmation emails) — this
  makes it much harder for scammers to impersonate
  `@thecontractingpreacher.com` in phishing emails, and keeps your legitimate
  emails out of spam folders.

If you ever want to send *and reply to* email as
`info@thecontractingpreacher.com` (not just receive forwarded mail), that
requires connecting a mailbox provider (e.g. Google Workspace or Microsoft
365) — ask your developer if/when you want that set up; it's a small
additional step on top of what's already live.

---

## 8. The Monetary Value of This System

### A) What your services are worth (from the site's own published pricing)

| Service | Starting price |
| --- | --- |
| SAM.gov Registration | $497 |
| Bid & Proposal Writing | $1,497 |
| HUBZone Certification | $1,997 |
| WOSB/EDWOSB Certification | $1,497 |
| SDVOSB/VOSB Certification | $1,497 |
| SBA 8(a) Certification | $2,497 |

A single client who comes through the free consultation funnel and buys just
**two** of these services (e.g., SAM registration + one certification) is worth
roughly **$2,000–$4,500** to your business — and many clients need several of
these over time, plus ongoing proposal-writing work per bid.

The site's testimonials already document real outcomes from this approach —
for example, one client won a **$350,000** federal contract within 6 months of
working with you. That's the kind of return a single well-qualified lead from
this system can produce.

### B) What the *system itself* replaces or would otherwise cost

| What it does | If you paid someone else to build/run this | 
| --- | --- |
| 24/7 lead capture across 4 entry points (contact, booking, intake, newsletter) with automatic email + CRM sync | A basic "contact form + email" setup: $1,500–$3,000 to build |
| Automatic GoHighLevel contact + calendar sync (no manual data entry, no missed bookings) | GHL automation/Zapier-style integration work: $1,500–$4,000 |
| Federal contract/grant/SBIR/USAspending live search built into your own CRM | A custom data-aggregation tool: $8,000–$20,000+ if built from scratch |
| AI assistant trained to answer federal-contracting questions and search live opportunities | Custom AI chatbot integration: $5,000–$15,000 |
| Client-facing portal with readiness scoring and roadmaps | Client-portal SaaS subscription: $100–$500/month ongoing, or $10,000+ to build custom |
| Built-in, self-updating interactive tutorials on every page (no separate training videos, no onboarding calls needed for basic use) | Professional onboarding video/tutorial production: $2,000–$6,000 |
| Security checkpoint (Cloudflare Access) protecting your private admin tools, at no extra monthly cost | Enterprise SSO/access-control setup: $50–$300/month recurring |

**Bottom line:** what's running today is the equivalent of a **$25,000–$50,000+
custom-built sales, CRM, and AI research platform** — running on
infrastructure (Cloudflare Pages) that costs close to $0/month at your current
traffic level, with no seat licenses or per-user fees.

### C) The ongoing cost to keep it running

This is intentionally lean:
- **Cloudflare Pages hosting:** free tier covers this site's traffic comfortably.
- **GoHighLevel:** whatever your existing GHL subscription already costs — no
  extra add-on was purchased for this integration.
- **SendGrid (email):** free tier (100 emails/day) or low-cost paid tier if
  volume grows.
- **Federal data API keys** (SAM.gov, Grants.gov, etc.): free, government-issued
  keys — no cost.
- **OpenAI (AI Agent):** small per-use cost, scales with how often the chat
  assistant is used.

There is no large recurring software bill hiding behind this system.

---

## 9. Quick Reference — Where Everything Lives

- **Live site (your domain):** https://thecontractingpreacher.com and
  https://www.thecontractingpreacher.com — both are live, both have valid
  HTTPS certificates, and both are protected by the same Cloudflare Access
  login on `/admin`, `/command-center`, and the Business API.
- **Underlying Cloudflare Pages URL:** https://contracting-preacher-fyf.pages.dev
  (still works too — it's the same site, just the platform-assigned address)
- **Email:** Cloudflare Email Routing forwards anything sent to
  `@thecontractingpreacher.com` straight to your inbox (fmimmi29@gmail.com),
  with SPF, DKIM, and DMARC configured so mail sent *from*
  `info@thecontractingpreacher.com` (via SendGrid, for confirmation emails) is
  authenticated and can't be spoofed by scammers.
- **GitHub code repository (private):** https://github.com/rjbizsolution23-wq/contracting-preacher
- **Admin CRM:** `/admin` (Cloudflare Access + access code)
- **Command Center:** `/command-center` (Cloudflare Access)
- **Client Portal:** `/portal` (portal access code, given to clients individually)
- **AI Agent:** `/agent` (public)
- **GoHighLevel:** your existing GHL location — contacts and the "Free
  Consultation" calendar update automatically from the site, no manual sync
  needed.

## 10. If Something Ever Breaks

Send your developer this info — it's usually a 5-minute fix:
1. Which page/form was being used.
2. What happened (error message, blank page, nothing sent).
3. Whether `/admin` still opens normally (helps tell whether it's a whole-site
   issue or just one form).

Most issues in this kind of system are one of: an expired API key, a browser
cache glitch (try refreshing or a private/incognito window), or a temporary
outage from a third-party service (Cloudflare, SendGrid, or GHL) that resolves
itself within minutes.
