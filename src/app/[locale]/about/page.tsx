import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BRAND } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'About',
  description: `The story behind ${BRAND}, premium streetwear from Preveza, Greece.`,
}

export default async function AboutPage() {
  const t = await getTranslations('About')

  return (
    <main className="min-h-screen bg-surface">

      {/* ── Dark hero band ── */}
      <section className="dark bg-surface-alt pt-32 pb-[72px] px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <BackButton />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-3">
            {t('eyebrow')}
          </p>
          <h1 className="font-display text-7xl md:text-[88px] tracking-[0.04em] text-on-surface leading-[0.95] -ml-[0.0625em]">
            {t('heading', { brand: BRAND })}
          </h1>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">

        {/* Intro */}
        <div className="max-w-[720px] mb-20">
          <p className="font-display text-[22px] tracking-[0.14em] text-on-surface mb-5">
            {t('introTitle')}
          </p>
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-5">
            {t('intro1', { brand: BRAND })}
          </p>
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-5">
            {t('intro2', { brand: BRAND })}
          </p>
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em]">
            {t('intro3')}
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mb-20">
          <div className="bg-surface-raised px-9 py-10">
            <p className="font-display text-[13px] tracking-[0.22em] text-on-surface/30 mb-3.5">01</p>
            <p className="font-display text-2xl tracking-[0.1em] text-on-surface mb-4">{t('pillar01Title')}</p>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.8] tracking-[0.02em]">{t('pillar01Body')}</p>
          </div>
          <div className="bg-surface-raised px-9 py-10">
            <p className="font-display text-[13px] tracking-[0.22em] text-on-surface/30 mb-3.5">02</p>
            <p className="font-display text-2xl tracking-[0.1em] text-on-surface mb-4">{t('pillar02Title')}</p>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.8] tracking-[0.02em]">{t('pillar02Body')}</p>
          </div>
          <div className="bg-surface-raised px-9 py-10">
            <p className="font-display text-[13px] tracking-[0.22em] text-on-surface/30 mb-3.5">03</p>
            <p className="font-display text-2xl tracking-[0.1em] text-on-surface mb-4">{t('pillar03Title')}</p>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.8] tracking-[0.02em]">{t('pillar03Body')}</p>
          </div>
        </div>

        {/* Closing */}
        <div className="border-t border-border-subtle pt-12 max-w-[720px]">
          <p className="font-display text-[32px] tracking-[0.08em] text-on-surface mb-4">
            {t('closingTitle')}
          </p>
          <p className="font-body text-sm text-on-surface-muted leading-[1.85] tracking-[0.02em]">
            {t('closingBody', { brand: BRAND })}
          </p>
        </div>

      </section>
    </main>
  )
}
