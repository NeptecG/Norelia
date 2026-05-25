'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

interface HeroHalfProps {
  side: 'women' | 'men'
  label: string
  href: string
  bgSrc: string
  objectPosition?: string
  isHovered: boolean
  onHover: (side: 'women' | 'men' | null) => void
}

function HeroHalf({
  side,
  label,
  href,
  bgSrc,
  objectPosition = 'center',
  isHovered,
  onHover,
}: HeroHalfProps) {
  const prefersReduced = useReducedMotion()

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: prefersReduced ? 1 : 1.04 },
  }

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1 },
  }

  const eyebrowVariants = {
    rest: { opacity: 0, y: prefersReduced ? 0 : 6 },
    hover: { opacity: 1, y: 0 },
  }

  const labelVariants = {
    rest: { opacity: 0.85, y: prefersReduced ? 0 : 4 },
    hover: { opacity: 1, y: 0 },
  }

  const animateState = isHovered ? 'hover' : 'rest'

  return (
    <Link
      href={href}
      aria-label={`Shop ${label}`}
      className={cn(
        'relative flex-1 overflow-hidden',
        'h-[50vw] min-h-[220px] md:h-auto',
      )}
      onMouseEnter={() => onHover(side)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        variants={imageVariants}
        animate={animateState}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={bgSrc}
          alt={label}
          fill
          priority
          sizes="50vw"
          className="object-cover"
          // objectPosition is dynamic data — inline style is unavoidable here
          style={{ objectPosition }}
        />
      </motion.div>

      {/* Permanent bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

      {/* Hover darkening overlay */}
      <motion.div
        className="absolute inset-0 bg-black/[0.18]"
        variants={overlayVariants}
        animate={animateState}
        transition={{ duration: 0.3 }}
      />

      {/* Label group at bottom center */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1">
        {/* SHOP eyebrow — fades in on hover */}
        <motion.span
          className="font-body text-[9px] tracking-[0.3em] uppercase text-white/60"
          variants={eyebrowVariants}
          animate={animateState}
          transition={{ duration: 0.25 }}
        >
          SHOP
        </motion.span>

        {/* Gender label — always visible, brightens on hover */}
        <motion.span
          className="font-display text-[52px] tracking-[0.14em] text-white"
          variants={labelVariants}
          animate={animateState}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.span>
      </div>
    </Link>
  )
}

export function Hero() {
  const [hovered, setHovered] = useState<'women' | 'men' | null>(null)

  return (
    <section className="flex flex-col md:flex-row md:h-[88vh] border-b border-border">
      <HeroHalf
        side="women"
        label="WOMEN"
        href="/women"
        bgSrc="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=960&h=1200&fit=crop&q=85"
        objectPosition="center top"
        isHovered={hovered === 'women'}
        onHover={setHovered}
      />
      <HeroHalf
        side="men"
        label="MEN"
        href="/men"
        bgSrc="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=960&h=1200&fit=crop&q=85"
        isHovered={hovered === 'men'}
        onHover={setHovered}
      />
    </section>
  )
}
