'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Heart, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'

export function Toast() {
  const { toast } = useUIStore()
  const shouldReduceMotion = useReducedMotion()

  const isFav =
    toast.type === 'add' &&
    (toast.msg.toLowerCase().includes('saved') ||
      toast.msg.toLowerCase().includes('favourites') ||
      toast.msg.toLowerCase().includes('favorites'))

  const variants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 } }

  return (
    <div className="dark fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] pointer-events-none">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            key="toast"
            role="status"
            aria-live="polite"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={cn(
              'flex items-center gap-2.5 bg-surface-alt text-on-surface',
              'px-7 py-[17px] shadow-lg whitespace-nowrap',
              'font-body text-[13px] tracking-[0.12em] uppercase',
              'border-l-4',
              toast.type === 'add' ? 'border-l-success' : 'border-l-destructive',
            )}
          >
            {isFav && (
              <Heart size={13} className="fill-destructive stroke-destructive shrink-0" />
            )}
            {toast.type === 'add' && !isFav && (
              <Check size={13} className="text-success shrink-0" />
            )}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
