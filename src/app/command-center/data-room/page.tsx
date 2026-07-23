import type { Metadata } from 'next'
import { FolderOpen } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import FieldChecklist from '@/components/commandCenter/FieldChecklist'
import { DATA_ROOM_FOLDERS, DOCUMENT_METADATA_FIELDS } from '@/lib/commandCenter'

export const metadata: Metadata = generateSEO({
  title: 'Master Business Data Room (24 Folders) | Business Funding Command Center',
  description: 'Every document category the AI needs to search, qualify, and prepare paperwork across contracts, grants, investors, sponsors, and loans \u2014 with full document metadata.',
  canonical: '/command-center/data-room',
})

export default function DataRoomPage() {
  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Data Room', href: '/command-center/data-room' }]} />
      <CCHero
        eyebrow="Section 14 · The Master Business Data Room"
        title="24 folders. One source of truth for every opportunity lane."
        description="Every document needs an owner, version, effective/expiration date, confidentiality level, verified status, supporting evidence, allowed use, and last-reviewed date."
        stats={[{ label: 'Folders', value: '24' }, { label: 'Metadata fields per document', value: String(DOCUMENT_METADATA_FIELDS.length) }]}
      />
      <CCSubNav />

      <section className="container-custom py-12">
        <FieldChecklist title="Required metadata on every document" items={DOCUMENT_METADATA_FIELDS} columns={3} />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DATA_ROOM_FOLDERS.map((folder) => (
            <article key={folder.code} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-brand-gold" />
                <h3 className="font-accent font-bold text-brand-navy">{folder.code}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">{folder.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
