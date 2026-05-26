import type { Metadata } from 'next'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Shipping',
  description: `Shipping information — free delivery over €${FREE_SHIPPING_THRESHOLD}.`,
}

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Dark hero band */}
      <section className="bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-on-surface-muted mb-4">
            Delivery
          </p>
          <h1 className="font-display text-7xl md:text-9xl text-on-surface leading-none">
            SHIPPING
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-6">Delivery Times</h2>
            <div className="space-y-4">
              {[
                { zone: 'Finland',            time: '1–2 business days' },
                { zone: 'EU (standard)',       time: '3–5 business days' },
                { zone: 'EU (express)',        time: '1–2 business days' },
                { zone: 'Rest of world',       time: '7–14 business days' },
                { zone: 'Custom orders',       time: '5–7 days + delivery' },
              ].map(({ zone, time }) => (
                <div key={zone} className="flex justify-between border-b border-border-subtle pb-3">
                  <span className="font-body text-sm text-on-surface">{zone}</span>
                  <span className="font-body text-sm text-on-surface-muted">{time}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-6">Shipping Costs</h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-4">
              Orders over <strong className="text-on-surface">€{FREE_SHIPPING_THRESHOLD}</strong> ship free
              to all EU countries. Standard shipping for orders below that threshold starts from €4.90.
            </p>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-4">
              Express delivery is available at checkout for an additional €9.90.
              All orders are tracked — you receive a tracking link by email when your order ships.
            </p>
            <p className="font-body text-base text-on-surface-muted leading-relaxed">
              Customs and import duties for deliveries outside the EU are the responsibility of the recipient.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
