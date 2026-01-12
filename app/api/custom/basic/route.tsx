import { NextRequest } from 'next/server';
import satori from 'satori';

import { getInterFonts } from '@/services/fonts';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros
    const content = searchParams.get('content') || 'Hello World';
    const width = parseInt(searchParams.get('width') || '800');
    const height = parseInt(searchParams.get('height') || '400');
    const theme = searchParams.get('theme') || 'dark';

    // Temas predefinidos
    const themes = {
      dark: {
        bg: '#050505',
        text: '#ffffff',
        accent: '#00f2ff',
        secondary: '#666666'
      },
      light: {
        bg: '#ffffff',
        text: '#000000',
        accent: '#0066ff',
        secondary: '#999999'
      },
      purple: {
        bg: '#0f0a1f',
        text: '#ffffff',
        accent: '#bd00ff',
        secondary: '#8855ff'
      }
    };

    const currentTheme = themes[theme as keyof typeof themes] || themes.dark;

    const jsx = (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}
        >
          {content}
        </div>

        <div
          style={{
            fontSize: '16px',
            color: currentTheme.secondary,
          }}
        >
          Generated with Satori
        </div>
      </div>
    );

    const fonts = await getInterFonts();

    // Convertir JSX a SVG usando Satori
    const svg = await satori(jsx, {
      width,
      height,
      fonts: [
        {
          name: 'Inter',
          data: fonts.regular,
          weight: 400,
          style: 'normal',
        },
      ],
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Error generating SVG:', error);

    // SVG de error
    const errorSvg = `
<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" fill="#1a1a1a"/>
  <text x="400" y="200" text-anchor="middle" fill="#ff4444" font-size="24" font-family="sans-serif">
    Error generating SVG
  </text>
  <text x="400" y="240" text-anchor="middle" fill="#ffffff" font-size="14" font-family="sans-serif">
    ${error instanceof Error ? error.message : 'Unknown error'}
  </text>
</svg>`;

    return new Response(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    });
  }
}