# The Contracting Preacher

![RJ Business Solutions](https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg)

**Built by RJ Business Solutions**
📍 1342 NM 333, Tijeras, New Mexico 87059
🌐 [rickjeffersonsolutions.com](https://rickjeffersonsolutions.com)

---

## 🏛️ Project Overview

**The Contracting Preacher** is a full-stack, production-grade marketing and lead generation website for **Pastor McKnight** — a licensed preacher and federal contracting expert based in South Carolina.

- **Domain**: thecontractingpreacher.com
- **Purpose**: Convert small business owners into federal contracting clients
- **Target Market**: South Carolina small businesses + nationwide
- **Build Date**: February 26, 2026

---

## ✨ Completed Features

### Pages
- ✅ **Homepage** — Hero, Stats, Services Overview, Why Choose Us, Process Steps, Testimonials Carousel, Newsletter Signup, FAQ Preview, CTA
- ✅ **About** — Pastor McKnight bio, story, faith section
- ✅ **Services** (list page + 6 individual service pages)
  - SAM.gov Registration & Renewal
  - Bid & Proposal Writing
  - SBA 8(a) Certification
  - HUBZone Certification
  - WOSB/EDWOSB Certification
  - SDVOSB/VOSB Certification
- ✅ **Blog** — listing + individual post pages with author bio
- ✅ **FAQ** — full accordion with schema markup
- ✅ **Testimonials** — grid with contract values
- ✅ **Free Consultation** — lead gen page with contact form
- ✅ **Contact** — full contact form with office info
- ✅ **Resources** — curated government portal links
- ✅ **Privacy Policy** — GDPR-ready
- ✅ **Terms of Service** — comprehensive legal page
- ✅ **404 Not Found** — custom page

### Backend & APIs
- ✅ **Contact API** (`/api/contact`) — SendGrid integration
- ✅ **Newsletter API** (`/api/newsletter`) — SendGrid Marketing Contacts + welcome email

### Technical
- ✅ Next.js 16 with App Router
- ✅ Tailwind CSS v4 with custom brand design system
- ✅ Framer Motion animations throughout
- ✅ Full SEO metadata on every page
- ✅ JSON-LD Schema markup (Organization, Service, FAQ, Article, BreadcrumbList)
- ✅ Security headers (HSTS, X-Frame-Options, CSP, etc.)
- ✅ TypeScript throughout
- ✅ React Hook Form + Zod validation
- ✅ Sonner toast notifications
- ✅ Embla Carousel for testimonials
- ✅ Animated stat counters
- ✅ Scroll-to-top button
- ✅ Breadcrumb navigation
- ✅ Accessible skip-to-content link
- ✅ Mobile-responsive header with dropdown navigation

---

## 🔗 Key URLs

| Page | Path |
|------|------|
| Homepage | `/` |
| About | `/about` |
| Services | `/services` |
| SAM Registration | `/services/sam-registration` |
| 8(a) Certification | `/services/8a-certification` |
| HUBZone | `/services/hubzone-certification` |
| WOSB | `/services/wosb-certification` |
| SDVOSB | `/services/sdvosb-certification` |
| Bid Writing | `/services/bid-proposal-writing` |
| Blog | `/blog` |
| FAQ | `/faq` |
| Testimonials | `/testimonials` |
| Free Consultation | `/free-consultation` |
| Contact | `/contact` |
| Resources | `/resources` |
| Privacy Policy | `/privacy-policy` |
| Terms of Service | `/terms-of-service` |

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | POST | Contact form submission (SendGrid) |
| `/api/newsletter` | POST | Newsletter signup (SendGrid Marketing Contacts) |

---

## 🎨 Design System

**Brand Colors:**
- Navy: `#0A1628`
- Gold: `#C9A84C`
- Blue: `#1E3A5F`
- Off-White: `#F5F3EF`

**Typography:**
- Headings: Playfair Display (serif — authority + faith)
- Body: Inter (clean readability)
- Accent: Montserrat (labels, CTAs, navigation)

---

## 📊 Business Data

**Stats:**
- 500+ Businesses Served
- 89% Proposal Win Rate
- $50M+ in Contracts Won
- 15+ Years Experience

**Services Pricing:**
- SAM.gov Registration: Starting at $497
- Bid & Proposal Writing: Starting at $1,497
- 8(a) Certification: Starting at $2,497
- HUBZone Certification: Starting at $1,997
- WOSB Certification: Starting at $1,497
- SDVOSB Certification: Starting at $1,497

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Forms | React Hook Form + Zod |
| Email | SendGrid API |
| Deployment | Vercel (recommended) |
| Icons | Lucide React |
| Notifications | Sonner |
| Carousel | Embla Carousel |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/rjbizsolution23-wq/contracting-preacher.git
cd contracting-preacher

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your SENDGRID_API_KEY and SENDGRID_FROM_EMAIL

# Run development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Environment Variables

```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=pastor@thecontractingpreacher.com
```

---

## 📦 Deployment (Vercel — Recommended)

```bash
# Deploy to Vercel
npm run build
vercel --prod

# Set environment variables in Vercel dashboard:
# SENDGRID_API_KEY
# SENDGRID_FROM_EMAIL
```

---

## 🔮 Recommended Next Steps

1. **Real client photos** — Replace placeholder image in About page with actual Pastor McKnight photo
2. **Blog content** — Add full article content to `BLOG_POSTS` in `src/lib/constants.ts`
3. **Calendly integration** — Embed Calendly on Free Consultation page for instant booking
4. **Google Analytics** — Add GA4 tracking ID in `next.config.ts`
5. **CRM integration** — Connect form submissions to HubSpot, GHL, or similar CRM
6. **Live chat** — Add Intercom or Crisp widget for real-time visitor engagement
7. **Domain setup** — Point thecontractingpreacher.com DNS to Vercel
8. **SendGrid setup** — Configure SendGrid API key and verified sender domain

---

## 📧 Contact

**Rick Jefferson — RJ Business Solutions**
- Email: rjbizsolution23@gmail.com
- LinkedIn: [in/rick-jefferson-314998235](https://linkedin.com/in/rick-jefferson-314998235)
- GitHub: [@rickjeffsolutions](https://github.com/rickjeffsolutions)
- Website: [rickjeffersonsolutions.com](https://rickjeffersonsolutions.com)

---

**© 2026 RJ Business Solutions. All rights reserved.**
*Built with faith & excellence* 🙏
