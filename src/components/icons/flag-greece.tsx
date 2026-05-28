interface Props { className?: string }

export function FlagGreece({ className }: Props) {
  const stripeH = 14 / 9
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true" focusable="false">
      {/* 9 horizontal stripes, alternating blue / white */}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={i * stripeH}
          width="20"
          height={stripeH + 0.1}
          fill={i % 2 === 0 ? '#0D5EAF' : '#FFFFFF'}
        />
      ))}
      {/* Blue canton: 8/20 wide, 5/9 tall */}
      <rect x="0" y="0" width="8" height={14 * 5 / 9} fill="#0D5EAF" />
      {/* White cross — vertical bar */}
      <rect x="3.2" y="0" width="1.6" height={14 * 5 / 9} fill="#FFFFFF" />
      {/* White cross — horizontal bar (centred in canton height) */}
      <rect
        x="0"
        y={14 * 5 / 9 / 2 - 0.8}
        width="8"
        height="1.6"
        fill="#FFFFFF"
      />
    </svg>
  )
}
