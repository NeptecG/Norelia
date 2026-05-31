import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BRAND } from '@/lib/constants'
import { StudioClient } from '@/components/studio/studio-client'

export const metadata: Metadata = {
  title: 'Design Your Own',
  description: `Custom garment designer by ${BRAND}`,
}

export default async function StudioPage() {
  const t = await getTranslations('GarmentDesigner')
  return (
    <main className="min-h-screen pt-20 bg-surface">
      {/* max-w-[1440px] / md:px-[60px] — project-wide content container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">
        {/* Page title — size intentionally left as text-6xl (not part of the font ramp-up) */}
        <h1 className="font-display text-6xl text-on-surface leading-none mb-10">{t('studioTitle')}</h1>
        <StudioClient />
      </div>
    </main>
  )
}
