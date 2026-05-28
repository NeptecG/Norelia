'use client'

import { useRouter } from '@/navigation'
import { useTranslations } from 'next-intl'

export function BackButton() {
  const router = useRouter()
  const t = useTranslations('BackButton')
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 font-body text-[10px] tracking-[0.18em] uppercase text-on-surface/55 hover:text-on-surface transition-colors mb-10"
    >
      {t('label')}
    </button>
  )
}
