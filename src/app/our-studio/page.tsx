import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Our Studio',
  description: `Visit the ${BRAND} studio in Preveza, Greece — where we design, print, and ship.`,
}

export default function OurStudioPage() {
  return (
    <main className="min-h-screen bg-surface">

      {/* ── Dark hero ── */}
      <section className="bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-4">
            {BRAND}. Streetwear · Preveza, Greece
          </p>
          <h1 className="font-display text-7xl md:text-[7rem] text-on-surface leading-none mb-10">
            OUR<br />STUDIO
          </h1>
          <p className="font-body text-[15px] text-on-surface/55 leading-[1.85] max-w-[560px]">
            A small space in the west of Greece where everything gets made, checked, and shipped.
            No warehouses, no middlemen — just the work.
          </p>
        </div>
      </section>

      {/* ── Map + contact ── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">

          {/* Google Maps embed */}
          <div>
            <div className="w-full aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px]">
              <iframe
                title="Norelia studio location — Preveza, Greece"
                src="https://maps.google.com/maps?q=38.971454,20.746212&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: '400px' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://maps.google.com/?q=38.971454,20.746212"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-muted hover:text-on-surface transition-colors"
            >
              Open in Google Maps &rarr;
            </a>
          </div>

          {/* Address / Hours / Contact */}
          <div className="lg:pl-14 pt-10 lg:pt-0 flex flex-col gap-10 justify-center">

            <div>
              <p className="font-body text-[9px] tracking-[0.28em] uppercase text-on-surface-muted mb-3 border-b border-border-subtle pb-2">
                Address
              </p>
              <p className="font-body text-sm text-on-surface leading-relaxed">G. Gianniwth 216</p>
              <p className="font-body text-sm text-on-surface leading-relaxed">Preveza 48100</p>
              <p className="font-body text-sm text-on-surface leading-relaxed">Greece</p>
            </div>

            <div>
              <p className="font-body text-[9px] tracking-[0.28em] uppercase text-on-surface-muted mb-3 border-b border-border-subtle pb-2">
                Studio Hours
              </p>
              {[
                { day: 'Mon – Fri', hours: '09:00 – 17:00' },
                { day: 'Saturday',  hours: '10:00 – 14:00' },
                { day: 'Sunday',    hours: 'Closed',        muted: true },
              ].map(({ day, hours, muted }) => (
                <div key={day} className="flex justify-between font-body text-sm mb-1.5">
                  <span className="text-on-surface-muted">{day}</span>
                  <span className={muted ? 'text-on-surface-muted' : 'text-on-surface'}>{hours}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="font-body text-[9px] tracking-[0.28em] uppercase text-on-surface-muted mb-3 border-b border-border-subtle pb-2">
                Get in Touch
              </p>
              <p className="font-body text-sm text-on-surface mb-1.5">hello@norelia.com</p>
              <p className="font-body text-sm text-on-surface-muted">+30 26820 00000</p>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
