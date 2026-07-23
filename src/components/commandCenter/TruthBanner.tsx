import { CheckCircle2, ShieldAlert } from 'lucide-react'
import { AI_CAN, AI_MUST_NOT } from '@/lib/commandCenter'

export default function TruthBanner() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h3 className="flex items-center gap-2 font-accent text-lg font-bold text-green-900">
          <CheckCircle2 className="h-5 w-5" /> AI can
        </h3>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-green-900">
          {AI_CAN.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="flex items-center gap-2 font-accent text-lg font-bold text-red-900">
          <ShieldAlert className="h-5 w-5" /> AI must not
        </h3>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-red-900">
          {AI_MUST_NOT.map((item) => (
            <li key={item} className="flex gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="md:col-span-2 rounded-lg bg-brand-navy p-5 text-sm leading-6 text-gray-200">
        On Grants.gov, submission requires an Authorized Organizational Representative (AOR) role.
        Final certifications and legally binding submissions stay behind an owner/AOR approval gate.
        Raising investor money can involve securities law considerations that require qualified
        securities counsel. Sensitive demographic information must be encrypted and accessible only
        when a specific application requires it. Owner financial information belongs in an
        encrypted restricted vault \u2014 never in ordinary chat, email, or shared folders.
      </p>
    </div>
  )
}
