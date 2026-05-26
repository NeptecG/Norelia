export function MaleFigure() {
  return (
    <svg
      viewBox="0 0 240 370"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Male measurement diagram"
      role="img"
    >
      {/* Head */}
      <ellipse
        cx="120"
        cy="30"
        rx="18"
        ry="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Neck */}
      <line x1="111" y1="50" x2="109" y2="62" stroke="currentColor" strokeWidth="1.5" />
      <line x1="129" y1="50" x2="131" y2="62" stroke="currentColor" strokeWidth="1.5" />

      {/* Torso */}
      <path
        d="M109 62 L96 80 L93 150 L147 150 L144 80 L131 62 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Left arm */}
      <path
        d="M96 80 L72 90 L60 165 L70 167 L82 100 L100 88 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Right arm */}
      <path
        d="M144 80 L168 90 L180 165 L170 167 L158 100 L140 88 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Left leg */}
      <path
        d="M93 150 L88 230 L82 340 L100 340 L108 240 L120 195 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Right leg */}
      <path
        d="M147 150 L152 230 L158 340 L140 340 L132 240 L120 195 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* ---- Chest measurement line ---- */}
      <line
        x1="93"
        y1="95"
        x2="147"
        y2="95"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      {/* Chest end ticks */}
      <line x1="93" y1="91" x2="93" y2="99" stroke="currentColor" strokeWidth="1" />
      <line x1="147" y1="91" x2="147" y2="99" stroke="currentColor" strokeWidth="1" />
      <text x="153" y="98" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em">
        CHEST
      </text>

      {/* ---- Waist measurement line ---- */}
      <line
        x1="94"
        y1="130"
        x2="146"
        y2="130"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line x1="94" y1="126" x2="94" y2="134" stroke="currentColor" strokeWidth="1" />
      <line x1="146" y1="126" x2="146" y2="134" stroke="currentColor" strokeWidth="1" />
      <text x="153" y="133" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em">
        WAIST
      </text>

      {/* ---- Body length line (right side) ---- */}
      <line
        x1="190"
        y1="62"
        x2="190"
        y2="150"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line x1="186" y1="62" x2="194" y2="62" stroke="currentColor" strokeWidth="1" />
      <line x1="186" y1="150" x2="194" y2="150" stroke="currentColor" strokeWidth="1" />
      <text x="193" y="108" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em" textAnchor="start">
        LENGTH
      </text>

      {/* ---- Sleeve length line ---- */}
      <line
        x1="100"
        y1="88"
        x2="70"
        y2="167"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line x1="97" y1="84" x2="104" y2="91" stroke="currentColor" strokeWidth="1" />
      <line x1="66" y1="164" x2="73" y2="170" stroke="currentColor" strokeWidth="1" />
      <text x="28" y="135" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em">
        SLEEVE
      </text>
    </svg>
  )
}
