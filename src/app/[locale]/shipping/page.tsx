import type { Metadata } from 'next'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import { BackButton } from '@/components/layout/back-button'

export const metadata: Metadata = {
  title: 'Shipping',
  description: `Shipping information, free delivery over €${FREE_SHIPPING_THRESHOLD}.`,
}

const METHODS = [
  {
    title:  'Standard Shipping',
    time:   '3–5 Business Days',
    price:  `Free on orders over €${FREE_SHIPPING_THRESHOLD} · €4.90 below`,
    detail: 'Available for all destinations within Greece. Orders are processed within 1–2 business days and dispatched via ACS Courier or ELTA. You\'ll receive a tracking number by email once your order ships.',
  },
  {
    title:  'Express Shipping',
    time:   '1–2 Business Days',
    price:  '€8.90',
    detail: 'Need it faster? Select express at checkout for next-day or 2-day delivery within Greece. Orders placed before 13:00 are dispatched same day.',
  },
  {
    title:  'International Shipping',
    time:   '5–12 Business Days',
    price:  'From €12.90',
    detail: 'We ship to all EU countries and select international destinations. Delivery times and rates vary by destination. Customs duties and import taxes may apply and are the responsibility of the recipient.',
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
            We ship every NORELIA. order with care. Whether you&apos;re across town or across borders,
            here&apos;s everything you need to know before and after you place your order.
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
              circumstances beyond our control. Once an order has been dispatched, NORELIA. is not
              responsible for delays caused by the courier.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
