'use client'

import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, Users, ShieldCheck, Award, HeartHandshake } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const reasons = [
  {
    icon: BookOpen,
    title: 'Faith-Driven Guidance',
    description: 'Dr. McKnight brings integrity, honesty, and faith-based values to every client relationship. Your success is our ministry.',
  },
  {
    icon: TrendingUp,
    title: 'We Only Bid to Win',
    description: 'We only recommend bidding on contracts where you have a genuine, honestly-assessed competitive advantage — quality over quantity.',
  },
  {
    icon: Users,
    title: 'Nationwide Reach',
    description: 'From solo entrepreneurs to established companies, we work with businesses across all industries and all 50 states to break into federal contracting.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance-First Process',
    description: 'Every registration, certification, and proposal we prepare is built to meet current government compliance requirements. No shortcuts.',
  },
  {
    icon: Award,
    title: 'Real Client Results',
    description: 'Our clients have won real federal contracts across construction, IT, janitorial, logistics, and security services. See their stories on our testimonials page.',
  },
  {
    icon: HeartHandshake,
    title: 'Personalized Support',
    description: 'You\'re never just a number. Dr. McKnight personally guides each client through the process with hands-on, one-on-one attention.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-brand-offWhite">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Why The Contracting Preacher"
          title="Your Success Is Our Mission — And Our Ministry"
          description="Choosing the right federal contracting consultant can mean the difference between winning contracts and wasting time."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center mb-5">
                <reason.icon className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="text-lg font-heading font-bold text-brand-navy mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
