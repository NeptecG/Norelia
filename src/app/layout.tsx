import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import { BRAND } from '@/lib/constants'
import { Nav }           from '@/components/layout/nav'
import { SiteFooter }    from '@/components/layout/site-footer'
import { NewsletterBar } from '@/components/layout/newsletter-bar'
import { SidePanel }     from '@/components/layout/side-panel'
import { Toast }         from '@/components/layout/toast'
import { GDPRBanner }    from '@/components/layout/gdpr-banner'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: BRAND, template: `%s | ${BRAND}` },
  description: 'Minimalist premium streetwear. Custom printing. Free shipping over €60.',
  metadataBase: new URL('https://norelia.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="font-body bg-surface text-on-surface antialiased">
        <Nav />
        <main>{children}</main>
        <NewsletterBar />
        <SiteFooter />
        {/* Client-only overlays rendered after main content */}
        <SidePanel />
        <Toast />
        <GDPRBanner />
      </body>
    </html>
  )
}
