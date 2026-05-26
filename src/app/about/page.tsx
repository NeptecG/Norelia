import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About Us',
  description: `The story behind ${BRAND} — premium minimalist streetwear.`,
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Dark hero band */}
      {/* max-w-[1440px] / md:px-[60px] — project-wide content container; tracking-[0.3em] — editorial label spacing */}
      <section className="bg-surface-alt pt-32 pb-20 px-4 md:px-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-on-surface-muted mb-4">
            Est. 2024
          </p>
          <h1 className="font-display text-7xl md:text-9xl text-on-surface leading-none">
            WHO WE ARE
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-6">The Brand</h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-4">
              Norelia was born from a simple conviction: premium quality should not require loud branding.
              We design garments that let the wearer speak — minimal graphics, exceptional fabric, considered cuts.
            </p>
            <p className="font-body text-base text-on-surface-muted leading-relaxed">
              Every piece in our range starts with the fabric. We source heavyweight cotton from certified
              European mills, then cut and sew in small batches to maintain quality and reduce waste.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-6">Our Process</h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-4">
              Design happens in-house. Printing happens on-demand — no dead stock, no landfill. Our
              garment designer lets you commission a piece printed exactly as you want it, on the fabric
              you choose, in the fit that works for you.
            </p>
            <p className="font-body text-base text-on-surface-muted leading-relaxed">
              We ship from our studio in Helsinki. Standard delivery takes 3–5 business days across Europe.
              Custom orders ship in 5–7 days.
            </p>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[60px] pb-20">
        <h2 className="font-display text-3xl text-on-surface mb-6">Find Us</h2>
        <p className="font-body text-sm text-on-surface-muted mb-4">
          Norelia Studio · Punavuorenkatu 12, Helsinki 00120, Finland
        </p>
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
