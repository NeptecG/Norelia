import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'
import { StudioClient } from '@/components/studio/studio-client'

export const metadata: Metadata = {
  title: 'Design Your Own',
  description: `Custom garment designer by ${BRAND}`,
}

export default function StudioPage() {
  return (
    <main className="min-h-screen pt-20 bg-surface">
      {/* max-w-[1440px] / md:px-[60px] — project-wide content container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">
        <h1 className="font-display text-6xl text-on-surface leading-none mb-10">DESIGN YOUR OWN</h1>
        <StudioClient />
      </div>
    </main>
  )
}
