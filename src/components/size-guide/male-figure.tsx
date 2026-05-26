export function MaleFigure() {
  return (
    <svg
      viewBox="0 0 240 370"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Male measurement diagram"
      role="img"
    >
      {/* ── Filled dark silhouette ── */}

      {/* Head */}
      <ellipse cx="120" cy="30" rx="18" ry="22" fill="currentColor" />

      {/* Neck fill */}
      <rect x="111" y="50" width="18" height="14" fill="currentColor" />

      {/* Torso */}
      <path
        d="M109 62 L96 80 L93 150 L147 150 L144 80 L131 62 Z"
        fill="currentColor"
      />

      {/* Left arm */}
      <path
        d="M96 80 L72 90 L60 165 L70 167 L82 100 L100 88 Z"
        fill="currentColor"
      />

      {/* Right arm */}
      <path
        d="M144 80 L168 90 L180 165 L170 167 L158 100 L140 88 Z"
        fill="currentColor"
      />

      {/* Left leg */}
      <path
        d="M93 150 L88 230 L82 340 L100 340 L108 240 L120 195 Z"
        fill="currentColor"
      />

      {/* Right leg */}
      <path
        d="M147 150 L152 230 L158 340 L140 340 L132 240 L120 195 Z"
        fill="currentColor"
      />

      {/* ── Red measurement lines ── */}
      <g className="text-destructive">

        {/* CHEST */}
        <line x1="93"  y1="95"  x2="147" y2="95"  stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="93"  y1="91"  x2="93"  y2="99"  stroke="currentColor" strokeWidth="1" />
        <line x1="147" y1="91"  x2="147" y2="99"  stroke="currentColor" strokeWidth="1" />
        <text x="153" y="99" fill="currentColor" fontSize="8" fontFamily="var(--font-body)" letterSpacing="0.08em">CHEST</text>

        {/* WAIST */}
        <line x1="94"  y1="130" x2="146" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="94"  y1="126" x2="94"  y2="134" stroke="currentColor" strokeWidth="1" />
        <line x1="146" y1="126" x2="146" y2="134" stroke="currentColor" strokeWidth="1" />
        <text x="153" y="134" fill="currentColor" fontSize="8" fontFamily="var(--font-body)" letterSpacing="0.08em">WAIST</text>

        {/* HIP */}
        <line x1="93"  y1="155" x2="147" y2="155" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="93"  y1="151" x2="93"  y2="159" stroke="currentColor" strokeWidth="1" />
        <line x1="147" y1="151" x2="147" y2="159" stroke="currentColor" strokeWidth="1" />
        <text x="153" y="159" fill="currentColor" fontSize="8" fontFamily="var(--font-body)" letterSpacing="0.08em">HIP</text>

      </g>
    </svg>
  )
}
