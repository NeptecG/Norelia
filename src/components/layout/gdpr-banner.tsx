'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useMounted } from '@/hooks/use-mounted'

const CONSENT_KEY = 'norelia_gdpr_consent'
const PREFS_KEY   = 'norelia_gdpr_prefs'

// ── GDPRBanner ─────────────────────────────────────────────────────────────────

export function GDPRBanner() {
  const t = useTranslations('GDPRBanner')

  // Hydration safety: the server (and the client's hydrating render) must output
  // the same thing. `useMounted` returns false on the server and during the
  // hydrating render, then true afterwards — so the banner is never present in
  // the first client render and cannot diverge from the server HTML (React #418).
  // `consent` is read once from localStorage in the initializer; its value is
  // irrelevant until `mounted` is true, so no mismatch occurs. The banner then
  // animates in from the bottom, making the post-mount reveal feel intentional.
  const mounted = useMounted()
  const [consent, setConsent] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(CONSENT_KEY)
  })
  const visible = mounted && !consent
  const [showPrefs,  setShowPrefs]  = useState(false)
  const [analytics,  setAnalytics]  = useState(false)
  const [marketing,  setMarketing]  = useState(false)
  const shouldReduceMotion = useReducedMotion()

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    localStorage.setItem(PREFS_KEY, JSON.stringify({ analytics: true, marketing: true }))
    setConsent(true)
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined')
    localStorage.setItem(PREFS_KEY, JSON.stringify({ analytics: false, marketing: false }))
    setConsent(true)
  }

  function savePrefs() {
    localStorage.setItem(CONSENT_KEY, 'custom')
    localStorage.setItem(PREFS_KEY, JSON.stringify({ analytics, marketing }))
    setConsent(true)
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
          <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] py-5">

            {/* ── Main row ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">

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
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <button
                  onClick={() => setShowPrefs(v => !v)}
                  className="font-body text-[10px] tracking-[0.18em] uppercase text-on-surface/40 hover:text-on-surface transition-colors duration-200 underline underline-offset-4"
                >
                  {t('manage')}
                </button>
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

            {/* ── Manage Preferences panel ── */}
            <AnimatePresence>
              {showPrefs && (
                <motion.div
                  key="prefs-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 mt-5 border-t border-on-surface/10 grid grid-cols-1 sm:grid-cols-3 gap-5">

                    {/* Strictly Necessary */}
                    <div className="flex items-start gap-3">
                      {/* Always-on toggle (visual only, disabled) */}
                      <div aria-hidden="true" className="shrink-0 mt-0.5 relative w-9 h-5 rounded-full bg-on-surface/25">
                        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-on-surface/40 rounded-full" />
                      </div>
                      <div>
                        <p className="font-body text-[10px] tracking-[0.12em] uppercase text-on-surface font-semibold mb-0.5">
                          {t('prefNecessary')}
                        </p>
                        <p className="font-body text-[9px] tracking-[0.04em] text-on-surface/45 leading-[1.6]">
                          {t('prefNecessaryDesc')}
                        </p>
                        <p className="font-body text-[9px] tracking-[0.12em] uppercase text-on-surface/35 mt-1">
                          {t('prefAlwaysOn')}
                        </p>
                      </div>
                    </div>

                    {/* Performance / Analytics */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={analytics}
                        onClick={() => setAnalytics(v => !v)}
                        className={cn(
                          'shrink-0 mt-0.5 relative w-9 h-5 rounded-full transition-colors duration-200',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface',
                          analytics ? 'bg-on-surface' : 'bg-on-surface/20',
                        )}
                      >
                        <span className={cn(
                          'absolute top-0.5 w-4 h-4 bg-surface rounded-full transition-transform duration-200',
                          analytics ? 'translate-x-[18px]' : 'translate-x-0.5',
                        )} />
                      </button>
                      <div>
                        <p className="font-body text-[10px] tracking-[0.12em] uppercase text-on-surface font-semibold mb-0.5">
                          {t('prefAnalytics')}
                        </p>
                        <p className="font-body text-[9px] tracking-[0.04em] text-on-surface/45 leading-[1.6]">
                          {t('prefAnalyticsDesc')}
                        </p>
                      </div>
                    </div>

                    {/* Marketing */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={marketing}
                        onClick={() => setMarketing(v => !v)}
                        className={cn(
                          'shrink-0 mt-0.5 relative w-9 h-5 rounded-full transition-colors duration-200',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface',
                          marketing ? 'bg-on-surface' : 'bg-on-surface/20',
                        )}
                      >
                        <span className={cn(
                          'absolute top-0.5 w-4 h-4 bg-surface rounded-full transition-transform duration-200',
                          marketing ? 'translate-x-[18px]' : 'translate-x-0.5',
                        )} />
                      </button>
                      <div>
                        <p className="font-body text-[10px] tracking-[0.12em] uppercase text-on-surface font-semibold mb-0.5">
                          {t('prefMarketing')}
                        </p>
                        <p className="font-body text-[9px] tracking-[0.04em] text-on-surface/45 leading-[1.6]">
                          {t('prefMarketingDesc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={savePrefs}
                      className="font-body text-[10px] tracking-[0.18em] uppercase bg-on-surface text-surface px-6 py-2.5 hover:opacity-90 transition-opacity"
                    >
                      {t('prefSave')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
