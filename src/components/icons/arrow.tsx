interface ArrowProps {
  dir?:       'left' | 'right'
  size?:      number
  className?: string
}

// Shared line arrow used across the site (back links, forward CTAs, etc.).
// Inherits colour via currentColor.
export function Arrow({ dir = 'left', size = 12, className }: ArrowProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {dir === 'left'
        ? <path d="M19 12H5M11 18l-6-6 6-6" />
        : <path d="M5 12h14M13 6l6 6-6 6" />}
    </svg>
  )
}
