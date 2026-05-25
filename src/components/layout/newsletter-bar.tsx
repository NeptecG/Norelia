'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email'),
})

type FormValues = z.infer<typeof schema>

// ── NewsletterBar ──────────────────────────────────────────────────────────────

export function NewsletterBar() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function onSubmit(_data: FormValues) {
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className={cn(
      'dark bg-surface-alt border-t border-border',
    )}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* Left: copy */}
        <div className="shrink-0">
          <p className="font-body text-[11px] tracking-[0.22em] uppercase text-on-surface mb-1.5">
            Stay in the know
          </p>
          <p className="font-body text-[12px] text-on-surface/50">
            New drops, exclusive offers — straight to your inbox.
          </p>
        </div>

        {/* Right: form or thank-you */}
        {submitted ? (
          <p className="font-body text-[12px] tracking-[0.1em] text-on-surface/80">
            You&apos;re on the list. ✓
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:max-w-[420px]"
          >
            <div className="flex-1 flex flex-col gap-1">
              <input
                {...register('email')}
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className={cn(
                  'w-full px-4 py-2.5',
                  'bg-on-surface/10 border-none outline-none',
                  'font-body text-[12px] tracking-[0.08em] text-on-surface placeholder:text-on-surface/40',
                  errors.email && 'ring-1 ring-destructive',
                )}
              />
              {errors.email && (
                <p className="font-body text-[10px] text-destructive tracking-[0.08em]">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              className={cn(
                'shrink-0 px-6 py-2.5',
                'bg-on-surface text-surface',
                'font-body text-[10px] tracking-[0.2em] uppercase',
                'hover:opacity-90 transition-opacity duration-200',
              )}
            >
              Subscribe
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
