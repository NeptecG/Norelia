import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BRAND } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Company Information',
  description: `Legal and commercial registry (Γ.Ε.ΜΗ.) details for ${BRAND}`,
}

export default async function CompanyPage() {
  const t = await getTranslations('Company')

  const rows: [string, string][] = [
    [t('labelGemi'),      t('valueGemi')],
    [t('labelOffice'),    t('valueOffice')],
    [t('labelPartners'),  t('valuePartners')],
    [t('labelManagers'),  t('valueManagers')],
  ]

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

          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-14">
            {t('intro', { brand: BRAND })}
          </p>

          {/* Registry details */}
          <dl className="border-t border-border-subtle">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-1 sm:grid-cols-[220px_1fr] sm:items-baseline gap-1.5 sm:gap-8 py-6 border-b border-border-subtle"
              >
                <dt className="font-body text-[10px] tracking-[0.22em] uppercase text-on-surface/45">{label}</dt>
                <dd className="font-body text-[15px] text-on-surface leading-relaxed tracking-[0.01em]">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Contact */}
          <div className="mt-16">
            <p className="font-display text-2xl tracking-[0.06em] text-on-surface mb-6">{t('contactHeading')}</p>
            <div className="flex flex-col items-start gap-2.5">
              <a
                href={`mailto:${t('email')}`}
                className="font-body text-[15px] text-on-surface hover:text-on-surface-muted transition-colors underline underline-offset-4 decoration-border-subtle"
              >
                {t('email')}
              </a>
              <a
                href={`tel:${t('tel').replace(/\s/g, '')}`}
                className="font-body text-[15px] text-on-surface hover:text-on-surface-muted transition-colors underline underline-offset-4 decoration-border-subtle"
              >
                {t('tel')}
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
