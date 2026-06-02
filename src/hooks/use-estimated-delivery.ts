'use client'

import { useMemo } from 'react'
import { useLocale } from 'next-intl'
import { ESTIMATED_DELIVERY_DAYS } from '@/lib/constants'

// Locale-formatted estimated delivery date: today + N working days (skips
// weekends). Shared by the delivery and payment steps.
export function useEstimatedDeliveryDate(): string {
  const locale = useLocale()
  return useMemo(() => {
    const d = new Date()
    let added = 0
    while (added < ESTIMATED_DELIVERY_DAYS) {
      d.setDate(d.getDate() + 1)
      const day = d.getDay()
      if (day !== 0 && day !== 6) added++
    }
    return new Intl.DateTimeFormat(locale, { weekday: 'short', day: '2-digit', month: 'short' }).format(d)
  }, [locale])
}
