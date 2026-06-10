'use client'

import { useRouter } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Arrow } from '@/components/icons/arrow'

export function BackButton() {
  const router = useRouter()
  const t = useTranslations('BackButton')
  return (
    <button
      onClick={() => {
        try {
          if (document.referrer && new URL(document.referrer).hostname === window.location.hostname) {
            router.back()
            return
          }
        } catch { /* ignore malformed referrer */ }
        router.push('/')
      }}
      className="group relative inline-flex items-center gap-2 font-body text-[10px] tracking-[0.18em] uppercase text-on-surface/55 hover:text-on-surface transition-colors mb-10"
    >
      <Arrow />
      {t('label')}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-0 right-0 h-px bg-on-surface origin-left scale-x-0 transition-transform duration-[280ms] group-hover:scale-x-100"
      />
    </button>
  )
}
