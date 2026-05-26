import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Our Studio',
  description: `Visit the ${BRAND} studio in Preveza, Greece — where we design, print, and ship.`,
}

export default function OurStudioPage() {
  return (
    <main className="min-h-screen bg-surface pt-20">

      {/* Back link */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] pt-8 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-muted hover:text-on-surface transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Brand + heading */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] pb-10">
        <p className="font-body text-[9px] tracking-[0.25em] uppercase text-on-surface-muted mb-1">
          {BRAND}. STREETWEAR
        </p>
        <h1 className="font-display text-6xl md:text-8xl text-on-surface leading-none">
          OUR STUDIO
        </h1>
      </div>

      {/* Map + info grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0">

          {/* Google Maps embed — Preveza, Greece */}
          <div className="relative">
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
            {/* Open in Google Maps link */}
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
          <div className="lg:pl-12 pt-8 lg:pt-0 flex flex-col gap-8">

            {/* Address */}
            <div>
              <p className="font-body text-[9px] tracking-[0.25em] uppercase text-on-surface-muted mb-3">
                Address
              </p>
              <p className="font-body text-sm text-on-surface leading-relaxed">
                G. Gianniwth 216
              </p>
              <p className="font-body text-sm text-on-surface leading-relaxed">
                Preveza 48100
              </p>
              <p className="font-body text-sm text-on-surface leading-relaxed">
                Greece
              </p>
            </div>

            {/* Studio hours */}
            <div>
              <p className="font-body text-[9px] tracking-[0.25em] uppercase text-on-surface-muted mb-3">
                Studio Hours
              </p>
              <div className="flex justify-between font-body text-sm text-on-surface mb-1.5">
                <span className="text-on-surface/70">Mon – Fri</span>
                <span>09:00 – 17:00</span>
              </div>
              <div className="flex justify-between font-body text-sm text-on-surface mb-1.5">
                <span className="text-on-surface/70">Saturday</span>
                <span>10:00 – 14:00</span>
              </div>
              <div className="flex justify-between font-body text-sm text-on-surface">
                <span className="text-on-surface/70">Sunday</span>
                <span className="text-on-surface-muted">Closed</span>
              </div>
            </div>

            {/* Get in touch */}
            <div>
              <p className="font-body text-[9px] tracking-[0.25em] uppercase text-on-surface-muted mb-3">
                Get in Touch
              </p>
              <p className="font-body text-sm text-on-surface mb-1.5">
                hello@norelia.com
              </p>
              <p className="font-body text-sm text-on-surface-muted">
                +30 26820 00000
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
