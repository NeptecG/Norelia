import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Design Your Own',
  description: `Custom garment designer — ${BRAND}`,
}

export default function StudioPage() {
  return (
    <main className="min-h-screen pt-20 px-8 bg-surface">
      <p className="font-display text-4xl text-on-surface">Studio (shell)</p>
    </main>
  )
}
