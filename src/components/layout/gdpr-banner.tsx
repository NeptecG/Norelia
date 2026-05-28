'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

const CONSENT_KEY = 'norelia_gdpr_consent'

// ── GDPRBanner ─────────────────────────────────────────────────────────────────

export function GDPRBanner() {
  const t = useTranslations('GDPRBanner')
  const [visible, setVisible] = useState<boolean>(
    () => typeof window !== 'undefined' && !localStorage.getItem(CONSENT_KEY),
  )
  const shouldReduceMotion = useReducedMotion()

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  const variants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 80 } }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="gdpr-banner"
          role="region"
          aria-label="Cookie consent"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'dark',
            'fixed bottom-0 left-0 right-0 z-[1500]',
            'bg-surface-alt border-t border-border',
            'shadow-[0_-8px_32px_rgba(0,0,0,0.4)]',
          )}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-display text-[15px] tracking-[0.14em] text-on-surface mb-1.5">
                {t('title')}
              </p>
              <p className="font-body text-[11px] tracking-[0.04em] leading-[1.7] text-on-surface/55 max-w-[600px]">
                {t('body')}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={decline}
                aria-label={t('declineLabel')}
                className={cn(
                  'font-body text-[10px] tracking-[0.18em] uppercase',
                  'border border-on-surface/25 hover:border-on-surface/60',
                  'text-on-surface/50 hover:text-on-surface',
                  'px-5 py-2.5 transition-colors duration-200',
                )}
              >
                {t('decline')}
              </button>
              <button
                onClick={accept}
                aria-label={t('acceptLabel')}
                className={cn(
                  'font-body text-[10px] tracking-[0.18em] uppercase font-bold',
                  'bg-on-surface text-surface',
                  'px-6 py-2.5 hover:opacity-90 transition-opacity duration-200',
                )}
              >
                {t('acceptAll')}
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
