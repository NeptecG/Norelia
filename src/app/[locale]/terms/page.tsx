import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms and conditions for purchasing from ${BRAND}`,
}

const SECTIONS = [
  {
    title:  'Acceptance of Terms',
    detail: `By placing an order on this website you confirm that you are at least 18 years old and agree to these terms in full. These terms are governed by Greek law and any disputes will be subject to the exclusive jurisdiction of the courts of Preveza, Greece.`,
  },
  {
    title:  'Orders & Pricing',
    detail: 'All prices are displayed in Euros (€) and include VAT where applicable. We reserve the right to refuse or cancel any order, including after confirmation, if we detect fraud, pricing errors, or stock discrepancies. In such cases you will receive a full refund. Promotional codes are single-use and cannot be combined.',
  },
  {
    title:  'Custom Orders',
    detail: 'Orders placed through the Design Your Own studio are made to order. By uploading your artwork you confirm you own the rights to use it commercially and that it does not infringe third-party intellectual property. NORELIA. accepts no liability for content uploaded by customers.',
  },
  {
    title:  'Intellectual Property',
    detail: `All designs, graphics, product names, and brand assets on this site are the exclusive property of ${BRAND} and may not be reproduced, copied, or distributed without written permission. The site software and structure are also protected by copyright.`,
  },
  {
    title:  'Limitation of Liability',
    detail: `${BRAND}'s total liability for any claim arising from a purchase is limited to the value of the order in question. We are not liable for indirect or consequential losses. We do not guarantee uninterrupted access to this website.`,
  },
  {
    title:  'Changes to These Terms',
    detail: 'We may update these terms at any time. The version in force at the time of your order applies to that order. Continued use of the site after a terms update constitutes acceptance of the new terms. This version was last updated in May 2026.',
  },
] as const

export default function TermsPage() {
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
            TERMS OF<br />SERVICE
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="max-w-[760px]">

          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-16">
            Please read these terms carefully before ordering. By purchasing from{' '}
            <strong className="text-on-surface">{BRAND}</strong> you agree to be bound by the
            conditions set out below.
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
              <strong className="text-on-surface">Questions? </strong>
              Contact us at hello@norelia.com. We aim to respond to all enquiries within one business day.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
