'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/navigation'
import { FlagGreece } from '@/components/icons/flag-greece'
import { FlagUK } from '@/components/icons/flag-uk'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: 'el' | 'en') {
    if (next === locale) return
    router.replace(pathname, { locale: next })
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => switchLocale('el')}
        aria-label="Switch to Greek"
        className={cn(
          'flex items-center gap-1.5 font-body text-[10px] tracking-[0.12em] uppercase transition-opacity duration-150',
          locale === 'el' ? 'opacity-100' : 'opacity-45 hover:opacity-70',
        )}
      >
        <FlagGreece className="w-5 h-3.5 rounded-[1px]" />
        EL
      </button>
      <button
        onClick={() => switchLocale('en')}
        aria-label="Switch to English"
        className={cn(
          'flex items-center gap-1.5 font-body text-[10px] tracking-[0.12em] uppercase transition-opacity duration-150',
          locale === 'en' ? 'opacity-100' : 'opacity-45 hover:opacity-70',
        )}
      >
        <FlagUK className="w-5 h-3.5 rounded-[1px]" />
        EN
      </button>
    </div>
  )
}
