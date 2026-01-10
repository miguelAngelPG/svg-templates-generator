import { NextRequest } from 'next/server';
import satori from 'satori';
import { getFonts } from '@/services/fonts';
import { StackTemplate } from '@/components/templates/stack/StackTemplate';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros
    const items = searchParams.get('items') || 'Frontend,Backend,Architecture,DevOps';
    const details = searchParams.get('details') || 'React|Next.js|Tailwind,.NET|Java|Node.js,Microservices|Clean Arch,Docker|CI/CD|Linux';
    const icons = searchParams.get('icons') || '⚛️,⚙️,🏗️,🐳';
    const themeName = searchParams.get('theme') || 'cyan';

    const itemsArray = items.split(',');
    const detailsArray = details.split(',');
    const iconsArray = icons.split(',');

    // Temas
    const themes: Record<string, { primary: string; secondary: string; accent: string }> = {
      cyan: { primary: '#00f2ff', secondary: '#4d47c3', accent: '#00ff9d' },
      purple: { primary: '#bd00ff', secondary: '#7209b7', accent: '#f72585' },
      orange: { primary: '#ffaa40', secondary: '#ff6b35', accent: '#ffd60a' },
      green: { primary: '#00ff9d', secondary: '#06ffa5', accent: '#4d47c3' }
    };

    const currentTheme = themes[themeName] || themes.cyan;
    const fonts = await getFonts();

    // 1. Generate Static Layout with Satori
    const svg = await satori(
      <StackTemplate
        itemsArray={itemsArray}
        detailsArray={detailsArray}
        iconsArray={iconsArray}
        theme={currentTheme}
      />,
      {
        width: 800,
        height: 220,
        fonts: [
          { name: 'Outfit', data: fonts.outfitRegular, weight: 400, style: 'normal' },
          { name: 'Outfit', data: fonts.outfitBold, weight: 700, style: 'normal' },
          { name: 'Outfit', data: fonts.outfitBold, weight: 600, style: 'normal' },
        ],
      }
    );

    // 2. Inject Animations & Filters
    const injectedStyles = `
  <defs>
    <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur"/>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.06 0" result="glass"/>
      <feBlend in="SourceGraphic" in2="glass" mode="normal"/>
    </filter>

    <filter id="itemShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="3" result="offsetblur"/>
      <feFlood flood-color="${currentTheme.primary}" flood-opacity="0.2" result="color"/>
      <feComposite in="color" in2="offsetblur" operator="in" result="shadow"/>
      <feMerge>
        <feMergeNode in="shadow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${currentTheme.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${currentTheme.secondary};stop-opacity:0.6" />
    </linearGradient>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&amp;display=swap');
      
      @keyframes iconRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes glowPulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
      }

      @keyframes itemFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* Target icons? Without classes, it's hard. 
         We might rely on the fact that Satori output is stable.
         Or we can accept that icons won't rotate unless we use a robust specific selector or inline style injection.
         However, inline styles on React elements (style={{ animation: ... }}) are stripped by Satori usually.
         For now, we keep the definitions. If the user REALLY needs the specific animations on specific elements, 
         we might need to post-process the SVG string to add classNames or IDs.
         Legacy 'Impact' template relied on explicit <animate> tags which Satori doesn't output.
      */
    </style>
  </defs>
        `;

    // Inject just before closing svg
    const finalSvg = svg.replace('</svg>', `${injectedStyles}</svg>`);

    return new Response(finalSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(`<svg><text>Error generating template</text></svg>`, { headers: { 'Content-Type': 'image/svg+xml' } });
  }
}