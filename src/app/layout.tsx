import type { Metadata } from 'next'
import { Fira_Sans_Condensed } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'
import { BRAND } from '@/lib/constants'

// Fira Sans Condensed — single condensed typeface for the whole site (display + body).
// Ships full Greek + Latin glyphs, so Greek never falls back to a different face.
const firaSans = Fira_Sans_Condensed({
  subsets: ['latin', 'greek'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira',
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
      className={firaSans.variable}
    >
      <body className="font-body bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
