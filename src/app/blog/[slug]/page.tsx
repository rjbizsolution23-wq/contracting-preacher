import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import { generateArticleSchema } from '@/lib/schema'
import { BLOG_POSTS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CTASection from '@/components/home/CTASection'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) return generateSEO({ title: 'Post Not Found', noIndex: true })

  return generateSEO({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    canonical: `/blog/${post.slug}`,
    ogType: 'article',
    publishedTime: post.date,
    author: post.author,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    date: post.date,
    author: post.author,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title, href: `/blog/${post.slug}` }]} />

      <article className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Back */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-brand-gold font-accent font-semibold text-sm mb-8 hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category */}
            <span className="inline-flex items-center bg-brand-gold/10 text-brand-gold font-accent font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-navy mb-6 leading-tight text-balance">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(post.date)}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.readTime}</span>
            </div>

            {/* Content */}
            <div className="mb-12">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">{post.excerpt}</p>

              <div className="bg-brand-offWhite rounded-2xl p-8 my-10 border border-gray-200">
                <h2 className="text-2xl font-heading font-bold text-brand-navy mb-4">Ready to Take Action?</h2>
                <p className="text-gray-600 mb-6">
                  This article covers the key concepts, but every business situation is unique. Schedule
                  a free consultation with Pastor McKnight to get personalized guidance for your specific
                  federal contracting goals.
                </p>
                <Link href="/free-consultation" className="btn-primary inline-flex">
                  Schedule Free Consultation
                </Link>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p>
                  Federal contracting represents one of the most stable and lucrative revenue streams
                  available to small businesses in America. The U.S. federal government spends over
                  $600 billion annually on contracts, and small businesses are awarded more than 23%
                  of that total — that&apos;s over $150 billion going to businesses just like yours every year.
                </p>
                <p>
                  The key to accessing this marketplace is positioning your business correctly from the
                  start. This means getting registered on SAM.gov, selecting the right NAICS codes,
                  pursuing relevant certifications, and developing the skills to write winning proposals.
                </p>
                <p>
                  Pastor McKnight has helped over 500 businesses navigate this landscape. The businesses
                  that succeed share common traits: they&apos;re patient with the process, thorough in their
                  preparation, and strategic in which contracts they pursue. Quality over quantity is
                  always the winning approach in federal contracting.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs font-accent font-semibold text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Author box */}
            <div className="bg-brand-navy rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-heading font-bold text-2xl">PM</span>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white mb-1">{post.author}</h3>
                <p className="text-brand-gold font-accent font-semibold text-sm mb-3">
                  The Contracting Preacher | Federal Contracting Consultant
                </p>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Pastor McKnight is a licensed preacher and federal contracting expert based in South
                  Carolina. He helps small businesses nationwide win government contracts through SAM
                  registration, certifications, and expert proposal writing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  )
}
