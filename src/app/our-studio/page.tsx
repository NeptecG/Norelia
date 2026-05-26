import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Our Studio',
  description: `Visit the ${BRAND} studio in Helsinki — where we design, print, and ship.`,
}

export default function OurStudioPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Dark hero band */}
      {/* max-w-[1440px] / md:px-[60px] — project-wide content container; tracking-[0.3em] — editorial label spacing */}
      <section className="bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-on-surface-muted mb-4">
            Helsinki
          </p>
          <h1 className="font-display text-7xl md:text-9xl text-on-surface leading-none">
            OUR STUDIO
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-6">Where We Work</h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-4">
              Our studio is in Punavuori — Helsinki&apos;s most creative neighbourhood, surrounded by
              independent galleries, concept stores, and the sea. It&apos;s where we design collections,
              print custom orders, and ship every package.
            </p>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-4">
              We run open studio sessions on the first Saturday of each month. Come and see the printing
              process, meet the team, and pick up pieces in person.
            </p>
            <div className="space-y-2 mt-8">
              <p className="font-body text-sm text-on-surface">Norelia Studio</p>
              <p className="font-body text-sm text-on-surface-muted">Punavuorenkatu 12</p>
              <p className="font-body text-sm text-on-surface-muted">Helsinki 00120, Finland</p>
              <p className="font-body text-sm text-on-surface-muted mt-4">
                Open studio: First Saturday, 11:00–16:00
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-6">The Equipment</h2>
            <div className="space-y-4">
              {[
                { item: 'DTG printer',        detail: 'Kornit Avalanche HD6 — photographic quality' },
                { item: 'Embroidery machine', detail: '12-head Tajima — up to 350 stitches/min'    },
                { item: 'Heat press',         detail: 'Stahls CAD-PRINTZ — precision temperature control' },
                { item: 'Fabric stock',       detail: 'European-certified 380gsm fleece, 200gsm cotton' },
              ].map(({ item, detail }) => (
                <div key={item} className="border-b border-border-subtle pb-4">
                  <p className="font-body text-sm text-on-surface mb-1">{item}</p>
                  <p className="font-body text-xs text-on-surface-muted">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] pb-20">
        <div className="w-full aspect-video">
          <iframe
            title="Norelia studio location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.9!2d24.934!3d60.162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjDCsDA5JzQ0LjAiTiAyNMKwNTYnMDIuNCJF!5e0!3m2!1sen!2sfi!4v1234567890"
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0 grayscale"
          />
        </div>
      </section>
    </main>
  )
}
