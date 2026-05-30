import { ImageResponse } from 'next/og'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  // Fetch Bebas Neue from Google Fonts — no local file needed, works on Vercel Edge
  const fontRes  = await fetch('https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff2')
  const fontData = await fontRes.arrayBuffer()

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
            fontFamily: 'Bebas Neue',
            fontSize:   26,
            color:      '#ffffff',
            lineHeight: 1,
          }}
        >
          N.
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name:   'Bebas Neue',
          data:   fontData,
          style:  'normal',
          weight: 400,
        },
      ],
    },
  )
}
