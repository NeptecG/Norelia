import { BRAND } from '@/lib/constants'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface">
      <p className="font-display text-6xl tracking-widest text-on-surface">{BRAND}</p>
    </main>
  )
}
