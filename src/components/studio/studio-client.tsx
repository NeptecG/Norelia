'use client'

/**
 * Client wrapper for GarmentDesigner — next/dynamic with ssr:false must live
 * inside a Client Component (not a Server Component) per Next.js 16 rules.
 */
import dynamic from 'next/dynamic'

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

export function StudioClient() {
  return <GarmentDesignerLazy />
}
