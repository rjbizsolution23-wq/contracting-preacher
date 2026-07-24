import type { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import AdminClient from './AdminClient'

export const metadata: Metadata = generateSEO({
  title: 'Admin CRM',
  description: 'Internal intake queue, readiness scoring, opportunity search, and pipeline operating view.',
  noIndex: true,
  canonical: '/admin',
})

export default function AdminPage() {
  return <AdminClient />
}
