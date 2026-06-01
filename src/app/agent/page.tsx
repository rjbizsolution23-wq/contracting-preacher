'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Loader2,
  MessageSquareText,
  Send,
  Wrench,
} from 'lucide-react'
import Button from '@/components/ui/Button'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ToolResult = {
  tool: string
  label: string
  live: boolean
  warning?: string
}

type AgentResponse = {
  live?: boolean
  answer?: string
  tools?: ToolResult[]
  warning?: string
}

const starterMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content:
      'Ask me to find contracts, grants, SBIR/STTR opportunities, NOFOs, or award-history intelligence. I can also explain readiness steps and source configuration.',
  },
]

const prompts = [
  'Find cybersecurity contracts and grants',
  'Find construction opportunities in South Carolina',
  'Is the agent and API stack live?',
  'What should a new client prepare before bidding?',
]

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages)
  const [input, setInput] = useState('Find cybersecurity contracts and grants')
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState<ToolResult[]>([])
  const [warning, setWarning] = useState('')
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
    setWarning('')

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await response.json().catch(() => ({})) as AgentResponse
      setTools(data.tools || [])
      setWarning(data.warning || '')
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
              Live AI Agent
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
              ContractingPreacher AI with federal search tools.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-200">
              Chat with an agent that can call the opportunity finder, federal API status checks,
              open-data enrichment, and readiness guidance. It runs on Cloudflare Pages Functions
              with Workers AI binding support and an OpenAI-compatible fallback.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/15 bg-white/10 p-5 text-sm">
            <StatusLine icon={Bot} label="LLM runtime" value="Cloudflare AI binding first, OpenAI fallback second" />
            <StatusLine icon={Wrench} label="Tools" value="Contracts, grants, SBIR, NOFO, awards, open data, CRM readiness" />
            <StatusLine icon={Database} label="Storage" value="D1 CRM and KV cache ready when bindings are attached" />
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
                    Calling agent tools...
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
                placeholder="Ask for contracts, grants, NOFOs, readiness, source status..."
              />
              <Button type="submit" loading={loading}>
                <Send className="mr-2 h-5 w-5" />
                Send
              </Button>
            </div>
          </form>
        </div>

        <aside className="space-y-5">
          {warning && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">
              <AlertTriangle className="mb-2 h-5 w-5" />
              {warning}
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="font-accent text-xl font-bold text-brand-navy">Tool Calls</h2>
            <div className="mt-4 space-y-3">
              {tools.map((tool) => (
                <div key={tool.tool} className="rounded-lg bg-brand-offWhite p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-bold text-brand-navy">{tool.label}</div>
                    {tool.live ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                  </div>
                  {tool.warning && <p className="mt-2 text-xs leading-5 text-yellow-800">{tool.warning}</p>}
                </div>
              ))}
              {!tools.length && <p className="text-sm leading-6 text-gray-600">Tool status appears after the first chat request.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="font-accent text-xl font-bold text-brand-navy">Production Secrets</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><code>AI</code> Cloudflare Workers AI binding</li>
              <li><code>OPENAI_API_KEY</code> optional fallback</li>
              <li><code>SAM_API_KEY</code> for contract search</li>
              <li><code>SIMPLER_GRANTS_API_KEY</code> for modern grants search</li>
              <li><code>DB</code> and <code>FEDFUNDING_CACHE</code> bindings</li>
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
