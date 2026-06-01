'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Loader2,
  MessageSquareText,
  Send,
  ShieldCheck,
  Wrench,
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
      'Tell me what your business does, where you work, and what kind of government work you want. I can search for opportunities, explain next steps, and help build a stronger capture plan.',
  },
]

const prompts = [
  'Find cybersecurity contracts and grants',
  'Find construction opportunities in South Carolina',
  'Show me grant opportunities for workforce training',
  'What should a new client prepare before bidding?',
]

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages)
  const [input, setInput] = useState('Find cybersecurity contracts and grants')
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
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await response.json().catch(() => ({})) as AgentResponse
      setMessages([...nextMessages, { role: 'assistant', content: data.answer || 'The agent did not return an answer.' }])
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
              Contracting Assistant
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
              Find the right federal opportunities and know what to do next.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-200">
              Ask for contracts, grants, SBIR/STTR funding, agency notices, competitor award history,
              and client readiness steps. The assistant turns federal data into plain-language next
              actions for business owners and Dr. McKnight&apos;s team.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/15 bg-white/10 p-5 text-sm">
            <StatusLine icon={Bot} label="Opportunity strategy" value="Matches business capabilities to contracts and grants." />
            <StatusLine icon={Wrench} label="Proposal preparation" value="Explains documents, deadlines, and readiness gaps." />
            <StatusLine icon={Database} label="Market intelligence" value="Uses award history and public data to guide capture plans." />
          </div>
        </div>
      </section>

      <section className="container-custom grid gap-8 py-10 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="font-accent text-2xl font-bold text-brand-navy">Agent Chat</h2>
                <p className="mt-1 text-sm text-gray-600">Ask for live opportunities or client strategy.</p>
              </div>
              <Link href="/opportunities" className="btn-navy">
                Opportunity Finder
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
                      {message.role === 'user' ? 'You' : 'ContractingPreacher AI'}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg border border-gray-200 bg-brand-offWhite p-4 text-sm text-gray-700">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-brand-gold" />
                    Searching federal sources...
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
                placeholder="Ask for contracts, grants, deadlines, readiness, or capture strategy..."
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
            <h2 className="font-accent text-xl font-bold text-brand-navy">What It Does</h2>
            <AgentCapability icon={CheckCircle2} title="Find opportunities" body="Searches federal contracts, grants, SBIR/STTR funding, NOFOs, and past awards." />
            <AgentCapability icon={ShieldCheck} title="Check readiness" body="Shows what a business should fix before pursuing a bid or grant." />
            <AgentCapability icon={Database} title="Explain the market" body="Uses agency buying patterns and public data to guide capture strategy." />
            <AgentCapability icon={Wrench} title="Build next steps" body="Turns search results into clear action items for the client and consulting team." />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="font-accent text-xl font-bold text-brand-navy">Good Questions To Ask</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
              <li>Find IT support contracts for a small business in South Carolina.</li>
              <li>What grants fit a workforce training nonprofit?</li>
              <li>What should this client prepare before bidding?</li>
              <li>Who has won similar federal work recently?</li>
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
