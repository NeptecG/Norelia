'use client'

import { useReducedMotion } from 'motion/react'

export const EASE: [number, number, number, number] = [0.25, 0, 0, 1]

// Returns a builder for the staggered fade-up reveal used on the checkout steps.
// Honours prefers-reduced-motion (returns no animation when reduced).
export function useSectionMotion() {
  const reduced = useReducedMotion() ?? false
  return (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay, ease: EASE } }
}
