'use client'

import { Fragment } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

// Shared 3-step checkout progress: Cart (0) → Delivery (1) → Payment (2).
// Labels are read from the CheckoutShipping namespace so all three pages share them.
export function StepIndicator({ current }: { current: 0 | 1 | 2 }) {
  const t = useTranslations('CheckoutShipping')
  const labels = [t('stepCart'), t('stepDelivery'), t('stepPayment')]

  return (
    <nav aria-label="Checkout progress" className="flex items-center gap-3 mb-10">
      {labels.map((label, i) => {
        const active  = i === current
        const reached = i <= current
        return (
          <Fragment key={label}>
            {i > 0 && (
              <span aria-hidden="true" className={cn('h-px w-5 sm:w-8', reached ? 'bg-on-surface/40' : 'bg-border')} />
            )}
            <span
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase',
                reached ? 'text-on-surface' : 'text-on-surface/35',
              )}
            >
              <span className={cn(
                'flex items-center justify-center size-6 rounded-full border text-[10px]',
                active
                  ? 'border-on-surface bg-on-surface text-surface'
                  : reached ? 'border-on-surface' : 'border-on-surface/30',
              )}>
                {i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </span>
          </Fragment>
        )
      })}
    </nav>
  )
}
