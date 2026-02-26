import type { Metadata } from 'next'
import { CheckCircle2, Phone, Clock, Shield } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ContactForm from '@/components/forms/ContactForm'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = generateSEO({
  title: 'Free Federal Contracting Consultation — Schedule Your Call Today',
  description:
    'Schedule a free 30-minute consultation with Pastor McKnight. Get personalized guidance on SAM.gov registration, government certifications, bid writing, and your path to winning federal contracts. No obligation.',
  keywords: [
    'free federal contracting consultation',
    'government contracting consultation',
    'free government contract help',
  ],
  canonical: '/free-consultation',
})

export default function FreeConsultationPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Free Consultation', href: '/free-consultation' }]} />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left */}
            <div className="lg:col-span-2">
              <p className="text-brand-gold font-accent font-bold text-sm uppercase tracking-widest mb-4">
                Free Consultation
              </p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-navy mb-6 leading-tight">
                Your Federal Contracting Journey{' '}
                <span className="text-gradient-gold">Starts Here</span>
              </h1>
              <div className="gold-divider mb-8" />
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Schedule a free 30-minute consultation with Pastor McKnight. No sales pitch,
                no pressure — just genuine guidance on how to position your business for federal
                contracting success.
              </p>

              <h2 className="text-xl font-heading font-bold text-brand-navy mb-4">
                In Your Free Consultation, You&apos;ll Get:
              </h2>
              <div className="space-y-4 mb-10">
                {[
                  'A personalized assessment of your federal contracting readiness',
                  'Identification of NAICS codes and contract opportunities for your industry',
                  'Guidance on which certifications (8(a), HUBZone, WOSB, SDVOSB) you may qualify for',
                  'A clear roadmap with next steps to start winning government contracts',
                  'Honest answers to all your questions — no obligation whatsoever',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-brand-navy rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-heading font-bold">Prefer to Call?</h3>
                <a href={`tel:${SITE_CONFIG.phone}`} className="flex items-center gap-3 text-brand-gold hover:text-brand-lightGold transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="font-accent font-bold text-lg">{SITE_CONFIG.phone}</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">Mon–Fri, 8:00 AM – 6:00 PM EST</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">100% confidential. Your information is never shared.</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card-elevated p-8 md:p-10">
                <h2 className="text-2xl font-heading font-bold text-brand-navy mb-2">
                  Request Your Free Consultation
                </h2>
                <p className="text-gray-500 mb-8">
                  Fill out the form and Pastor McKnight will personally reach out within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
