# The Contracting Preacher

![RJ Business Solutions](https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg)

**Built by RJ Business Solutions**
📍 1342 NM 333, Tijeras, New Mexico 87059
🌐 [rickjeffersonsolutions.com](https://rickjeffersonsolutions.com)

---

## 🚀 Live URLs

| Environment | URL |
|-------------|-----|
| **Production (Cloudflare Pages)** | https://main.contracting-preacher.pages.dev |
| **Deployment** | https://c44f8bf2.contracting-preacher.pages.dev |
| **Custom Domain (configure)** | https://thecontractingpreacher.com |
| **GitHub Repository** | https://github.com/rjbizsolution23-wq/contracting-preacher |

---

## 📋 Project Overview

**The Contracting Preacher** is a full-featured, production-ready marketing website for Pastor McKnight's federal contracting consulting firm based in South Carolina.

### Key Metrics
- **15+ years** experience
- **500+ businesses** served
- **$50M+** in contracts won
- **89%** proposal win rate

---

## ✨ Features

### Pages (15 total)
| Route | Description |
|-------|-------------|
| `/` | Homepage with full conversion funnel |
| `/about` | Pastor McKnight's story & credentials |
| `/services` | All 6 services overview |
| `/services/sam-registration` | SAM.gov Registration ($497+) ⭐ Popular |
| `/services/bid-proposal-writing` | Bid & Proposal Writing ($1,497+) |
| `/services/8a-certification` | SBA 8(a) Certification ($2,497+) |
| `/services/hubzone-certification` | HUBZone Certification ($1,997+) |
| `/services/wosb-certification` | WOSB/EDWOSB Certification ($1,497+) |
| `/services/sdvosb-certification` | SDVOSB/VOSB Certification ($1,497+) |
| `/blog` | Blog listing (6 articles) |
| `/blog/[slug]` | Individual blog posts |
| `/testimonials` | 6 client testimonials with results |
| `/faq` | 10 frequently asked questions |
| `/resources` | Federal contracting resources & links |
| `/contact` | Contact form with SendGrid integration |
| `/free-consultation` | Free consultation booking form |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-service` | Terms of Service |
| `/sitemap.xml` | Auto-generated XML sitemap |
| `/robots.txt` | Search engine directives |

### API Endpoints (Cloudflare Pages Functions)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | `POST` | Contact form → SendGrid email |
| `/api/newsletter` | `POST` | Newsletter signup → SendGrid contacts + welcome email |
| `/api/crm/leads` | `GET/POST` | Admin CRM lead list + intake submission with readiness scoring |
| `/api/portal/login` | `POST` | Client portal access-code login shell |
| `/api/agent/status` | `GET` | Live AI agent, LLM, tool, D1, and KV readiness report |
| `/api/agent/chat` | `POST` | Cloudflare/OpenAI-backed chat agent with federal search tools |
| `/api/funding/status` | `GET` | Federal API/key/binding status report |
| `/api/funding/discover` | `GET` | Unified opportunity finder across contracts, grants, awards, SBIR/STTR, and Federal Register NOFOs |
| `/api/funding/search` | `GET` | SAM.gov, Grants.gov, USAspending, SBIR.gov, and Federal Register proxy/search |
| `/api/open-data/search` | `GET` | Open-data enrichment search for entity risk, website evidence, university partners, public context, and location research |

### Federal Funding Intelligence Additions
| Route | Description |
|-------|-------------|
| `/intelligence` | FedFunding Intel Engine overview, API arsenal, CRM workflow, portal modules, and upstream repo map |
| `/opportunities` | Unified federal opportunity finder for contracts, grants, SBIR/STTR, NOFOs, and award intelligence |
| `/agent` | Live ContractingPreacher AI chat agent with federal search tools and source status |
| `/intake` | Client intake form feeding readiness scoring and CRM lead creation |
| `/admin` | Dr. McKnight admin CRM, pipeline view, risk flags, and live opportunity search |
| `/portal` | Client portal shell with readiness report, roadmap, documents, deadlines, and watchlist |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (React 19) |
| **Deployment** | Cloudflare Pages + Pages Functions |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion 12 |
| **Forms** | React Hook Form + Zod validation |
| **UI Components** | Custom component library |
| **Carousel** | Embla Carousel |
| **Toasts** | Sonner |
| **Icons** | Lucide React |
| **Fonts** | Playfair Display, Inter, Montserrat (Google Fonts) |
| **Email** | SendGrid API |
| **Build** | Next.js Webpack static export → Cloudflare Pages |
| **CI/CD** | GitHub Actions → Cloudflare Pages auto-deploy |

---

## 📦 Installation & Development

```bash
# Clone the repository
git clone https://github.com/rjbizsolution23-wq/contracting-preacher.git
cd contracting-preacher

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 🔧 Environment Variables

Create a `.env.local` file for local development:

```bash
# SendGrid (for contact form & newsletter emails)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=pastor@thecontractingpreacher.com

# Admin/portal gates
ADMIN_ACCESS_CODE=change_me_admin_code
PORTAL_ACCESS_CODE=change_me_client_code

# Federal data APIs
SAM_API_KEY=your_sam_gov_api_key
# Also supported for existing secret naming:
SAMS_API_KEY=your_sam_gov_api_key
SIMPLER_GRANTS_API_KEY=your_simpler_grants_api_key
DATA_GOV_API_KEY=your_api_data_gov_key
OPEN_CORPORATES_API_KEY=your_opencorporates_key
OPENSANCTIONS_API_KEY=your_opensanctions_key

# LLM agent runtime
OPENAI_API_KEY=your_openai_api_key_optional_fallback
OPENAI_MODEL=gpt-4o-mini
AGENT_MODEL=@cf/meta/llama-3.1-8b-instruct
```

For Cloudflare Pages production, add these as **Secret environment variables** in:
> Cloudflare Dashboard → Pages → contracting-preacher → Settings → Environment Variables

---

## 🚀 Deployment

### Automatic (GitHub Actions)
Every push to `main` branch automatically:
1. Installs dependencies
2. Builds static export with Next.js webpack
3. Deploys to Cloudflare Pages

### Manual Deploy
```bash
# Build static export
NEXT_TELEMETRY_DISABLED=1 npx next build --webpack

# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name contracting-preacher
```

### Set Production Environment Variables
```bash
npx wrangler pages secret put SENDGRID_API_KEY --project-name contracting-preacher
npx wrangler pages secret put SENDGRID_FROM_EMAIL --project-name contracting-preacher
npx wrangler pages secret put ADMIN_ACCESS_CODE --project-name contracting-preacher
npx wrangler pages secret put PORTAL_ACCESS_CODE --project-name contracting-preacher
npx wrangler pages secret put SAM_API_KEY --project-name contracting-preacher
npx wrangler pages secret put SIMPLER_GRANTS_API_KEY --project-name contracting-preacher
npx wrangler pages secret put DATA_GOV_API_KEY --project-name contracting-preacher
npx wrangler pages secret put OPEN_CORPORATES_API_KEY --project-name contracting-preacher
npx wrangler pages secret put OPENSANCTIONS_API_KEY --project-name contracting-preacher
npx wrangler pages secret put OPENAI_API_KEY --project-name contracting-preacher
npx wrangler pages secret put OPENAI_MODEL --project-name contracting-preacher
npx wrangler pages secret put AGENT_MODEL --project-name contracting-preacher
```

For the preferred Cloudflare-native LLM runtime, add a **Workers AI binding**
named `AI` to the Cloudflare Pages project in the Cloudflare dashboard. The
agent function uses `env.AI.run()` when that binding exists, then falls back to
`OPENAI_API_KEY` if configured. Without either, `/api/agent/chat` still returns
a deterministic tool summary so the CRM/search workflow remains testable.

### Optional D1/KV Setup for CRM Persistence + API Cache

The CRM and funding functions run without bindings, but production should add D1
and KV so leads persist and API calls are cached.

```bash
# Create resources
npx wrangler d1 create contracting_preacher_crm
npx wrangler kv namespace create FEDFUNDING_CACHE

# Apply schema after adding the returned binding IDs in Cloudflare Pages settings
npx wrangler d1 execute contracting_preacher_crm --file db/0001_fedfunding_crm.sql
```

Cloudflare Pages bindings to configure:

| Binding | Type | Purpose |
|---------|------|---------|
| `DB` | D1 database | Stores CRM leads submitted through `/intake` |
| `FEDFUNDING_CACHE` | KV namespace | Caches federal API search results to respect rate limits |

### Federal Data Verification Commands

```bash
curl https://main.contracting-preacher.pages.dev/api/funding/status
curl https://main.contracting-preacher.pages.dev/api/agent/status
curl -X POST https://main.contracting-preacher.pages.dev/api/agent/chat \
  -H 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"Find cybersecurity contracts and grants"}]}'
curl 'https://main.contracting-preacher.pages.dev/api/funding/discover?q=cybersecurity&limit=5'
curl 'https://main.contracting-preacher.pages.dev/api/funding/search?source=awards&q=construction'
curl 'https://main.contracting-preacher.pages.dev/api/funding/search?source=contracts&q=cybersecurity'
curl 'https://main.contracting-preacher.pages.dev/api/open-data/search?source=opensanctions&q=company'
curl 'https://main.contracting-preacher.pages.dev/api/open-data/search?source=universities&q=south%20carolina'
```

Live-data rules:
- SAM.gov search requires `SAM_API_KEY` or `SAMS_API_KEY`.
- Simpler.Grants.gov search requires `SIMPLER_GRANTS_API_KEY`; otherwise the function falls back to open legacy Grants.gov Search2.
- USAspending.gov, SBIR.gov, and Federal Register searches do not require project API keys.
- Do not treat CRM scores as legal/certification determinations. Official SAM.gov status, SBA certification eligibility, proposal deadlines, and NSF/SBIR solicitation values must be verified against current primary sources.

### Open Data Enrichment Layer

The public API list was filtered for sources that help the federal contracting
mission. The operating set is:

| Source | Mission use | Status |
|--------|-------------|--------|
| OpenCorporates | Entity/company validation and officer/director due diligence | Ready, needs `OPEN_CORPORATES_API_KEY` |
| OpenSanctions | Sanctions, PEP, crime, and watchlist screening | Ready, needs `OPENSANCTIONS_API_KEY` |
| Microlink.io | Client/competitor website metadata and evidence extraction | Wired |
| College Scorecard | Workforce, education, training, and partner research | Wired |
| Universities List | STTR/research partner and teaming discovery | Wired |
| Wikidata / Wikipedia | Public context for agencies, programs, companies, and technologies | Wired |
| Archive.org | Historical website evidence and audit trail context | Wired |
| Socrata | State/local procurement and public data portals | Reference |
| Recreation Information Database | Federal lands/recreation/facilities opportunity context | Ready, needs key |
| AcreLens | Rural/property/site context for HUBZone, facilities, and construction clients | Ready, needs key |
| Teleport | Location quality/context for expansion and regional narratives | Wired |
| Kaggle | NSFGrantCraft technical datasets and validation research | Reference |
| LinkPreview | Fallback website preview extraction | Ready, needs key |

### Connect Custom Domain
In Cloudflare Dashboard → Pages → contracting-preacher → Custom domains:
- Add `thecontractingpreacher.com`
- Add `www.thecontractingpreacher.com`

---

## 🏗️ Project Structure

```
contracting-preacher/
├── .github/workflows/
│   └── deploy.yml              # CI/CD pipeline
├── functions/
│   └── api/
│       ├── contact.ts          # Contact form Cloudflare Function
│       ├── newsletter.ts       # Newsletter Cloudflare Function
│       └── booking.ts          # Free Consultation Booking Function
├── public/
│   ├── _headers                # Cloudflare security headers
│   ├── _redirects              # Cloudflare redirects
│   ├── robots.txt              # SEO robots
│   └── images/
│       └── og-image.svg        # Open Graph social image
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── blog/               # Blog list + [slug] detail
│   │   ├── services/           # Service pages (6 pages)
│   │   ├── sitemap.ts          # Auto XML sitemap
│   │   └── [other pages]/
│   ├── components/
│   │   ├── forms/              # ContactForm
│   │   ├── home/               # HeroSection, CTASection, etc.
│   │   ├── layout/             # Header, Footer, Breadcrumbs
│   │   ├── shared/             # Shared components
│   │   └── ui/                 # Button, Accordion, SectionHeading, etc.
│   └── lib/
│       ├── constants.ts        # Site config, services, FAQs, blog posts
│       ├── schema.ts           # JSON-LD structured data generators
│       ├── seo.ts              # SEO metadata generator
│       └── utils.ts            # Utility functions
├── next.config.ts              # Next.js config (static export)
├── tailwind.config.ts          # Tailwind v4 config
├── wrangler.toml               # Cloudflare Pages config
└── package.json
```

---

## 🔐 Security Features

- ✅ HSTS (Strict-Transport-Security: 2 years)
- ✅ X-Frame-Options: DENY (clickjacking protection)
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy: camera/microphone/geolocation blocked
- ✅ Form validation (Zod schemas on both client and server)
- ✅ Input sanitization in API routes
- ✅ No API keys in frontend code
- ✅ Environment variables for secrets

---

## 📊 SEO & Performance

- ✅ JSON-LD structured data (Organization, Service, FAQ, Article, Breadcrumb, WebPage schemas)
- ✅ Auto-generated XML sitemap (23 URLs)
- ✅ Open Graph + Twitter Card meta tags
- ✅ robots.txt with sitemap reference
- ✅ Playfair Display + Inter + Montserrat via Google Fonts
- ✅ Image optimization with AVIF/WebP
- ✅ Smooth scroll + skip-to-content accessibility
- ✅ Semantic HTML with ARIA labels
- ✅ Mobile-first responsive design

---

## 📧 Contact

**Rick Jefferson — RJ Business Solutions**
- Email: rjbizsolution23@gmail.com
- LinkedIn: [in/rick-jefferson-314998235](https://linkedin.com/in/rick-jefferson-314998235)
- GitHub: [@rjbizsolution23-wq](https://github.com/rjbizsolution23-wq)
- Website: [rickjeffersonsolutions.com](https://rickjeffersonsolutions.com)

**Built Date:** February 26, 2026

---

**© 2026 RJ Business Solutions. All rights reserved.**
