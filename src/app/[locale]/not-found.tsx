import Link from 'next/link'
import { BRAND } from '@/lib/constants'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <p className="font-display text-[120px] leading-none text-border-subtle select-none">404</p>
      <h1 className="font-display text-4xl tracking-widest text-on-surface mb-4">Page Not Found</h1>
      <p className="font-body text-sm tracking-widest uppercase text-on-surface-muted mb-10">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="border border-on-surface px-8 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-on-surface transition-colors hover:bg-on-surface hover:text-surface"
      >
        Back to {BRAND}
      </Link>
    </div>
  )
}
