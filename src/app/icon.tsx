import { ImageResponse } from 'next/og'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

// Synchronous — no network fetch, no file reads. Always succeeds in any environment.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background:     '#0a0a0a',
          width:          '100%',
          height:         '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily:  'sans-serif',
            fontSize:    20,
            fontWeight:  700,
            color:       '#ffffff',
            lineHeight:  1,
            letterSpacing: '-0.5px',
          }}
        >
          N.
        </span>
      </div>
    ),
    { ...size },
  )
}
