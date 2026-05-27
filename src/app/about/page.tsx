import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'About',
  description: `The story behind ${BRAND} — premium streetwear from Preveza, Greece.`,
}

const PILLARS = [
  {
    num:   '01',
    title: 'Design First',
    body:  'Every piece starts with a sketch, not a sales target. We design for the garment, then figure out the rest.',
  },
  {
    num:   '02',
    title: 'Made to Last',
    body:  "We use heavyweight, high-quality fabrics because fast fashion isn't something we believe in. Buy less, wear more.",
  },
  {
    num:   '03',
    title: 'Your Way',
    body:  "Our studio lets you customise any piece — colours, prints, placement. If you're going to wear something, it should be yours.",
  },
] as const

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">

      {/* ── Dark hero band ── */}
      <section className="bg-surface-alt pt-32 pb-[72px] px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <BackButton />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-3">
            Est. 2024 · Preveza, Greece
          </p>
          <h1 className="font-display text-7xl md:text-[88px] tracking-[0.04em] text-on-surface leading-[0.95]">
            About<br />{BRAND}.
          </h1>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">

        {/* Intro */}
        <div className="max-w-[720px] mb-20">
          <p className="font-display text-[22px] tracking-[0.14em] text-on-surface mb-5">
            Born in the West of Greece.
          </p>
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-5">
            {BRAND}. started the way most things worth doing start — with frustration. We couldn&apos;t
            find streetwear that felt both premium and personal, both sharp and wearable in the heat of
            a Greek summer. So we made our own.
          </p>
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-5">
            Founded in Preveza in 2024, {BRAND}. is a small independent label built around one idea:
            that where you&apos;re from shouldn&apos;t limit what you wear. We design pieces that can
            move from the streets of a quiet Greek town to the front row of anything — no apology
            required.
          </p>
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em]">
            Everything is designed in-house. Every drop is intentional. We don&apos;t chase trends —
            we make things we&apos;d actually wear, and trust that the right people will find them.
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mb-20">
          {PILLARS.map(({ num, title, body }) => (
            <div key={num} className="bg-surface-raised px-9 py-10">
              <p className="font-display text-[13px] tracking-[0.22em] text-on-surface/30 mb-3.5">{num}</p>
              <p className="font-display text-2xl tracking-[0.1em] text-on-surface mb-4">{title}</p>
              <p className="font-body text-[13px] text-on-surface-muted leading-[1.8] tracking-[0.02em]">{body}</p>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div className="border-t border-border-subtle pt-12 max-w-[720px]">
          <p className="font-display text-[32px] tracking-[0.08em] text-on-surface mb-4">
            Still just getting started.
          </p>
          <p className="font-body text-sm text-on-surface-muted leading-[1.85] tracking-[0.02em]">
            {BRAND}. is young, intentionally small, and not in a hurry. We&apos;d rather get it right
            than get it fast. Follow along — the best is still ahead.
          </p>
        </div>

      </section>
    </main>
  )
}
