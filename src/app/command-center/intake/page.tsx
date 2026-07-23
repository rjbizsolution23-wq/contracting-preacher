'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'
import Button from '@/components/ui/Button'
import CCHero from '@/components/commandCenter/CCHero'
import CCSubNav from '@/components/commandCenter/CCSubNav'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

type FormState = {
  legalName: string
  dbaName: string
  entityType: string
  stateOfFormation: string
  formationDate: string
  principalAddress: string
  phone: string
  email: string
  website: string
  serviceArea: string
  profitStatus: string
  uei: string
  cageCode: string
  samStatus: string
  scVendorNumber: string
  grantsGovStatus: string
  primaryNaics: string
  secondaryNaics: string
  coreOffering: string
  employees: string
  contractors: string
  certifications: string
  licenses: string
  revenue2023: string
  revenue2024: string
  revenue2025: string
  fundingAmountRequested: string
  useOfFunds: string
  lanesOfInterest: string
  topProjects: string
  biggestGoal: string
  biggestGap: string
}

const INITIAL: FormState = {
  legalName: '', dbaName: '', entityType: '', stateOfFormation: 'South Carolina', formationDate: '',
  principalAddress: '', phone: '', email: '', website: '', serviceArea: '', profitStatus: 'for-profit',
  uei: '', cageCode: '', samStatus: 'unknown', scVendorNumber: '', grantsGovStatus: 'unknown',
  primaryNaics: '', secondaryNaics: '', coreOffering: '', employees: '', contractors: '',
  certifications: '', licenses: '', revenue2023: '', revenue2024: '', revenue2025: '',
  fundingAmountRequested: '', useOfFunds: '', lanesOfInterest: '', topProjects: '',
  biggestGoal: '', biggestGap: '',
}

const LANE_OPTIONS = [
  'Federal contracts', 'South Carolina contracts', 'County/city contracts', 'Grants',
  'SBIR/STTR', 'Loans', 'Investors', 'Accelerators', 'Sponsors', 'Prime contractor partners',
  'Corporate supplier programs',
]

