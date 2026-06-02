'use client'

import { Link } from '@/navigation'
import { Arrow } from '@/components/icons/arrow'

// Checkout back link: shared arrow + a footer-style underline that draws in on
// hover (the "drawer" effect).
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-2 font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-muted hover:text-on-surface transition-colors mb-8"
    >
      <Arrow />
      {label}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-0 right-0 h-px bg-on-surface origin-left scale-x-0 transition-transform duration-[280ms] group-hover:scale-x-100"
      />
    </Link>
  )
}
