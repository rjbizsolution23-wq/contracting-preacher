'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Home,
  Loader2,
  MessageSquareText,
  Send,
  ShieldCheck,
} from 'lucide-react'
import Button from '@/components/ui/Button'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type AgentResponse = {
  live?: boolean
  answer?: string
  warning?: string
}

const starterMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content:
      "I'm Marcus — ask me about South Carolina affordable housing, sober living / recovery housing, HUD grants, or government housing contracts. Tell me the project type, county, and funding gap and I'll pull current opportunities and flag what to check before you commit time.",
  },
]

const prompts = [
  'Find South Carolina funding for a recovery residence',
  'What SC PHAs have Project-Based Voucher solicitations?',
  'What is the difference between a grant, forgivable loan, and contract here?',
  'Score this opportunity for a 12-bed recovery residence in Richland County',
]

export default function HousingAgentClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages)
  const [input, setInput] = useState('Find South Carolina funding for a recovery residence')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (event?: React.FormEvent<HTMLFormElement>, preset?: string) => {
    event?.preventDefault()
    const content = (preset || input).trim()
    if (!content || loading) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/agent/housing-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await response.json().catch(() => ({})) as AgentResponse
      setMessages([...nextMessages, { role: 'assistant', content: data.answer || 'Marcus did not return an answer.' }])
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Agent request failed.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-offWhite">
      <section className="bg-brand-navy py-14 text-white">
        <div className="container-custom grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="font-accent text-sm font-bold uppercase tracking-widest text-brand-lightGold">
              Marcus · Housing &amp; Recovery Housing Agent
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
              Find South Carolina housing, recovery-housing, and HUD funding — and know what to check first.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-200">
              Ask about affordable housing funding, sober living / recovery housing programs, HUD grants,
              PHA/Section 8 vouchers, or government housing contracts and RFPs. Marcus scores opportunities,
              flags red-flag requirements, and separates recovery residences from licensed treatment facilities.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/15 bg-white/10 p-5 text-sm">
            <StatusLine icon={Home} label="Housing funding search" value="HUD, SC Housing, SCORF, PHA, and federal programs." />
            <StatusLine icon={Building2} label="Contracts & RFPs" value="SC recovery-housing and homeless-services contract search." />
            <StatusLine icon={ShieldCheck} label="Compliance guardrails" value="Recovery residence vs. licensed treatment facility, red flags, funding-type taxonomy." />
          </div>
        </div>
      </section>

      <section className="container-custom grid gap-8 py-10 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="font-accent text-2xl font-bold text-brand-navy">Marcus Chat</h2>
                <p className="mt-1 text-sm text-gray-600">Ask for South Carolina housing and recovery-housing opportunities.</p>
              </div>
              <Link href="/command-center/housing-recovery" className="btn-navy">
                Housing &amp; Recovery Intelligence
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(undefined, prompt)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[520px] overflow-y-auto p-5">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-4 text-sm leading-6 ${
                      message.role === 'user'
                        ? 'bg-brand-navy text-white'
                        : 'border border-gray-200 bg-brand-offWhite text-gray-700'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 font-bold">
                      {message.role === 'user' ? <MessageSquareText className="h-4 w-4" /> : <Bot className="h-4 w-4 text-brand-gold" />}
                      {message.role === 'user' ? 'You' : 'Marcus'}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg border border-gray-200 bg-brand-offWhite p-4 text-sm text-gray-700">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-brand-gold" />
                    Searching South Carolina housing sources...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </div>

          <form onSubmit={(event) => sendMessage(event)} className="border-t border-gray-200 p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                className="input-field"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about housing funding, recovery housing, PHA vouchers, or housing contracts..."
              />
              <Button type="submit" loading={loading}>
                <Send className="mr-2 h-5 w-5" />
                Send
              </Button>
            </div>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="font-accent text-xl font-bold text-brand-navy">What Marcus Does</h2>
            <AgentCapability icon={CheckCircle2} title="Find housing funding" body="Searches HUD, SC Housing, SCORF, and federal programs for affordable and recovery housing." />
            <AgentCapability icon={ShieldCheck} title="Check compliance basics" body="Separates recovery residences from licensed treatment facilities and flags red-flag requirements." />
            <AgentCapability icon={Building2} title="Find PHA opportunities" body="Section 8, HCV, Project-Based Voucher, and RAD activity across South Carolina PHAs." />
            <AgentCapability icon={Home} title="Score opportunities" body="Applies the 7-factor, 100-point scoring model to prioritize what to pursue first." />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="font-accent text-xl font-bold text-brand-navy">Good Questions To Ask</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
              <li>What SCORF or SC Recovery Housing Program funds fit a SCARR-certified home?</li>
              <li>What red flags should I check before applying for this HUD program?</li>
              <li>Which South Carolina PHAs have open PBV solicitations right now?</li>
              <li>What&apos;s a realistic capital stack for acquiring and rehabbing a recovery residence?</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}

function StatusLine({ icon: Icon, label, value }: { icon: typeof Bot; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-lightGold" />
      <div>
        <div className="font-bold text-brand-lightGold">{label}</div>
        <div className="mt-1 text-gray-100">{value}</div>
      </div>
    </div>
  )
}

function AgentCapability({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof CheckCircle2
  title: string
  body: string
}) {
  return (
    <div className="mt-4 flex gap-3 rounded-lg bg-brand-offWhite p-3 text-sm">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
      <div>
        <div className="font-bold text-brand-navy">{title}</div>
        <p className="mt-1 leading-6 text-gray-600">{body}</p>
      </div>
    </div>
  )
}
