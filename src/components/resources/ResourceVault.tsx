'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ExternalLink,
  Info,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TRUST_LABELS,
  type GovernmentLevel,
  type SCResource,
  type TrustLabel,
} from '@/lib/scResources'

const LEVEL_LABELS: Record<GovernmentLevel, string> = {
  federal: 'Federal',
  state: 'State',
  county: 'County',
  city: 'City / Town',
  'school-district': 'School District',
  university: 'University / College',
  transportation: 'Transportation',
  utility: 'Utility',
  'special-district': 'Special-Purpose District',
  'housing-authority': 'Housing Authority',
  'federal-installation': 'Federal Installation',
  'certification-body': 'Certification',
  financing: 'Financing',
  compliance: 'Compliance',
  assistance: 'Free Assistance',
  platform: 'Platform',
}

const TRUST_BADGE_STYLES: Record<TrustLabel, string> = {
  'official-government': 'bg-green-50 text-green-700 border-green-200',
  'government-adopted-portal': 'bg-blue-50 text-blue-700 border-blue-200',
  'free-assistance': 'bg-brand-cream text-brand-darkGold border-brand-gold/40',
  commercial: 'bg-purple-50 text-purple-700 border-purple-200',
  'directory-only': 'bg-gray-100 text-gray-600 border-gray-300',
  'manual-contact': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  unavailable: 'bg-brand-maroon/5 text-brand-maroon border-brand-maroon/30',
}

interface ResourceVaultProps {
  resources: SCResource[]
  /** Which filter controls to show. Defaults to all. */
  filters?: Array<'level' | 'county' | 'certification' | 'trust' | 'workType'>
  /** Hide the level filter and lock the dataset to a single implied level (used by sub-pages). */
  compact?: boolean
}

export default function ResourceVault({ resources, filters = ['level', 'county', 'trust', 'workType'], compact = false }: ResourceVaultProps) {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<string>('all')
  const [county, setCounty] = useState<string>('all')
  const [trust, setTrust] = useState<string>('all')
  const [workType, setWorkType] = useState<string>('all')

  const levels = useMemo(() => {
    const set = new Set(resources.map((r) => r.level))
    return Array.from(set)
  }, [resources])

  const counties = useMemo(() => {
    const set = new Set(resources.map((r) => r.county).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [resources])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return resources.filter((resource) => {
      if (level !== 'all' && resource.level !== level) return false
      if (county !== 'all' && resource.county !== county) return false
      if (trust !== 'all' && resource.trust !== trust) return false
      if (workType !== 'all' && resource.workType !== workType && resource.workType !== 'both' && resource.workType !== 'n/a') return false
      if (!q) return true
      const haystack = [
        resource.name,
        resource.buyer,
        resource.category,
        resource.county,
        resource.city,
        resource.notes,
        resource.portalProvider,
        ...(resource.certifications || []),
        ...(resource.industries || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [resources, query, level, county, trust, workType])

  return (
    <div>
      {/* Search + filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 md:p-6">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-navy">
            <Search className="h-4 w-4 text-brand-gold" />
            Search buyers, portals, counties, certifications&hellip;
          </span>
          <input
            className="input-field"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Charleston, Bonfire, HUBZone, DBE, school district..."
          />
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filters.includes('level') && !compact && (
            <FilterSelect
              label="Government Level"
              value={level}
              onChange={setLevel}
              options={[{ value: 'all', label: 'All levels' }, ...levels.map((l) => ({ value: l, label: LEVEL_LABELS[l] }))]}
            />
          )}
          {filters.includes('county') && counties.length > 0 && (
            <FilterSelect
              label="County"
              value={county}
              onChange={setCounty}
              options={[{ value: 'all', label: 'All counties' }, ...counties.map((c) => ({ value: c, label: c }))]}
            />
          )}
          {filters.includes('trust') && (
            <FilterSelect
              label="Trust Label"
              value={trust}
              onChange={setTrust}
              options={[{ value: 'all', label: 'All trust levels' }, ...(Object.keys(TRUST_LABELS) as TrustLabel[]).map((t) => ({ value: t, label: TRUST_LABELS[t].label }))]}
            />
          )}
          {filters.includes('workType') && (
            <FilterSelect
              label="Work Type"
              value={workType}
              onChange={setWorkType}
              options={[
                { value: 'all', label: 'All work types' },
                { value: 'construction', label: 'Construction' },
                { value: 'supplies-services', label: 'Supplies / Services' },
              ]}
            />
          )}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing <span className="font-bold text-brand-navy">{filtered.length}</span> of {resources.length} resources.
        </p>
      </div>

      {/* Trust legend */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(Object.keys(TRUST_LABELS) as TrustLabel[]).map((key) => (
          <span
            key={key}
            className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold', TRUST_BADGE_STYLES[key])}
            title={TRUST_LABELS[key].description}
          >
            {key === 'official-government' && <ShieldCheck className="h-3 w-3" />}
            {key === 'unavailable' && <AlertTriangle className="h-3 w-3" />}
            {TRUST_LABELS[key].label}
          </span>
        ))}
      </div>

      {/* Results */}
      <div className="mt-6 space-y-3">
        {filtered.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            No resources match those filters. Try clearing search or filters.
          </div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-bold text-brand-navy">{label}</span>
      <select
        className="input-field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ResourceCard({ resource }: { resource: SCResource }) {
  const badgeStyle = TRUST_BADGE_STYLES[resource.trust]
  const trustMeta = TRUST_LABELS[resource.trust]

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-brand-gold/40">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold uppercase text-brand-darkGold">
              {LEVEL_LABELS[resource.level]}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-600">
              {resource.category}
            </span>
            <span
              className={cn('inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold', badgeStyle)}
              title={trustMeta.description}
            >
              {resource.trust === 'official-government' && <CheckCircle2 className="h-3 w-3" />}
              {resource.trust === 'unavailable' && <AlertTriangle className="h-3 w-3" />}
              {trustMeta.label}
            </span>
          </div>

          <h3 className="mt-3 font-accent text-lg font-bold text-brand-navy">{resource.name}</h3>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
            {resource.buyer && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-brand-gold" />{resource.buyer}</span>}
            {resource.county && <span>County: {resource.county}</span>}
            {resource.city && <span>City: {resource.city}</span>}
            {resource.portalProvider && <span>Portal: {resource.portalProvider}</span>}
          </div>

          {resource.certifications && resource.certifications.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {resource.certifications.map((cert) => (
                <span key={cert} className="rounded-full bg-brand-navy/5 px-2.5 py-0.5 text-xs font-bold text-brand-navy">
                  {cert}
                </span>
              ))}
            </div>
          )}

          {resource.notes && (
            <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-600">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-gold" />
              {resource.notes}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-400">Last verified: {resource.lastVerified}</p>
        </div>

        <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
          {resource.bidPortalUrl && resource.bidPortalUrl !== resource.officialUrl && (
            <a
              href={resource.bidPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-gold px-4 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-darkGold"
            >
              Bid Portal
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          )}
          {resource.officialUrl && (
            <a
              href={resource.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-navy px-4 text-sm font-bold text-white transition-colors hover:bg-brand-blue"
            >
              Official Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
