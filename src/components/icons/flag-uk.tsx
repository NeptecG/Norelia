interface Props { className?: string }

export function FlagUK({ className }: Props) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true" focusable="false">
      {/* Blue field */}
      <rect width="20" height="14" fill="#012169" />
      {/* White diagonal cross (St Andrew + St Patrick combined — simplified) */}
      <line x1="0" y1="0" x2="20" y2="14" stroke="#FFFFFF" strokeWidth="3.5" />
      <line x1="20" y1="0" x2="0" y2="14" stroke="#FFFFFF" strokeWidth="3.5" />
      {/* Red diagonals (St Patrick) */}
      <line x1="0" y1="0" x2="20" y2="14" stroke="#C8102E" strokeWidth="1.8" />
      <line x1="20" y1="0" x2="0" y2="14" stroke="#C8102E" strokeWidth="1.8" />
      {/* White cross of St George */}
      <rect x="8" y="0" width="4" height="14" fill="#FFFFFF" />
      <rect x="0" y="5" width="20" height="4" fill="#FFFFFF" />
      {/* Red cross of St George */}
      <rect x="8.8" y="0" width="2.4" height="14" fill="#C8102E" />
      <rect x="0" y="5.8" width="20" height="2.4" fill="#C8102E" />
    </svg>
  )
}
