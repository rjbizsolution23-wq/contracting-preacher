import { CheckCircle2 } from 'lucide-react'

export default function FieldChecklist({
  title,
  items,
  columns = 2,
}: {
  title?: string
  items: string[]
  columns?: 1 | 2 | 3
}) {
  const colClass = columns === 3 ? 'sm:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : ''
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {title && <h3 className="font-accent text-lg font-bold text-brand-navy">{title}</h3>}
      <ul className={`mt-4 grid gap-3 ${colClass}`}>
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-gray-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
