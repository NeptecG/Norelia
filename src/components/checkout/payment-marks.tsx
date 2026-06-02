'use client'

import type { ReactNode } from 'react'
import type { PaymentMethod } from '@/stores/checkout-store'

// White logo chip. Payment brand marks are designed for a light backing, so we
// use an explicit white box with a hairline border (same trust convention as the
// footer payment icons) rather than a semantic surface token.
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center w-[54px] h-[34px] rounded-md bg-white border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
      {children}
    </span>
  )
}

// Visa + Mastercard, stacked — the "card" mark
const CARD = (
  <svg width="44" height="28" viewBox="0 0 44 28" fill="none" aria-hidden="true">
    <text x="22" y="11" textAnchor="middle" fill="#1A1F71" fontSize="11" fontWeight="800" fontStyle="italic" fontFamily="Arial, sans-serif">VISA</text>
    <g transform="translate(13,15)">
      <circle cx="7" cy="6" r="6" fill="#EB001B" />
      <circle cx="13" cy="6" r="6" fill="#F79E1B" />
      <path d="M10 1.2a6 6 0 0 0 0 9.6 6 6 0 0 0 0-9.6z" fill="#FF5F00" />
    </g>
  </svg>
)

// IRIS — four-quadrant ring (TL red, TR blue, BL orange, BR teal) + wordmark,
// colours taken from the official IRIS online payments logo
const IRIS = (
  <svg width="50" height="24" viewBox="0 0 52 24" fill="none" aria-hidden="true">
    <g transform="translate(10,12)" fill="none" strokeWidth="5.5">
      <circle r="6.5" stroke="#1A9E8E" strokeDasharray="9.6 31.2" transform="rotate(0)" />
      <circle r="6.5" stroke="#F39A23" strokeDasharray="9.6 31.2" transform="rotate(90)" />
      <circle r="6.5" stroke="#E8473C" strokeDasharray="9.6 31.2" transform="rotate(180)" />
      <circle r="6.5" stroke="#1C6CA9" strokeDasharray="9.6 31.2" transform="rotate(270)" />
    </g>
    <text x="22" y="16" fill="#404040" fontSize="12.5" fontWeight="700" fontFamily="Arial, sans-serif">IRIS</text>
  </svg>
)

// Apple Pay — apple glyph + "Pay"
const APPLE_PAY = (
  <svg width="48" height="22" viewBox="0 0 48 24" fill="none" aria-hidden="true">
    <path
      transform="translate(2,2.5) scale(0.78)"
      fill="#000"
      d="M17.05 12.04c-.03-3.16 2.58-4.68 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.95-.2-3.8 1.15-4.79 1.15-.98 0-2.51-1.12-4.13-1.09-2.13.03-4.09 1.24-5.18 3.15-2.21 3.83-.56 9.5 1.58 12.61 1.05 1.52 2.3 3.23 3.94 3.17 1.58-.06 2.18-1.02 4.09-1.02 1.9 0 2.44 1.02 4.11.99 1.7-.03 2.77-1.55 3.8-3.08 1.2-1.76 1.69-3.47 1.71-3.56-.04-.02-3.28-1.26-3.31-4.99zM14.13 4.42c.87-1.05 1.46-2.51 1.3-3.97-1.25.05-2.77.83-3.67 1.88-.81.93-1.51 2.42-1.32 3.85 1.39.11 2.81-.71 3.69-1.76z"
    />
    <text x="22" y="17" fill="#000" fontSize="13" fontWeight="600" fontFamily="Arial, sans-serif">Pay</text>
  </svg>
)

// Google Pay — four-colour "G" + "Pay"
const GOOGLE_PAY = (
  <svg width="50" height="22" viewBox="0 0 52 24" fill="none" aria-hidden="true">
    <g transform="translate(10,12)" fill="none" strokeWidth="3.4">
      <circle r="6.4" stroke="#EA4335" strokeDasharray="9 31" transform="rotate(-90)" />
      <circle r="6.4" stroke="#FBBC04" strokeDasharray="9 31" transform="rotate(180)" />
      <circle r="6.4" stroke="#34A853" strokeDasharray="9 31" transform="rotate(90)" />
      <circle r="6.4" stroke="#4285F4" strokeDasharray="9 31" transform="rotate(0)" />
      <rect x="0.5" y="-1.7" width="6" height="3.4" fill="#4285F4" stroke="none" />
    </g>
    <text x="22" y="16" fill="#5F6368" fontSize="12.5" fontWeight="600" fontFamily="Arial, sans-serif">Pay</text>
  </svg>
)

// Klarna — pink pill wordmark
const KLARNA = (
  <svg width="50" height="20" viewBox="0 0 52 20" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="48" height="16" rx="4" fill="#FFB3C7" />
    <text x="26" y="14" textAnchor="middle" fill="#17120F" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">Klarna</text>
  </svg>
)

// Cash on delivery — neutral banknote glyph
const COD = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="6" width="19" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v6M18 9v6" />
  </svg>
)

const MARKS: Record<PaymentMethod, ReactNode> = {
  card:      CARD,
  iris:      IRIS,
  applepay:  APPLE_PAY,
  googlepay: GOOGLE_PAY,
  klarna:    KLARNA,
  cod:       COD,
}

export function PaymentMark({ method }: { method: PaymentMethod }) {
  return <Chip>{MARKS[method]}</Chip>
}
