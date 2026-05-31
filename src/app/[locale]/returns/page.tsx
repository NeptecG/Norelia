import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'Our returns and exchange policy.',
}

export default async function ReturnsPage() {
  const t = await getTranslations('Returns')

  const SECTIONS = [
    { titleKey: 'section1Title', detailKey: 'section1Detail' },
    { titleKey: 'section2Title', detailKey: 'section2Detail' },
    { titleKey: 'section3Title', detailKey: 'section3Detail' },
    { titleKey: 'section4Title', detailKey: 'section4Detail' },
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
          <h1 className="font-display text-7xl md:text-[7rem] text-on-surface leading-none -ml-[0.0625em]">
            {t('heading')}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="max-w-[760px]">

          {/* Intro */}
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-16">
            {t('intro')}
          </p>

          {/* Numbered sections */}
          {SECTIONS.map(({ titleKey, detailKey }, i) => (
            <div key={titleKey} className="border-t border-border-subtle pt-10 mb-12">
              <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">
                0{i + 1}
              </p>
              <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">
                {t(titleKey)}
              </h2>
              <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">
                {t(detailKey)}
              </p>
            </div>
          ))}

          {/* Note box */}
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
