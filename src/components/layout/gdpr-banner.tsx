'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const CONSENT_KEY = 'norelia_gdpr_consent'

// ── GDPRBanner ─────────────────────────────────────────────────────────────────

export function GDPRBanner() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) setVisible(true)
  }, [])

  if (!mounted) return null

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
          )}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <p className="font-body text-[12px] tracking-[0.06em] text-on-surface/70">
              We use cookies to enhance your experience.{' '}
              <Link href="/privacy" className="underline text-on-surface/60 hover:text-on-surface transition-colors duration-200">
                Learn more
              </Link>
            </p>

            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={accept}
                aria-label="Accept cookies"
                className={cn(
                  'font-body text-[10px] tracking-[0.2em] uppercase',
                  'bg-on-surface text-surface px-5 py-2',
                  'hover:opacity-90 transition-opacity duration-200',
                )}
              >
                Accept
              </button>
              <button
                onClick={decline}
                aria-label="Decline cookies"
                className={cn(
                  'font-body text-[10px] tracking-[0.2em] uppercase',
                  'text-on-surface/50 hover:text-on-surface transition-colors duration-200',
                )}
              >
                Decline
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
