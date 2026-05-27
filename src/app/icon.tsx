import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  // Read Bebas Neue latin subset from public/fonts — same typeface used in the site
  const font = fs.readFileSync(
    path.join(process.cwd(), 'public', 'fonts', 'bebas-neue.ttf'),
  )

  return new ImageResponse(
    (
      <div
        style={{
          background: '#111111',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Bebas Neue',
            fontSize: 30,
            color: '#ffffff',
            lineHeight: 1,
            marginTop: 1, // optical vertical correction for Bebas Neue descender
          }}
        >
          N
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name:   'Bebas Neue',
          data:   font,
          style:  'normal',
          weight: 400,
        },
      ],
    },
  )
}
