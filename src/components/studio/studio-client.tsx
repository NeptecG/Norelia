'use client'

/**
 * Client wrapper for GarmentDesigner — next/dynamic with ssr:false must live
 * inside a Client Component (not a Server Component) per Next.js 16 rules.
 */
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

// Localized loading placeholder shown while the designer chunk loads. Lives in
// its own component so it can use the intl context provided by the locale layout.
function DesignerLoading() {
  const t = useTranslations('GarmentDesigner')
  return (
    <div className="flex items-center justify-center py-32">
      <p className="font-body text-xs tracking-[0.2em] uppercase text-on-surface-muted">
        {t('loadingDesigner')}
      </p>
    </div>
  )
}

const GarmentDesignerLazy = dynamic(
  () => import('@/components/studio/garment-designer').then((m) => ({ default: m.GarmentDesigner })),
  {
    ssr: false,
    loading: () => <DesignerLoading />,
  },
)

export function StudioClient() {
  return <GarmentDesignerLazy />
}
