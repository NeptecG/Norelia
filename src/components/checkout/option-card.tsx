'use client'

import type { ReactNode } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface OptionCardProps {
  value:    string
  selected: boolean
  title:    string
  register: UseFormRegisterReturn
  desc?:    string
  price?:   ReactNode
  icon?:    ReactNode
}

// Monochrome selectable radio card with Norelia's signature red hairline on the
// selected option. Shared by the delivery-method and payment-method steps.
export function OptionCard({ value, selected, title, register, desc, price, icon }: OptionCardProps) {
  return (
    <label className={cn(
      'relative flex items-center gap-4 border cursor-pointer transition-colors pl-6 pr-5 py-4',
      'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-on-surface has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface',
      selected ? 'border-on-surface bg-surface-raised/50' : 'border-border hover:border-on-surface/40',
    )}>
      <span aria-hidden="true" className={cn('absolute left-0 top-0 bottom-0 w-[2px] transition-colors', selected ? 'bg-destructive' : 'bg-transparent')} />
      <input type="radio" {...register} value={value} className="sr-only" />
      {icon && <span className="shrink-0 flex items-center text-on-surface/65">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl text-on-surface leading-tight">{title}</span>
        {desc && <span className="block font-body text-[13px] text-on-surface-muted mt-0.5">{desc}</span>}
      </span>
      {price != null && <span className="shrink-0 font-body text-[15px] text-on-surface">{price}</span>}
      {selected && (
        <svg className="shrink-0 text-on-surface" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
    </label>
  )
}
