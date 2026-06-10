'use client'

import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useUIStore } from '@/stores/ui-store'

export function SignInModal() {
  const { showSignIn, setShowSignIn } = useUIStore()
  const [tab, setTab] = useState<'signin' | 'register'>('signin')
  const [showSignInPw, setShowSignInPw] = useState(false)
  const [showRegisterPw, setShowRegisterPw] = useState(false)
  const t = useTranslations('SignInModal')

  return (
    <Dialog open={showSignIn} onOpenChange={(open) => { if (!open) { setShowSignIn(false); setTab('signin') } }}>
      <DialogContent className="dark bg-surface-alt p-0 max-w-[420px]" showCloseButton={false}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-display text-2xl tracking-[0.14em] text-on-surface">
            {tab === 'signin' ? t('signInTitle') : t('registerTitle')}
          </h2>
          <button
            type="button"
            aria-label={t('close')}
            onClick={() => setShowSignIn(false)}
            className="w-11 h-11 flex items-center justify-center text-on-surface/50 hover:text-on-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mx-6">
          {(['signin', 'register'] as const).map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setTab(tabKey)}
              className={cn(
                'flex-1 pb-2 font-body text-[10px] tracking-[0.18em] uppercase transition-colors',
                tab === tabKey
                  ? 'text-on-surface border-b-2 border-on-surface -mb-px'
                  : 'text-on-surface/40 hover:text-on-surface/70',
              )}
            >
              {tabKey === 'signin' ? t('signInTab') : t('registerTab')}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="px-6 pb-6 pt-4">
          {tab === 'signin' ? (
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <label htmlFor="signin-email" className="sr-only">{t('emailLabel')}</label>
              <input
                id="signin-email"
                type="email"
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
              />
              <label htmlFor="signin-password" className="sr-only">{t('passwordLabel')}</label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showSignInPw ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  autoComplete="current-password"
                  className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
                />
                <button
                  type="button"
                  aria-label={showSignInPw ? t('hidePassword') : t('showPassword')}
                  onClick={() => setShowSignInPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/40 hover:text-on-surface transition-colors"
                >
                  {showSignInPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  className="font-body text-[10px] tracking-[0.08em] text-on-surface/40 hover:text-on-surface/70 transition-colors"
                >
                  {t('forgotPassword')}
                </button>
              </div>
              <button
                type="submit"
                className="mt-1 bg-on-surface text-surface w-full py-3 font-body text-[10px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                {t('signInButton')}
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <label htmlFor="register-name" className="sr-only">{t('nameLabel')}</label>
              <input
                id="register-name"
                type="text"
                placeholder={t('namePlaceholder')}
                autoComplete="name"
                className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
              />
              <label htmlFor="register-email" className="sr-only">{t('emailLabel')}</label>
              <input
                id="register-email"
                type="email"
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
              />
              <label htmlFor="register-password" className="sr-only">{t('passwordLabel')}</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showRegisterPw ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  autoComplete="new-password"
                  className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
                />
                <button
                  type="button"
                  aria-label={showRegisterPw ? t('hidePassword') : t('showPassword')}
                  onClick={() => setShowRegisterPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/40 hover:text-on-surface transition-colors"
                >
                  {showRegisterPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                type="submit"
                className="mt-1 bg-on-surface text-surface w-full py-3 font-body text-[10px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                {t('createButton')}
              </button>
            </form>
          )}

          <p className="mt-4 text-center font-body text-[10px] text-on-surface/30 tracking-wide">
            {t('comingSoon')}
          </p>
        </div>

      </DialogContent>
    </Dialog>
  )
}
