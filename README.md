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
```

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
