import type React from 'react'
import { Link } from '@/navigation'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'
import { BRAND } from '@/lib/constants'

type TFooter = Awaited<ReturnType<typeof getTranslations<'SiteFooter'>>>

// ── Column heading ─────────────────────────────────────────────────────────────

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[10px] tracking-[0.2em] uppercase text-on-surface/65 mb-5">
      {children}
    </p>
  )
}

// ── Footer link ────────────────────────────────────────────────────────────────

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative group inline-block font-body text-[11px] tracking-[0.12em] text-on-surface/80 hover:text-on-surface transition-colors duration-200 mb-2.5"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
    </Link>
  )
}

// ── Brand column ───────────────────────────────────────────────────────────────

function BrandColumn({ t }: { t: TFooter }) {
  return (
    <div>
      <FooterHeading>{t('premiumStreetware')}</FooterHeading>
      <p className={cn('font-display text-[22px] tracking-[0.2em] text-on-surface mb-7')}>
        {BRAND}
      </p>
      <div className="flex gap-4">
        {/* Instagram — inline SVG (lucide-react does not export Instagram in this version) */}
        <a
          href="https://instagram.com/norelia"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('instagramLabel')}
          className="text-on-surface/55 hover:text-on-surface transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
          </svg>
        </a>

        {/* X (Twitter) — inline SVG */}
        <a
          href="https://x.com/norelia"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('xLabel')}
          className="text-on-surface/55 hover:text-on-surface transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4l16 16M4 20L20 4" />
          </svg>
        </a>

        {/* YouTube — inline SVG (lucide-react does not export Youtube in this version) */}
        <a
          href="https://youtube.com/@norelia"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('youtubeLabel')}
          className="text-on-surface/55 hover:text-on-surface transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </div>
  )
}

// ── Info column ────────────────────────────────────────────────────────────────

function InfoColumn({ t }: { t: TFooter }) {
  return (
    <div>
      <FooterHeading>{t('information')}</FooterHeading>
      <div className="flex flex-col items-start">
        <FooterLink href="/about">{t('about')}</FooterLink>
        <FooterLink href="/size-guide">{t('sizeGuide')}</FooterLink>
        <FooterLink href="/shipping">{t('shipping')}</FooterLink>
        <FooterLink href="/returns">{t('returns')}</FooterLink>
        <FooterLink href="/privacy">{t('privacy')}</FooterLink>
        <FooterLink href="/terms">{t('terms')}</FooterLink>
      </div>
    </div>
  )
}

// ── Contact column ─────────────────────────────────────────────────────────────

function ContactColumn({ t }: { t: TFooter }) {
  return (
    <div>
      <FooterHeading>{t('contact')}</FooterHeading>
      {/*
        IMPORTANT — do NOT remove the flex wrapper below.
        Without it, mixing block <p> elements with the inline-block FooterLink
        creates an anonymous inline formatting context whose line-box strut
        (based on the inherited 16px body font) adds ~25px of phantom space
        before "Our Studio", pushing it below Privacy Policy in InfoColumn.
        The flex wrapper normalises all items to block-level flex items,
        matching InfoColumn exactly and keeping "Our Studio" row-aligned
        with "Privacy Policy".
      */}
      <div className="flex flex-col items-start">
        <p className="font-body text-[11px] tracking-[0.12em] text-on-surface/80 mb-2.5">
          hello@norelia.com
        </p>
        <p className="font-body text-[11px] tracking-[0.12em] text-on-surface/60 mb-2.5">
          +30 26820 00000
        </p>
        <p className="font-body text-[11px] tracking-[0.12em] text-on-surface/60 mb-2.5">
          {t('hours')}
        </p>
        <p className="font-body text-[11px] tracking-[0.12em] text-on-surface/60 mb-2.5">
          {t('saturday')}
        </p>
        <FooterLink href="/our-studio">{t('ourStudio')}</FooterLink>
      </div>
    </div>
  )
}

// ── Payment icons ──────────────────────────────────────────────────────────────

function VisaIcon() {
  return (
    <svg viewBox="0 0 50 32" width="50" height="32" aria-label="Visa" role="img" className="rounded-sm border border-white/10">
      <rect width="50" height="32" rx="3" fill="#1A1F71" />
      <text x="25" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif" fontStyle="italic" letterSpacing="1">VISA</text>
    </svg>
  )
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 50 32" width="50" height="32" aria-label="Mastercard" role="img" className="rounded-sm border border-white/10">
      <rect width="50" height="32" rx="3" fill="#252525" />
      <circle cx="19" cy="16" r="9" fill="#EB001B" />
      <circle cx="31" cy="16" r="9" fill="#F79E1B" />
      <path d="M25 9.5a9 9 0 0 1 0 13A9 9 0 0 1 25 9.5z" fill="#FF5F00" />
    </svg>
  )
}

function PayPalIcon() {
  return (
    <svg viewBox="0 0 50 32" width="50" height="32" aria-label="PayPal" role="img" className="rounded-sm border border-white/10">
      <rect width="50" height="32" rx="3" fill="#003087" />
      <text x="25" y="21" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.3">PayPal</text>
    </svg>
  )
}

function KlarnaIcon() {
  return (
    <svg viewBox="0 0 50 32" width="50" height="32" aria-label="Klarna" role="img" className="rounded-sm border border-white/10">
      <rect width="50" height="32" rx="3" fill="#FFB3C7" />
      <text x="25" y="21" textAnchor="middle" fill="#1A1A1A" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.3">klarna</text>
    </svg>
  )
}

// ── Payment column ─────────────────────────────────────────────────────────────

function PaymentColumn({ t }: { t: TFooter }) {
  return (
    <div>
      <FooterHeading>{t('payment')}</FooterHeading>
      <div className="flex flex-wrap gap-2">
        <VisaIcon />
        <MastercardIcon />
        <PayPalIcon />
        <KlarnaIcon />
      </div>
    </div>
  )
}

// ── SiteFooter ─────────────────────────────────────────────────────────────────

export async function SiteFooter() {
  const t = await getTranslations('SiteFooter')

  return (
    <footer className="dark bg-surface-alt text-on-surface">
      {/* Main columns */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <BrandColumn t={t} />
          <InfoColumn t={t} />
          <ContactColumn t={t} />
          <PaymentColumn t={t} />
        </div>
      </div>

      {/* Divider + copyright */}
      <div className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] py-5 grid grid-cols-1 sm:grid-cols-3 items-center gap-y-2 text-center sm:text-left">
          <p className="font-body text-[10px] tracking-[0.15em] text-on-surface/35 uppercase">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="font-body text-[10px] tracking-[0.15em] text-on-surface/55 uppercase text-center">
            {t('tagline')}
          </p>
          <p className="font-body text-[10px] tracking-[0.12em] text-on-surface/35 uppercase sm:text-right">
            {t('secure')}
          </p>
        </div>
      </div>
    </footer>
  )
}
