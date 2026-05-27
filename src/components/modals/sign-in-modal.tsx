'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useUIStore } from '@/stores/ui-store'

export function SignInModal() {
  const { showSignIn, setShowSignIn } = useUIStore()
  const [tab, setTab] = useState<'signin' | 'register'>('signin')

  return (
    <Dialog open={showSignIn} onOpenChange={(open) => { if (!open) { setShowSignIn(false); setTab('signin') } }}>
      <DialogContent className="dark bg-surface-alt p-0 max-w-[420px]" showCloseButton={false}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-display text-2xl tracking-[0.14em] text-on-surface">
            {tab === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowSignIn(false)}
            className="text-on-surface/50 hover:text-on-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mx-6">
          {(['signin', 'register'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 pb-2 font-body text-[10px] tracking-[0.18em] uppercase transition-colors',
                tab === t
                  ? 'text-on-surface border-b-2 border-on-surface -mb-px'
                  : 'text-on-surface/40 hover:text-on-surface/70',
              )}
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="px-6 pb-6 pt-4">
          {tab === 'signin' ? (
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
              />
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
              />
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  className="font-body text-[10px] tracking-[0.08em] text-on-surface/40 hover:text-on-surface/70 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
              <button
                type="submit"
                className="mt-1 bg-on-surface text-surface w-full py-3 font-body text-[10px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
              />
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
              />
              <input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                className="bg-on-surface/10 border-none outline-none text-on-surface placeholder:text-on-surface/40 px-4 py-3 w-full font-body text-[12px]"
              />
              <button
                type="submit"
                className="mt-1 bg-on-surface text-surface w-full py-3 font-body text-[10px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                Create Account
              </button>
            </form>
          )}

          <p className="mt-4 text-center font-body text-[10px] text-on-surface/30 tracking-wide">
            UI only · authentication coming soon
          </p>
        </div>

      </DialogContent>
    </Dialog>
  )
}