export default function CommandCenterIntakePage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [lanes, setLanes] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const requiredKeys: (keyof FormState)[] = ['legalName', 'email', 'coreOffering', 'serviceArea']
  const completion = useMemo(() => {
    const filled = requiredKeys.filter((key) => form[key].trim().length > 0).length
    return Math.round((filled / requiredKeys.length) * 100)
  }, [form, requiredKeys])

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const toggleLane = (lane: string) => {
    setLanes((current) => (current.includes(lane) ? current.filter((item) => item !== lane) : [...current, lane]))
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const response = await fetch('/api/business/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lanesOfInterest: lanes.join(', ') }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to submit the business profile right now.')
      setStatus('success')
      setMessage('Business profile received and added to the data room. Certification, SAM, and eligibility facts still need official verification before any submission.')
      setForm(INITIAL)
      setLanes([])
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to submit the business profile right now.')
    }
  }

  return (
    <div className="bg-brand-offWhite">
      <Breadcrumbs items={[{ label: 'Business Funding Command Center', href: '/command-center' }, { label: 'Intake', href: '/command-center/intake' }]} />
      <CCHero
        eyebrow="Section 1-3 & 18 · Minimum Launch Information"
        title="Business Data Room Intake"
        description="Enter verified information once. This feeds the master data room, the AI eligibility profile, and the opportunity-scoring engine across contracts, grants, investors, sponsors, and loans."
      />
      <CCSubNav />

      <section className="container-custom grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-accent text-2xl font-bold text-brand-navy">Master Business Profile</h2>
              <p className="mt-1 text-sm text-gray-600">Never enter passwords, bank account numbers, full SSNs, or MFA codes here.</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-gold">{completion}%</div>
              <div className="text-xs font-bold uppercase text-gray-500">complete</div>
            </div>
          </div>

          <h3 className="font-accent text-sm font-bold uppercase text-brand-navy">Business identity</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <Field label="Legal business name" value={form.legalName} onChange={(v) => update('legalName', v)} required />
            <Field label="DBA / brand name" value={form.dbaName} onChange={(v) => update('dbaName', v)} />
            <Field label="Entity type" value={form.entityType} onChange={(v) => update('entityType', v)} placeholder="LLC, corporation, nonprofit..." />
            <Field label="State of formation" value={form.stateOfFormation} onChange={(v) => update('stateOfFormation', v)} />
            <Field label="Formation date" value={form.formationDate} onChange={(v) => update('formationDate', v)} type="date" />
            <Field label="Principal business address" value={form.principalAddress} onChange={(v) => update('principalAddress', v)} />
            <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} />
            <Field label="Business email" type="email" value={form.email} onChange={(v) => update('email', v)} required />
            <Field label="Website" value={form.website} onChange={(v) => update('website', v)} />
            <Field label="Service area" value={form.serviceArea} onChange={(v) => update('serviceArea', v)} placeholder="Counties/states served" required />
          </div>

          <h3 className="mt-8 font-accent text-sm font-bold uppercase text-brand-navy">Government identifiers</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <Field label="UEI" value={form.uei} onChange={(v) => update('uei', v)} />
            <Field label="CAGE code" value={form.cageCode} onChange={(v) => update('cageCode', v)} />
            <label>
              <span className="mb-2 block text-sm font-bold text-brand-navy">SAM.gov status</span>
              <select className="input-field" value={form.samStatus} onChange={(e) => update('samStatus', e.target.value)}>
                <option value="unknown">Not sure</option>
                <option value="not-started">Not started</option>
                <option value="in-progress">In progress</option>
                <option value="active">Active</option>
                <option value="expired">Expired or needs renewal</option>
              </select>
            </label>
            <Field label="SC vendor number" value={form.scVendorNumber} onChange={(v) => update('scVendorNumber', v)} />
            <label>
              <span className="mb-2 block text-sm font-bold text-brand-navy">Grants.gov status</span>
              <select className="input-field" value={form.grantsGovStatus} onChange={(e) => update('grantsGovStatus', e.target.value)}>
                <option value="unknown">Not sure</option>
                <option value="not-started">Not started</option>
                <option value="in-progress">In progress</option>
                <option value="active">Active with AOR assigned</option>
              </select>
            </label>
          </div>

          <h3 className="mt-8 font-accent text-sm font-bold uppercase text-brand-navy">Capabilities</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <Field label="Primary NAICS" value={form.primaryNaics} onChange={(v) => update('primaryNaics', v)} />
            <Field label="Secondary NAICS" value={form.secondaryNaics} onChange={(v) => update('secondaryNaics', v)} />
            <Field label="Employees" value={form.employees} onChange={(v) => update('employees', v)} />
            <Field label="Contractors" value={form.contractors} onChange={(v) => update('contractors', v)} />
            <Field label="Certifications held or pursuing" value={form.certifications} onChange={(v) => update('certifications', v)} />
            <Field label="Licenses" value={form.licenses} onChange={(v) => update('licenses', v)} />
          </div>
          <div className="mt-4">
            <TextArea label="Core offering (plain-English description)" value={form.coreOffering} onChange={(v) => update('coreOffering', v)} required />
          </div>

          <h3 className="mt-8 font-accent text-sm font-bold uppercase text-brand-navy">Financial snapshot (ranges only \u2014 never personal financials)</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <Field label="2023 revenue" value={form.revenue2023} onChange={(v) => update('revenue2023', v)} />
            <Field label="2024 revenue" value={form.revenue2024} onChange={(v) => update('revenue2024', v)} />
            <Field label="2025 revenue" value={form.revenue2025} onChange={(v) => update('revenue2025', v)} />
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <Field label="Funding amount requested" value={form.fundingAmountRequested} onChange={(v) => update('fundingAmountRequested', v)} />
            <Field label="Use of funds" value={form.useOfFunds} onChange={(v) => update('useOfFunds', v)} />
          </div>

          <h3 className="mt-8 font-accent text-sm font-bold uppercase text-brand-navy">Top projects & goals</h3>
          <div className="mt-4 grid gap-5">
            <TextArea label="Top three completed projects" value={form.topProjects} onChange={(v) => update('topProjects', v)} />
            <TextArea label="Biggest business goal" value={form.biggestGoal} onChange={(v) => update('biggestGoal', v)} />
            <TextArea label="Biggest readiness gap" value={form.biggestGap} onChange={(v) => update('biggestGap', v)} />
          </div>

          <h3 className="mt-8 font-accent text-sm font-bold uppercase text-brand-navy">Which lanes matter first?</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {LANE_OPTIONS.map((lane) => (
              <button
                type="button"
                key={lane}
                onClick={() => toggleLane(lane)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  lanes.includes(lane) ? 'border-brand-navy bg-brand-navy text-white' : 'border-gray-300 text-gray-600 hover:border-brand-gold'
                }`}
              >
                {lane}
              </button>
            ))}
          </div>

          {message && (
            <div className={`mt-6 flex gap-3 rounded-lg p-4 text-sm ${status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {status === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              {message}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="submit" loading={status === 'loading'}>
              {status === 'loading' ? 'Submitting' : 'Save to Data Room'}
            </Button>
            <Link href="/command-center/data-room" className="btn-navy">
              View Data Room Folders
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="flex items-center gap-2 font-accent text-lg font-bold text-red-900">
              <ShieldAlert className="h-5 w-5" /> Never enter here
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-red-900">
              <li>Passwords or login credentials</li>
              <li>Bank account or routing numbers</li>
              <li>Full Social Security Numbers</li>
              <li>MFA codes</li>
            </ul>
            <p className="mt-4 text-sm text-red-900">
              Owner personal financial data (SBA Form 413, personal tax returns) belongs in an
              encrypted restricted vault \u2014 see the Financing module.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="font-accent text-xl font-bold text-brand-navy">What happens next</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
              {[
                'AI verifies extracted facts against official sources where possible.',
                'Capability/eligibility profile is built for every opportunity lane you selected.',
                'The scoring engine flags hard disqualifiers before any time is spent drafting.',
                'Nothing gets submitted without an explicit owner/AOR approval.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}

function Field({
  label, value, onChange, type = 'text', required = false, placeholder = '',
}: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-brand-navy">
        {label}{required && <span className="text-brand-gold"> *</span>}
      </span>
      <input className="input-field" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} />
    </label>
  )
}

function TextArea({
  label, value, onChange, required = false,
}: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-brand-navy">
        {label}{required && <span className="text-brand-gold"> *</span>}
      </span>
      <textarea className="input-field min-h-24" value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </label>
  )
}
