import { MARQUEE_TEXT } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  text?: string
  dark?: boolean
}

export function Marquee({ text = MARQUEE_TEXT, dark = false }: Props) {
  const items = Array.from({ length: 10 }, (_, i) => (
    <span key={i} className="pr-16">
      {text}
    </span>
  ))

  return (
    <div
      className={cn(
        'overflow-hidden border-y border-border py-2',
        dark ? 'bg-surface-alt' : 'bg-surface',
      )}
    >
      <div
        className={cn(
          'flex whitespace-nowrap animate-ticker font-body text-[11px] tracking-[0.2em] uppercase',
          dark ? 'text-[rgba(255,255,255,0.92)]' : 'text-on-surface',
        )}
      >
        {items}
      </div>
    </div>
  )
}
