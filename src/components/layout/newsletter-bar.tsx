'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Arrow } from '@/components/icons/arrow'

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
  const t = useTranslations('NewsletterBar')
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!submitted) return
    const id = setTimeout(() => setSubmitted(false), 3000)
    return () => clearTimeout(id)
  }, [submitted])

  // Auto-clear validation errors after ~2 s
  useEffect(() => {
    if (!errors.email) return
    const id = setTimeout(() => clearErrors('email'), 2200)
    return () => clearTimeout(id)
  }, [errors.email, clearErrors])

  function onSubmit(_data: FormValues) {
    setSubmitted(true)
    reset()
  }

  return (
    <div className={cn(
      'dark bg-surface-alt border-t border-b border-border',
    )}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-[60px] py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* Left: editorial headline */}
        <div className="shrink-0">
          <p className="font-display text-[28px] tracking-[0.18em] text-on-surface/85 leading-none mb-1">
            {t('headline')}
          </p>
          <p className="font-body text-[11px] tracking-[0.16em] text-on-surface/40">
            {t('subtitle')}
          </p>
        </div>

        {/* Right: form or thank-you */}
        {submitted ? (
          <p role="status" aria-live="polite" className="font-body text-[12px] tracking-[0.06em] text-success">
            {t('success')}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-1.5 w-full md:w-auto"
          >
            <div className="flex items-center">
              <input
                {...register('email')}
                type="email"
                placeholder={t('placeholder')}
                aria-label={t('placeholder')}
                className={cn(
                  'flex-1 md:w-[220px] bg-transparent py-2 pr-2',
                  'font-body text-[12px] tracking-[0.04em] text-on-surface',
                  'placeholder:text-on-surface/40 outline-none',
                  'border-b transition-colors duration-150',
                  errors.email
                    ? 'border-destructive'
                    : 'border-on-surface/35 focus:border-on-surface/90',
                )}
              />
              <button
                type="submit"
                aria-label={t('subscribe')}
                className="group flex items-center gap-2 pl-5 py-2.5 font-body text-[11px] tracking-[0.18em] uppercase text-on-surface/55 hover:text-on-surface transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                {t('subscribe')}
                <Arrow dir="right" size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
            {errors.email && (
              <p className="font-body text-[10px] text-destructive tracking-[0.06em]">
                {errors.email.message}
              </p>
            )}
          </form>
        )}

      </div>
    </div>
  )
}
