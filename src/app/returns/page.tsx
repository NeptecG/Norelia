import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'Our returns and exchange policy — hassle-free within 30 days.',
}

const SECTIONS = [
  {
    title:  'Return Policy',
    detail: 'We accept returns and exchanges within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. We inspect every return on receipt — items that don\'t meet these conditions will be sent back.',
  },
  {
    title:  'How to Start a Return',
    detail: 'Email us at returns@norelia.com with your order number and the reason for your return. We\'ll reply within 24 hours with a prepaid DHL return label. Drop your parcel at any DHL ServicePoint — no printer needed if you use the QR code option.',
  },
  {
    title:  'Refunds & Exchanges',
    detail: 'Once we receive and inspect your return, we\'ll process your refund to the original payment method within 3–5 business days. For exchanges, we dispatch the replacement as soon as the return is confirmed — no waiting for the refund to clear. First exchange ships free.',
  },
  {
    title:  'Custom & Printed Orders',
    detail: 'Garments created through our Design Your Own studio are made specifically for you and cannot be returned unless the item is faulty or we made a production error. If your custom order arrives damaged or incorrect, contact us within 7 days and we\'ll remake it at no cost.',
  },
] as const

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-surface">

      {/* Dark hero band */}
      <section className="dark bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
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
            We want you to love what you wear. If something isn&apos;t right,
            we make it easy to send it back — no questions asked within{' '}
            <strong className="text-on-surface">30 days</strong> of delivery.
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
              <strong className="text-on-surface">Return shipping costs: </strong>
              Return labels are prepaid and free of charge on all eligible returns within the EU.
              For returns from outside the EU, the customer covers the return shipping cost.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
