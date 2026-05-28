import type { Metadata } from 'next'
import { Bebas_Neue, Oswald, DM_Sans } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'
import { BRAND } from '@/lib/constants'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display-latin',
  display: 'swap',
})

const oswald = Oswald({
  weight: ['400', '500'],
  // 'greek' subset is not available for Oswald in Google Fonts — latin covers the glyphs used
  subsets: ['latin'],
  variable: '--font-display-greek',
  display: 'swap',
})

const dmSans = DM_Sans({
  // 'greek' subset is not available for DM Sans in Google Fonts — latin-ext covers extended chars
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
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
      className={`${bebasNeue.variable} ${oswald.variable} ${dmSans.variable}`}
    >
      <body className="font-body bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
