export function FemaleFigure() {
  return (
    <svg
      viewBox="0 0 240 370"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Female measurement diagram"
      role="img"
    >
      {/* Head */}
      <ellipse
        cx="120"
        cy="30"
        rx="17"
        ry="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Neck */}
      <line x1="112" y1="50" x2="110" y2="62" stroke="currentColor" strokeWidth="1.5" />
      <line x1="128" y1="50" x2="130" y2="62" stroke="currentColor" strokeWidth="1.5" />

      {/* Torso — hourglass shape */}
      <path
        d="M110 62 L96 82 L98 110 L92 140 L98 155 L142 155 L148 140 L142 110 L144 82 L130 62 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Left arm */}
      <path
        d="M96 82 L74 92 L62 162 L72 164 L84 102 L100 90 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Right arm */}
      <path
        d="M144 82 L166 92 L178 162 L168 164 L156 102 L140 90 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Left leg */}
      <path
        d="M98 155 L92 235 L86 340 L104 340 L112 242 L120 198 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Right leg */}
      <path
        d="M142 155 L148 235 L154 340 L136 340 L128 242 L120 198 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* ---- Chest measurement line ---- */}
      <line
        x1="97"
        y1="97"
        x2="143"
        y2="97"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line x1="97" y1="93" x2="97" y2="101" stroke="currentColor" strokeWidth="1" />
      <line x1="143" y1="93" x2="143" y2="101" stroke="currentColor" strokeWidth="1" />
      <text x="149" y="100" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em">
        CHEST
      </text>

      {/* ---- Waist measurement line ---- */}
      <line
        x1="93"
        y1="128"
        x2="147"
        y2="128"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line x1="93" y1="124" x2="93" y2="132" stroke="currentColor" strokeWidth="1" />
      <line x1="147" y1="124" x2="147" y2="132" stroke="currentColor" strokeWidth="1" />
      <text x="152" y="131" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em">
        WAIST
      </text>

      {/* ---- Hip measurement line ---- */}
      <line
        x1="91"
        y1="155"
        x2="149"
        y2="155"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line x1="91" y1="151" x2="91" y2="159" stroke="currentColor" strokeWidth="1" />
      <line x1="149" y1="151" x2="149" y2="159" stroke="currentColor" strokeWidth="1" />
      <text x="153" y="158" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em">
        HIP
      </text>

      {/* ---- Body length line (right side) ---- */}
      <line
        x1="192"
        y1="62"
        x2="192"
        y2="155"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line x1="188" y1="62" x2="196" y2="62" stroke="currentColor" strokeWidth="1" />
      <line x1="188" y1="155" x2="196" y2="155" stroke="currentColor" strokeWidth="1" />
      <text x="195" y="111" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em" textAnchor="start">
        LENGTH
      </text>

      {/* ---- Sleeve length line ---- */}
      <line
        x1="100"
        y1="90"
        x2="72"
        y2="164"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line x1="97" y1="86" x2="104" y2="93" stroke="currentColor" strokeWidth="1" />
      <line x1="68" y1="161" x2="75" y2="167" stroke="currentColor" strokeWidth="1" />
      <text x="28" y="130" fill="currentColor" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.1em">
        SLEEVE
      </text>
    </svg>
  )
}
