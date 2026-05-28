'use client'

import { Dialog } from '@base-ui/react/dialog'
import { useTranslations } from 'next-intl'
import { useUIStore } from '@/stores/ui-store'
import { BRAND, CONTACT_EMAIL } from '@/lib/constants'

export function CheckoutComingSoonModal() {
  const { showCheckoutModal, setShowCheckoutModal } = useUIStore()
  const t = useTranslations('CheckoutComingSoonModal')

  return (
    <Dialog.Root
      open={showCheckoutModal}
      onOpenChange={(open) => { if (!open) setShowCheckoutModal(false) }}
    >
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/75 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        {/* Panel — forced dark so all tokens resolve to their dark values */}
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[420px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden outline-none dark bg-surface shadow-[0_40px_100px_rgba(0,0,0,0.7)] duration-200 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-3 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-3">

          {/* Destructive-red accent line */}
          <div className="h-px w-full bg-destructive" aria-hidden="true" />

          {/* NORELIA. ghost watermark — purely decorative */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            <span className="font-display text-[148px] leading-none tracking-[0.05em] text-on-surface/[0.025] whitespace-nowrap">
              {BRAND}
            </span>
          </div>

          {/* Foreground content */}
          <div className="relative z-10 px-11 pb-11 pt-12 text-center">

            {/* ✕ close icon — top-right corner */}
            <Dialog.Close
              aria-label="Close dialog"
              className="absolute top-4 right-5 bg-transparent border-0 cursor-pointer leading-none text-base text-on-surface/25 hover:text-on-surface/70 transition-colors"
            >
              ✕
            </Dialog.Close>

            {/* Eyebrow — ultra-small, wide tracking, very faded */}
            <p className="font-body text-[9px] tracking-[0.4em] text-on-surface/20 mb-5">
              {t('label')}
            </p>

            {/* Main heading */}
            <Dialog.Title className="font-display text-6xl tracking-[0.05em] text-on-surface leading-none mb-5">
              {t('heading')}
            </Dialog.Title>

            {/* Divider · red centre dot */}
            <div className="flex items-center justify-center gap-3 mb-7" aria-hidden="true">
              <div className="flex-1 h-px bg-on-surface/10" />
              <div className="size-1 rounded-full bg-destructive" />
              <div className="flex-1 h-px bg-on-surface/10" />
            </div>

            {/* Body copy with email link */}
            <Dialog.Description className="font-body text-xs text-on-surface/45 tracking-[0.04em] leading-[1.95] mb-9">
              {t('bodyBefore')}{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-on-surface font-semibold no-underline border-b border-on-surface/35 pb-px hover:border-on-surface transition-[border-color]"
              >
                {CONTACT_EMAIL}
              </a>
              {' '}{t('bodyAfter')}
            </Dialog.Description>

            {/* Dismiss CTA — ghost → solid on hover */}
            <Dialog.Close className="block w-full border border-on-surface/30 py-4 font-body text-[10px] tracking-[0.25em] font-bold text-on-surface/85 hover:bg-on-surface hover:text-surface transition-all cursor-pointer bg-transparent">
              {t('gotIt')}
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
