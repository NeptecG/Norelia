'use client'

import { Link } from '@/navigation'

// Centered empty-state block shared by the cart, delivery and payment steps.
export function CheckoutEmpty({ message, ctaLabel, ctaHref }: { message: string; ctaLabel: string; ctaHref: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <p className="font-body text-base text-on-surface/60 tracking-wide">{message}</p>
      <Link
        href={ctaHref}
        className="font-body text-xs tracking-[0.2em] uppercase border border-border px-8 py-3 text-on-surface hover:bg-surface-raised transition-colors"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
