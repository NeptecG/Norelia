import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${BRAND} collects, uses, and protects your personal data.`,
}

const SECTIONS = [
  {
    title:  'Information We Collect',
    detail: 'When you place an order we collect your name, email address, shipping address, and phone number. We also collect payment information, though card details are processed directly by our payment provider (Stripe) and never stored on our servers. When you browse our site we may collect non-personal analytics data such as pages visited and device type.',
  },
  {
    title:  'How We Use Your Data',
    detail: 'Your information is used solely to process and fulfil your orders, send shipping notifications, and respond to your enquiries. If you opt in to our newsletter, we use your email to send you new drop announcements and exclusive offers. We never sell or rent your personal data to third parties.',
  },
  {
    title:  'Cookies',
    detail: 'We use strictly necessary cookies to keep your cart and favourites intact between sessions. With your consent we also use anonymous analytics cookies (Vercel Analytics) to understand how visitors use our site. You can withdraw consent at any time via the cookie banner.',
  },
  {
    title:  'Data Retention',
    detail: 'Order data is retained for 7 years to comply with Greek and EU accounting regulations. Newsletter subscribers can unsubscribe at any time using the link in any email we send. Account data is deleted within 30 days of a deletion request.',
  },
  {
    title:  'Your Rights',
    detail: 'Under GDPR you have the right to access, correct, or delete your personal data at any time. You may also request a portable copy of your data or object to specific processing. To exercise any of these rights, contact us at privacy@norelia.com. We will respond within 30 days.',
  },
  {
    title:  'Contact',
    detail: 'For any privacy-related enquiries, write to privacy@norelia.com or by post to: NORELIA., G. Gianniwth 216, Preveza 48100, Greece. This policy was last updated in May 2026.',
  },
] as const

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface">

      {/* Dark hero band */}
      <section className="dark bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <BackButton />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-4">
            Legal
          </p>
          <h1 className="font-display text-7xl md:text-[7rem] text-on-surface leading-none">
            PRIVACY<br />POLICY
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="max-w-[760px]">

          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-16">
            {BRAND} is committed to protecting your privacy. This policy explains what data we
            collect, why we collect it, and how we keep it safe, in plain language.
          </p>

          {SECTIONS.map(({ title, detail }, i) => (
            <div key={title} className="border-t border-border-subtle pt-10 mb-12">
              <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">
                0{i + 1}
              </p>
              <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface mb-5">
                {title}
              </h2>
              <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">
                {detail}
              </p>
            </div>
          ))}

          <div className="bg-surface-raised px-6 py-5 mt-4">
            <p className="font-body text-[12px] text-on-surface-muted leading-[1.8]">
              <strong className="text-on-surface">GDPR compliance: </strong>
              This site processes personal data under EU Regulation 2016/679. Our legal basis for
              processing order data is contractual necessity; for newsletter communications, it is
              your explicit consent.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
