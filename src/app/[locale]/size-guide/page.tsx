import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'
import { SIZE_DATA } from '@/data/sizes'
import { SizeTable } from '@/components/size-guide/size-table'
import { MaleFigure } from '@/components/size-guide/male-figure'
import { FemaleFigure } from '@/components/size-guide/female-figure'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = { title: 'Size Guide' }

const VALID_GENDERS = ['men', 'women'] as const
const VALID_GARMENTS = ['tshirt', 'hoodie', 'zipper'] as const

type ValidGender  = typeof VALID_GENDERS[number]
type ValidGarment = typeof VALID_GARMENTS[number]

interface Props {
  searchParams: Promise<{ gender?: string; garment?: string }>
}

function isValidGender(v: string | undefined): v is ValidGender {
  return (VALID_GENDERS as readonly string[]).includes(v ?? '')
}

function isValidGarment(v: string | undefined): v is ValidGarment {
  return (VALID_GARMENTS as readonly string[]).includes(v ?? '')
}

export default async function SizeGuidePage({ searchParams }: Props) {
  const t       = await getTranslations('SizeGuide')
  const params  = await searchParams
  const gender  = isValidGender(params.gender)   ? params.gender   : 'men'
  const garment = isValidGarment(params.garment) ? params.garment  : 'tshirt'
  const rows    = SIZE_DATA[garment][gender]

  const garmentTabs: { label: string; key: ValidGarment }[] = [
    { label: t('tshirtsTab'), key: 'tshirt' },
    { label: t('hoodiesTab'), key: 'hoodie' },
    { label: t('zippersTab'), key: 'zipper' },
  ]

  const genderLabels: Record<ValidGender, string> = {
    men:   t('menTitle').toUpperCase(),
    women: t('womenTitle').toUpperCase(),
  }

  return (
    <main className="min-h-screen pt-20 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">
        <BackButton />
        <p className="font-body text-[10px] tracking-[0.3em] text-on-surface/40 mb-3 uppercase">
          {t('eyebrow')}
        </p>
        <h1 className="font-display text-4xl tracking-[0.12em] text-on-surface mb-4">
          {t('heading')}
        </h1>

        <p className="font-body text-[13px] text-on-surface-muted leading-[1.8] tracking-[0.02em] mb-8 max-w-[600px]">
          {t('intro')}
        </p>

        {/* Gender tab strip */}
        <div className="flex gap-2 mb-4">
          {VALID_GENDERS.map((g) => {
            const isActive = g === gender
            return (
              <Link
                key={g}
                href={`?gender=${g}&garment=${garment}`}
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? 'font-body text-xs tracking-[0.14em] uppercase px-4 py-2 bg-on-surface text-surface'
                    : 'font-body text-xs tracking-[0.14em] uppercase px-4 py-2 text-on-surface border border-border'
                }
              >
                {genderLabels[g]}
              </Link>
            )
          })}
        </div>

        {/* Garment tab strip */}
        <div className="flex gap-2 mb-6">
          {garmentTabs.map(({ label, key }) => {
            const isActive = key === garment
            return (
              <Link
                key={key}
                href={`?gender=${gender}&garment=${key}`}
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? 'font-body text-xs tracking-[0.14em] uppercase px-4 py-2 bg-on-surface text-surface'
                    : 'font-body text-xs tracking-[0.14em] uppercase px-4 py-2 text-on-surface border border-border'
                }
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Two-column: figure left, table right (desktop). Stacked on mobile. */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 mt-8">
          {/* figure sidebar: 200px fixed — text-on-surface so currentColor = dark silhouette fill */}
          <div className="text-on-surface">
            {gender === 'women' ? <FemaleFigure /> : <MaleFigure />}
          </div>

          {/* Size table */}
          <div>
            <SizeTable rows={rows} gender={gender} />
          </div>
        </div>

        {/* How to measure */}
        <div className="mt-10 border-t border-border pt-8 max-w-[600px]">
          <p className="font-display text-[13px] tracking-[0.2em] text-on-surface mb-5 uppercase">
            {t('measureTitle')}
          </p>
          <ul className="space-y-2">
            <li className="font-body text-[12px] text-on-surface-muted leading-[1.7]">{t('measureChest')}</li>
            <li className="font-body text-[12px] text-on-surface-muted leading-[1.7]">{t('measureWaist')}</li>
            <li className="font-body text-[12px] text-on-surface-muted leading-[1.7]">{t('measureHip')}</li>
          </ul>
          <Link
            href="/studio"
            className="inline-block mt-5 font-body text-[11px] tracking-[0.15em] text-on-surface-muted hover:text-on-surface transition-colors"
          >
            {t('studioLink')}
          </Link>
        </div>

        <p className="mt-6 font-body text-xs text-on-surface-muted">{t('measureNote')}</p>
      </div>
    </main>
  )
}
