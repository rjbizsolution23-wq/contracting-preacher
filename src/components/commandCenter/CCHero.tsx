import type { ReactNode } from 'react'

interface CCHeroProps {
  eyebrow: string
  title: string
  description: string
  stats?: Array<{ label: string; value: string }>
  children?: ReactNode
}

export default function CCHero({ eyebrow, title, description, stats, children }: CCHeroProps) {
  return (
    <section className="bg-brand-navy py-14 text-white">
      <div className="container-custom grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="font-accent text-sm font-bold uppercase tracking-widest text-brand-lightGold">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-200">{description}</p>
          {children}
        </div>
        {stats && stats.length > 0 && (
          <div className="rounded-lg border border-white/15 bg-white/10 p-5">
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-brand-lightGold">{stat.value}</div>
                  <div className="mt-1 text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
