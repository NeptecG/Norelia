'use client'

import { useTranslations } from 'next-intl'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useUIStore } from '@/stores/ui-store'

export function CheckoutComingSoonModal() {
  const { showCheckoutModal, setShowCheckoutModal } = useUIStore()
  const t = useTranslations('CheckoutComingSoonModal')

  return (
    <Dialog open={showCheckoutModal} onOpenChange={(open) => { if (!open) setShowCheckoutModal(false) }}>
      <DialogContent className="dark bg-surface-alt max-w-[400px]" showCloseButton>
        <h2 className="font-display text-2xl tracking-[0.14em] text-on-surface">
          {t('title')}
        </h2>
        <p className="font-body text-[13px] text-on-surface/70 leading-relaxed mt-2">
          {t('body')}
        </p>
        <button
          type="button"
          onClick={() => setShowCheckoutModal(false)}
          className="mt-4 w-full border border-border py-3 font-body text-[10px] tracking-[0.2em] uppercase text-on-surface hover:bg-surface transition-colors"
        >
          {t('close')}
        </button>
      </DialogContent>
    </Dialog>
  )
}
