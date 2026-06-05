import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: `Shipping and returns information. Free delivery over €${FREE_SHIPPING_THRESHOLD}.`,
}

export default async function ShippingReturnsPage() {
  const t = await getTranslations('Shipping')
  const r = await getTranslations('Returns')

  const METHODS = [
    { titleKey: 'method1Title', timeKey: 'method1Time', priceKey: 'method1Price', detailKey: 'method1Detail' },
    { titleKey: 'method2Title', timeKey: 'method2Time', priceKey: 'method2Price', detailKey: 'method2Detail' },
    { titleKey: 'method3Title', timeKey: 'method3Time', priceKey: 'method3Price', detailKey: 'method3Detail' },
  ] as const

  const RETURN_SECTIONS = [
    { titleKey: 'section1Title', detailKey: 'section1Detail' },
    { titleKey: 'section2Title', detailKey: 'section2Detail' },
    { titleKey: 'section3Title', detailKey: 'section3Detail' },
    { titleKey: 'section4Title', detailKey: 'section4Detail' },
    { titleKey: 'section5Title', detailKey: 'section5Detail' },
  ] as const

  return (
    <main className="min-h-screen bg-surface">

      {/* Dark hero band */}
      <section className="dark bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <BackButton />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="font-display text-7xl md:text-[7rem] text-on-surface leading-none whitespace-pre-line -ml-[0.0625em]">
            {t('combinedHeading')}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="max-w-[760px]">

          {/* ── Shipping ── */}
          <h2 className="font-display text-4xl tracking-[0.04em] text-on-surface leading-none -ml-[0.0625em] mb-6">
            {t('heading')}
          </h2>
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-16">
            {t('intro')}
          </p>

          {METHODS.map(({ titleKey, timeKey, priceKey, detailKey }, i) => (
            <div key={titleKey} className="border-t border-border-subtle pt-10 mb-12">
              <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">0{i + 1}</p>
              <div className="flex justify-between items-start gap-4 mb-5 flex-wrap">
                <h3 className="font-display text-2xl tracking-[0.06em] text-on-surface">{t(titleKey)}</h3>
                <div className="text-right shrink-0">
                  <p className="font-body text-[11px] tracking-[0.1em] uppercase text-on-surface font-bold">{t(timeKey)}</p>
                  <p className="font-body text-[11px] text-on-surface-muted mt-1">
                    {priceKey === 'method1Price'
                      ? t('method1Price', { threshold: FREE_SHIPPING_THRESHOLD })
                      : t(priceKey)}
                  </p>
                </div>
              </div>
              <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">
                {t(detailKey)}
              </p>
            </div>
          ))}

          <div className="bg-surface-raised px-6 py-5 mt-4">
            <p className="font-body text-[12px] text-on-surface-muted leading-[1.8]">
              <strong className="text-on-surface">{t('noteStrong')}</strong>
              {t('note')}
            </p>
          </div>

          {/* ── Returns & Exchanges ── */}
          <div className="border-t border-border pt-16 mt-24">
            <h2 className="font-display text-4xl tracking-[0.04em] text-on-surface leading-none -ml-[0.0625em] mb-6">
              {r('heading')}
            </h2>
            <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-16">
              {r('intro')}
            </p>

            {RETURN_SECTIONS.map(({ titleKey, detailKey }, i) => (
              <div key={titleKey} className="border-t border-border-subtle pt-10 mb-12">
                <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">0{i + 1}</p>
                <h3 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">{r(titleKey)}</h3>
                <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">
                  {r(detailKey)}
                </p>
              </div>
            ))}

            <div className="bg-surface-raised px-6 py-5 mt-4">
              <p className="font-body text-[12px] text-on-surface-muted leading-[1.8]">
                <strong className="text-on-surface">{r('noteStrong')}</strong>
                {r('note')}
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
