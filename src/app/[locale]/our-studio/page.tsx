import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BRAND } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Our Studio',
  description: `Visit the ${BRAND} studio in Preveza, Greece. We design, print, and ship from here.`,
}

export default async function OurStudioPage() {
  const t = await getTranslations('OurStudio')

  return (
    <main className="dark min-h-screen bg-surface-alt text-on-surface">

      {/* ── Header ── */}
      <div className="max-w-[1440px] mx-auto pt-32 px-4 md:px-[60px]">
        <BackButton />
        <p className="font-body text-[10px] tracking-[0.28em] uppercase text-on-surface/40 mb-2">
          {t('eyebrow', { brand: BRAND })}
        </p>
        <h1 className="font-display text-[64px] tracking-[0.06em] text-on-surface leading-none mb-12">
          {t('heading')}
        </h1>
      </div>

      {/* ── Map + info ── */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] pb-20 flex gap-16 flex-wrap items-start">

        {/* Map */}
        <div className="flex-[1_1_520px] min-w-[320px]">
          <div className="w-full aspect-[4/3] border border-on-surface/10 overflow-hidden">
            <iframe
              title={t('mapTitle')}
              src="https://maps.google.com/maps?q=38.971454,20.746212&z=17&output=embed"
              width="100%"
              height="100%"
              className="block border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://maps.google.com/?q=38.971454,20.746212"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 font-body text-[10px] tracking-[0.14em] uppercase text-on-surface/45 hover:text-on-surface/70 transition-colors underline"
          >
            {t('mapsLink')}
          </a>
        </div>

        {/* Info panel */}
        <div className="flex-[0_0_260px] pt-2">

          {/* Address */}
          <div className="mb-9">
            <p className="font-body text-[9px] tracking-[0.25em] uppercase text-on-surface/40 mb-3">
              {t('addressLabel')}
            </p>
            {([t('address1'), t('address2'), t('address3')] as string[]).map(l => (
              <p key={l} className="font-body text-[13px] text-on-surface/85 tracking-[0.04em] leading-loose">
                {l}
              </p>
            ))}
          </div>

          {/* Hours */}
          <div className="mb-9">
            <p className="font-body text-[9px] tracking-[0.25em] uppercase text-on-surface/40 mb-3">
              {t('hoursLabel')}
            </p>
            {([
              { day: t('monFri'),   hrs: t('monFriHours') },
              { day: t('saturday'), hrs: t('saturdayHours') },
              { day: t('sunday'),   hrs: t('closed') },
            ] as { day: string; hrs: string }[]).map(({ day, hrs }) => (
              <div key={day} className="flex justify-between mb-1.5">
                <span className="font-body text-[12px] text-on-surface/55 tracking-[0.04em]">{day}</span>
                <span className={cn(
                  'font-body text-[12px] tracking-[0.04em]',
                  hrs === t('closed') ? 'text-on-surface/30' : 'text-on-surface/85',
                )}>{hrs}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-[9px] tracking-[0.25em] uppercase text-on-surface/40 mb-3">
              {t('contactLabel')}
            </p>
            {(['hello@norelia.com', '+30 26820 00000'] as string[]).map(l => (
              <p key={l} className="font-body text-[13px] text-on-surface/85 tracking-[0.04em] leading-loose">
                {l}
              </p>
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div className="border-t border-on-surface/10 py-5 text-center">
        <p className="font-body text-[10px] tracking-[0.14em] uppercase text-on-surface/20">
          {t('strip', { brand: BRAND })}
        </p>
      </div>

    </main>
  )
}
