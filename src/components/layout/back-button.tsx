'use client'

import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 font-body text-[10px] tracking-[0.18em] uppercase text-on-surface/55 hover:text-on-surface transition-colors mb-10"
    >
      ← Back
    </button>
  )
}
