import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Design Your Own',
  description: `Custom garment designer — ${BRAND}`,
}

const GarmentDesignerLazy = dynamic(
  () => import('@/components/studio/garment-designer').then((m) => ({ default: m.GarmentDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-32">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-on-surface-muted">
          Loading designer…
        </p>
      </div>
    ),
  },
)

export default function StudioPage() {
  return (
    <main className="min-h-screen pt-20 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">
        <h1 className="font-display text-6xl text-on-surface leading-none mb-10">DESIGN YOUR OWN</h1>
        <GarmentDesignerLazy />
      </div>
    </main>
  )
}
