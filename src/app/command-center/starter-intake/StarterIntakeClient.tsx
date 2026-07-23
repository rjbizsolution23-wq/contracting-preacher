'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import Button from '@/components/ui/Button'
import { STARTER_INTAKE_TEMPLATE } from '@/lib/commandCenter'

export default function StarterIntakeClient() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(STARTER_INTAKE_TEMPLATE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-accent text-xl font-bold text-brand-navy">Copy-and-complete starter intake</h2>
        <Button type="button" variant="secondary" onClick={copy}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy template'}
        </Button>
      </div>
      <pre className="mt-5 max-h-[36rem] overflow-auto whitespace-pre-wrap rounded-lg bg-brand-offWhite p-5 text-sm leading-6 text-gray-800">
        {STARTER_INTAKE_TEMPLATE}
      </pre>
    </div>
  )
}
