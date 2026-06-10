'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

interface HeroHalfProps {
  side: 'women' | 'men'
  label: string
  shopLabel: string
  ariaLabel: string
  href: string
  bgSrc: string
  objectPosition?: string
  isHovered: boolean
  onHover: (side: 'women' | 'men' | null) => void
}

function HeroHalf({
  side,
  label,
  shopLabel,
  ariaLabel,
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

  const labelVariants = {
    // Crisp at rest (the gender word is the hero statement); a hair of lift settles on hover.
    rest: { opacity: 1, y: prefersReduced ? 0 : 2 },
    hover: { opacity: 1, y: 0 },
  }

  // Outlined SHOP pill: faint glass at rest so it reads on any photo, fills solid
  // white on hover. A restrained, premium CTA affordance.
  const ctaVariants = {
    rest:  { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,1)' },
    hover: { backgroundColor: 'rgba(255,255,255,1)', color: 'rgba(17,17,17,1)' },
  }

  const animateState = isHovered ? 'hover' : 'rest'

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
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

      {/* Permanent bottom gradient — strengthened so the label + CTA stay legible over busy photos */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Hover darkening overlay */}
      <motion.div
        className="absolute inset-0 bg-black/[0.18]"
        variants={overlayVariants}
        animate={animateState}
        transition={{ duration: 0.3 }}
      />

      {/* Label group at bottom center */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4">
        {/* Gender label — crisp white, the hero statement */}
        <motion.span
          className="font-display text-[44px] md:text-[56px] lg:text-[68px] tracking-[0.14em] text-white"
          variants={labelVariants}
          animate={animateState}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.span>

        {/* SHOP pill — outlined CTA, faint glass at rest, fills white on hover */}
        <motion.span
          className="inline-flex items-center border border-white/60 px-7 py-2.5 font-body text-[11px] tracking-[0.25em] uppercase backdrop-blur-[2px]"
          variants={ctaVariants}
          animate={animateState}
          transition={{ duration: 0.3 }}
        >
          {shopLabel}
        </motion.span>
      </div>
    </Link>
  )
}

export function Hero() {
  const [hovered, setHovered] = useState<'women' | 'men' | null>(null)
  const t = useTranslations('Hero')

  return (
    <section className="flex flex-col md:flex-row md:h-[88dvh] border-b border-border">
      {/* Visually hidden h1 for screen readers and SEO — visual title is in the hero halves */}
      <h1 className="sr-only">{t('srHeading')}</h1>
      <HeroHalf
        side="women"
        label={t('womenLabel')}
        shopLabel={t('shopEyebrow')}
        ariaLabel={t('womenAriaLabel')}
        href="/women"
        bgSrc="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=960&h=1200&fit=crop&q=85"
        objectPosition="center 20%"
        isHovered={hovered === 'women'}
        onHover={setHovered}
      />
      <HeroHalf
        side="men"
        label={t('menLabel')}
        shopLabel={t('shopEyebrow')}
        ariaLabel={t('menAriaLabel')}
        href="/men"
        bgSrc="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=960&h=1200&fit=crop&q=85"
        objectPosition="center 15%"
        isHovered={hovered === 'men'}
        onHover={setHovered}
      />
    </section>
  )
}
