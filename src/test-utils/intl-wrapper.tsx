import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from '../../messages/en.json'

interface Props {
  children: React.ReactNode
  locale?: string
}

/**
 * Wraps a component under test with NextIntlClientProvider using English messages.
 * Use this in any test that renders a component calling useTranslations().
 *
 * Usage:
 *   import { render } from '@testing-library/react'
 *   import { IntlWrapper } from '@/test-utils/intl-wrapper'
 *   render(<IntlWrapper><MyComponent /></IntlWrapper>)
 */
export function IntlWrapper({ children, locale = 'en' }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={enMessages}>
      {children}
    </NextIntlClientProvider>
  )
}
