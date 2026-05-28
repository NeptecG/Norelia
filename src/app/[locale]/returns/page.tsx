import type { Metadata } from 'next'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'Our returns and exchange policy.',
}

const SECTIONS = [
  {
    title:  'Return Policy',
    detail: 'You have 14 days from the date of delivery to request a return. Items must be unworn, unwashed, and in their original condition with all tags attached. Sale items and customised pieces from our Design Your Own studio are final sale and cannot be returned.',
  },
  {
    title:  'How to Return',
    detail: 'Email us at hello@norelia.com with your order number and reason for return. We\'ll respond within 1–2 business days with a return authorisation and instructions. Once we receive and inspect the item, your refund will be processed within 5–7 business days to your original payment method.',
  },
  {
    title:  'Exchanges',
    detail: 'Want a different size or colour? We offer free exchanges on full-price items within 14 days of delivery. Simply contact us at hello@norelia.com and we\'ll sort it out. Exchanges are subject to stock availability.',
  },
  {
    title:  'Damaged or Incorrect Items',
    detail: 'If your order arrives damaged or you received the wrong item, please contact us within 48 hours of delivery with photos. We\'ll arrange a replacement or full refund at no cost to you. No questions asked.',
  },
] as const

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-surface">

      {/* Dark hero band */}
      <section className="dark bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <BackButton />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-4">
            Policy
          </p>
          <h1 className="font-display text-7xl md:text-[7rem] text-on-surface leading-none">
            RETURNS &amp;<br />EXCHANGES
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="max-w-[760px]">

          {/* Intro */}
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-16">
            We want you to love what you ordered. If something isn&apos;t right,
            here&apos;s how we make it right.
          </p>

          {/* Numbered sections */}
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

          {/* Note box */}
          <div className="bg-surface-raised px-6 py-5 mt-4">
            <p className="font-body text-[12px] text-on-surface-muted leading-[1.8]">
              <strong className="text-on-surface">Return shipping costs </strong>
              are the responsibility of the customer unless the item is faulty or incorrect.
              We recommend using a tracked service as we cannot be held responsible for
              returns lost in transit.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
