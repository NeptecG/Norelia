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
      <Nav />
      <main>{children}</main>
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
