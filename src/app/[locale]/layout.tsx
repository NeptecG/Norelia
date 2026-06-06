import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Nav }           from '@/components/layout/nav'
import { SiteFooter }    from '@/components/layout/site-footer'
import { NewsletterBar } from '@/components/layout/newsletter-bar'
import { SidePanel }     from '@/components/layout/side-panel'
import { Toast }         from '@/components/layout/toast'
import { GDPRBanner }    from '@/components/layout/gdpr-banner'
import { SignInModal }             from '@/components/modals/sign-in-modal'
import { CheckoutComingSoonModal } from '@/components/modals/checkout-coming-soon-modal'
import { ScrollToTop }             from '@/components/scroll-to-top'

const LOCALES = ['el', 'en'] as const

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

interface Props {
  children:  React.ReactNode
  params:    Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as typeof LOCALES[number])) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Skip-to-content: visible only on keyboard focus — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-surface focus:text-on-surface focus:px-4 focus:py-2 focus:font-body focus:text-sm focus:tracking-wide"
      >
        Skip to main content
      </a>
      <Nav />
      <main id="main-content">{children}</main>
      <NewsletterBar />
      <SiteFooter />
      <SidePanel />
      <Toast />
      <GDPRBanner />
      <SignInModal />
      <CheckoutComingSoonModal />
      <ScrollToTop />
    </NextIntlClientProvider>
  )
}
