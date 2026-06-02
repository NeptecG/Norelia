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
      selected ? 'border-on-surface bg-surface-raised/50' : 'border-border hover:border-on-surface/40',
    )}>
      <span aria-hidden="true" className={cn('absolute left-0 top-0 bottom-0 w-[2px] transition-colors', selected ? 'bg-destructive' : 'bg-transparent')} />
      <input type="radio" {...register} value={value} className="sr-only" />
      <span className={cn(
        'shrink-0 size-[18px] rounded-full border flex items-center justify-center transition-colors',
        selected ? 'border-on-surface' : 'border-on-surface/40',
      )}>
        {selected && <span className="size-2.5 rounded-full bg-on-surface" />}
      </span>
      {icon && <span className="shrink-0 text-on-surface/65">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg text-on-surface leading-tight">{title}</span>
        {desc && <span className="block font-body text-[11px] text-on-surface-muted mt-0.5">{desc}</span>}
      </span>
      {price != null && <span className="shrink-0 font-body text-sm text-on-surface">{price}</span>}
    </label>
  )
}
