import type { Metadata } from 'next'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Shipping',
  description: `Shipping information, free delivery over €${FREE_SHIPPING_THRESHOLD}.`,
}

const METHODS = [
  {
    title:  'Standard Delivery',
    time:   '3–5 business days',
    price:  `Free over €${FREE_SHIPPING_THRESHOLD} · otherwise €4.90`,
    detail: 'All standard orders are packed and dispatched within 24 hours of payment confirmation. You\'ll receive a tracking link by email the moment your parcel leaves our studio in Preveza.',
  },
  {
    title:  'Express Delivery',
    time:   '1–2 business days',
    price:  '+€9.90',
    detail: 'Need it fast? Select Express at checkout and we\'ll prioritise your order. Available for all EU destinations. Dispatch cut-off is 13:00 CET on business days.',
  },
  {
    title:  'International Shipping',
    time:   '7–14 business days',
    price:  'Calculated at checkout',
    detail: 'We ship worldwide. Customs duties and import taxes for destinations outside the EU are the sole responsibility of the recipient. We declare all shipments at full value.',
  },
  {
    title:  'Custom & Studio Orders',
    time:   '5–7 days production + delivery',
    price:  'Free shipping on all custom orders',
    detail: 'Garments designed through our studio go through a dedicated production run. Every piece is hand-checked before dispatch. Production time begins after order confirmation.',
  },
] as const

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-surface">

      {/* Dark hero band */}
      <section className="dark bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <BackButton />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-4">
            Delivery
          </p>
          <h1 className="font-display text-7xl md:text-[7rem] text-on-surface leading-none">
            SHIPPING
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="max-w-[760px]">

          {/* Intro */}
          <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-16">
            Every order ships from our studio in Preveza, Greece. We partner with DHL and Speedex for
            reliable tracking across all destinations. Free standard shipping applies automatically when
            your cart exceeds <strong className="text-on-surface">€{FREE_SHIPPING_THRESHOLD}</strong>.
          </p>

          {/* Numbered sections */}
          {METHODS.map(({ title, time, price, detail }, i) => (
            <div key={title} className="border-t border-border-subtle pt-10 mb-12">
              <p className="font-display text-[11px] tracking-[0.3em] text-on-surface/25 mb-2.5">
                0{i + 1}
              </p>
              <div className="flex justify-between items-start gap-4 mb-5 flex-wrap">
                <h2 className="font-display text-2xl tracking-[0.06em] text-on-surface">{title}</h2>
                <div className="text-right shrink-0">
                  <p className="font-body text-[11px] tracking-[0.1em] uppercase text-on-surface font-bold">{time}</p>
                  <p className="font-body text-[11px] text-on-surface-muted mt-1">{price}</p>
                </div>
              </div>
              <p className="font-body text-[13px] text-on-surface-muted leading-[1.85] tracking-[0.02em] border-l-2 border-border-subtle pl-5">
                {detail}
              </p>
            </div>
          ))}

          {/* Note box */}
          <div className="bg-surface-raised px-6 py-5 mt-4">
            <p className="font-body text-[12px] text-on-surface-muted leading-[1.8]">
              <strong className="text-on-surface">Please note: </strong>
              Delivery times are estimates and may vary during peak periods, public holidays, or due to
              carrier delays beyond our control. We&apos;ll always keep you updated if something changes.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
