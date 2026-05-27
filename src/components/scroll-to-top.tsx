'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const variants = {
    hidden:  { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={handleClick}
          aria-label="Scroll to top"
          className={cn(
            'fixed bottom-6 right-6 z-40',
            'flex items-center gap-2 px-4 h-10',
            'border border-on-surface bg-surface-alt text-on-surface',
            'hover:bg-on-surface hover:text-surface transition-colors duration-200',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-on-surface focus-visible:outline-offset-2',
          )}
        >
          <ChevronUp size={15} strokeWidth={1.5} />
          <span className="font-body text-[9px] tracking-[0.2em] uppercase">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
