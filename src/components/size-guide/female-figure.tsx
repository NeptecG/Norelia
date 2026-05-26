export function FemaleFigure() {
  return (
    <svg
      viewBox="0 0 240 370"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Female measurement diagram"
      role="img"
    >
      {/* ── Filled dark silhouette ── */}

      {/* Head */}
      <ellipse cx="120" cy="30" rx="17" ry="22" fill="currentColor" />

      {/* Neck fill */}
      <rect x="112" y="50" width="16" height="14" fill="currentColor" />

      {/* Torso — hourglass */}
      <path
        d="M110 62 L96 82 L98 110 L92 140 L98 155 L142 155 L148 140 L142 110 L144 82 L130 62 Z"
        fill="currentColor"
      />

      {/* Left arm */}
      <path
        d="M96 82 L74 92 L62 162 L72 164 L84 102 L100 90 Z"
        fill="currentColor"
      />

      {/* Right arm */}
      <path
        d="M144 82 L166 92 L178 162 L168 164 L156 102 L140 90 Z"
        fill="currentColor"
      />

      {/* Left leg */}
      <path
        d="M98 155 L92 235 L86 340 L104 340 L112 242 L120 198 Z"
        fill="currentColor"
      />

      {/* Right leg */}
      <path
        d="M142 155 L148 235 L154 340 L136 340 L128 242 L120 198 Z"
        fill="currentColor"
      />

      {/* ── Red measurement lines ── */}
      <g className="text-destructive">

        {/* CHEST */}
        <line x1="97"  y1="97"  x2="143" y2="97"  stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="97"  y1="93"  x2="97"  y2="101" stroke="currentColor" strokeWidth="1" />
        <line x1="143" y1="93"  x2="143" y2="101" stroke="currentColor" strokeWidth="1" />
        <text x="149" y="101" fill="currentColor" fontSize="8" fontFamily="var(--font-body)" letterSpacing="0.08em">CHEST</text>

        {/* WAIST */}
        <line x1="93"  y1="128" x2="147" y2="128" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="93"  y1="124" x2="93"  y2="132" stroke="currentColor" strokeWidth="1" />
        <line x1="147" y1="124" x2="147" y2="132" stroke="currentColor" strokeWidth="1" />
        <text x="152" y="132" fill="currentColor" fontSize="8" fontFamily="var(--font-body)" letterSpacing="0.08em">WAIST</text>

        {/* HIP */}
        <line x1="91"  y1="155" x2="149" y2="155" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="91"  y1="151" x2="91"  y2="159" stroke="currentColor" strokeWidth="1" />
        <line x1="149" y1="151" x2="149" y2="159" stroke="currentColor" strokeWidth="1" />
        <text x="153" y="159" fill="currentColor" fontSize="8" fontFamily="var(--font-body)" letterSpacing="0.08em">HIP</text>

      </g>
    </svg>
  )
}
