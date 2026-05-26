import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'Our returns and exchange policy — hassle-free within 30 days.',
}

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Dark hero band */}
      <section className="bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-on-surface-muted mb-4">
            Policy
          </p>
          <h1 className="font-display text-7xl md:text-9xl text-on-surface leading-none">
            RETURNS
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-6">Our Policy</h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-4">
              We accept returns and exchanges within <strong className="text-on-surface">30 days</strong> of
              delivery. Items must be unworn, unwashed, and in their original condition with all tags attached.
            </p>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-4">
              Custom printed orders (from the Garment Designer) are made to order and cannot be returned
              unless the item is faulty or we made an error.
            </p>
            <p className="font-body text-base text-on-surface-muted leading-relaxed">
              To start a return, email us at <strong className="text-on-surface">returns@norelia.com</strong> with
              your order number and reason for return. We&apos;ll send a prepaid return label within 24 hours.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-6">Refunds</h2>
            <div className="space-y-4">
              {[
                { label: 'Processing time',    value: '3–5 business days after receipt' },
                { label: 'Refund method',      value: 'Original payment method' },
                { label: 'Exchange shipping',  value: 'Free on first exchange' },
                { label: 'Custom orders',      value: 'Non-refundable (faulty items excepted)' },
                { label: 'Return window',      value: '30 days from delivery' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-border-subtle pb-3">
                  <span className="font-body text-sm text-on-surface">{label}</span>
                  <span className="font-body text-sm text-on-surface-muted">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
