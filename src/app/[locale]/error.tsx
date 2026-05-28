'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center gap-6">
      <p className="font-display text-4xl tracking-widest text-on-surface">Something went wrong</p>
      <p className="font-body text-sm text-on-surface-muted">{error.message}</p>
      <button
        onClick={reset}
        className="border border-on-surface px-8 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-on-surface transition-colors hover:bg-on-surface hover:text-surface"
      >
        Try Again
      </button>
    </div>
  )
}
