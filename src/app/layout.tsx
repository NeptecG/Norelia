import type { Metadata } from 'next'
import { Fira_Sans_Condensed, Bebas_Neue } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'
import { BRAND, SITE_URL } from '@/lib/constants'

// Fira Sans Condensed — single condensed typeface for the whole site (display + body).
// Ships full Greek + Latin glyphs, so Greek never falls back to a different face.
const firaSans = Fira_Sans_Condensed({
  subsets: ['latin', 'greek'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira',
  display: 'swap',
})

// Bebas Neue — reserved for the NORELIA. brand wordmark only (Latin-only, no Greek
// needed since the wordmark is the same in both locales).
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: BRAND, template: `%s | ${BRAND}` },
  description: 'Minimalist premium streetwear. Custom printing. Free shipping over €60.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: 'NORELIA.',
    type: 'website',
    locale: 'el_GR',
    alternateLocale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@norelia',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html
      lang={locale}
      className={`${firaSans.variable} ${bebasNeue.variable}`}
    >
      <body className="font-body bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
