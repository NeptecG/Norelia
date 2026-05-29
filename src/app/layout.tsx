import type { Metadata } from 'next'
import { Bebas_Neue, Open_Sans } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'
import { BRAND } from '@/lib/constants'

// Bebas Neue — condensed all-caps display font for English headings and brand marks
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

// Open Sans — clean humanist sans with full Greek + Latin support, used for all body text
// and as the Greek fallback for display (Bebas has no Greek glyphs)
const openSans = Open_Sans({
  subsets: ['latin', 'greek'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-opensans',
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
      className={`${bebasNeue.variable} ${openSans.variable}`}
    >
      <body className="font-body bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
