import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BRAND } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms and conditions for purchasing from ${BRAND}`,
}

export default async function TermsPage() {
  const t = await getTranslations('Terms')

  return (
    <main className="min-h-screen bg-surface">

      {/* Dark hero band */}
      <section className="dark bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <BackButton />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="font-display text-7xl md:text-[7rem] text-on-surface leading-none whitespace-pre-line">
            {t('heading')}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="max-w-[760px]">

          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-16">
            {t('intro', { brand: BRAND })}
          </p>

          {/* Section 1 */}
          <div className="border-t border-border-subtle pt-10 mb-12">
            <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">01</p>
            <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">{t('section1Title')}</h2>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">{t('section1Detail')}</p>
          </div>

          {/* Section 2 */}
          <div className="border-t border-border-subtle pt-10 mb-12">
            <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">02</p>
            <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">{t('section2Title')}</h2>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">{t('section2Detail')}</p>
          </div>

          {/* Section 3 */}
          <div className="border-t border-border-subtle pt-10 mb-12">
            <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">03</p>
            <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">{t('section3Title')}</h2>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">{t('section3Detail')}</p>
          </div>

          {/* Section 4 — uses brand interpolation */}
          <div className="border-t border-border-subtle pt-10 mb-12">
            <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">04</p>
            <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">{t('section4Title')}</h2>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">{t('section4Detail', { brand: BRAND })}</p>
          </div>

          {/* Section 5 — uses brand interpolation */}
          <div className="border-t border-border-subtle pt-10 mb-12">
            <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">05</p>
            <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">{t('section5Title')}</h2>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">{t('section5Detail', { brand: BRAND })}</p>
          </div>

          {/* Section 6 */}
          <div className="border-t border-border-subtle pt-10 mb-12">
            <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">06</p>
            <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">{t('section6Title')}</h2>
            <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">{t('section6Detail')}</p>
          </div>

          <div className="bg-surface-raised px-6 py-5 mt-4">
            <p className="font-body text-[12px] text-on-surface-muted leading-[1.8]">
              <strong className="text-on-surface">{t('noteStrong')}</strong>
              {t('note')}
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
