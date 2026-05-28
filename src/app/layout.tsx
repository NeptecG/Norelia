import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'
import { BRAND } from '@/lib/constants'

// Noto Sans — full Latin + Greek coverage, used for both display and body across all locales
const notoSans = Noto_Sans({
  subsets: ['latin', 'greek'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: BRAND, template: `%s | ${BRAND}` },
  description: 'Minimalist premium streetwear. Custom printing. Free shipping over €60.',
  metadataBase: new URL('https://norelia.com'),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html
      lang={locale}
      className={`${notoSans.variable}`}
    >
      <body className="font-body bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
