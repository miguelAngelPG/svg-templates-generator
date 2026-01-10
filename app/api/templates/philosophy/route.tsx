import { NextRequest } from 'next/server';
import satori from 'satori';
import { getFonts } from '@/services/fonts';
import { getTheme } from '@/utils/themes';
import { PhilosophyTemplate } from '@/components/templates/philosophy/PhilosophyTemplate';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros
    const title = searchParams.get('title') || 'The Person Behind the Code';
    const quote = searchParams.get('quote') || 'Technology is the tool, empathy is the engine.';
    const icon = searchParams.get('icon') || '⚛';
    const lang = searchParams.get('lang') || 'en';
    const footer = searchParams.get('footer') || undefined;
    const themeName = searchParams.get('theme') || 'orange-pink'; // Default to a warm theme if not specified
    const customColor = searchParams.get('customColor') || undefined;

    // Use shared theme logic but adapt fields for Philosophy
    // Philosophy uses 'primary' (formerly accent/orange) as the main color
    const baseTheme = getTheme(themeName, customColor);

    // Map standard theme to Philosophy needs
    // We use the 'accent' from baseTheme as our 'primary' for glows since accents are usually brighter
    const theme = {
      bg: baseTheme.bg,
      bgGradient: baseTheme.bgGradient,
      primary: baseTheme.accent, // Use accent color (e.g. Cyan) as primary for text/glows
      secondary: baseTheme.blob1 // Use secondary for gradients
    };

    const fonts = await getFonts();

    // 1. Generate Static Layout with Satori
    const svg = await satori(
      <PhilosophyTemplate
        title={title}
        quote={quote}
        icon={icon}
        lang={lang}
        footer={footer}
        theme={theme}
      />,
      {
        width: 800,
        height: 250,
        fonts: [
          { name: 'Outfit', data: fonts.outfitRegular, weight: 400, style: 'normal' },
          { name: 'Outfit', data: fonts.outfitBold, weight: 700, style: 'normal' },
        ],
      }
    );

    // 2. Inject Animations & Filters
    // We interpolate the dynamic colors into the SVG defs
    const injectedStyles = `
  <defs>
    <linearGradient id="warmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.primary};stop-opacity:0.08" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0" />
    </linearGradient>

    <radialGradient id="iconGlow">
      <stop offset="0%" style="stop-color:${theme.primary};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${theme.primary};stop-opacity:0" />
    </radialGradient>

    <linearGradient id="quoteBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.primary};stop-opacity:0.8">
        <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:${theme.secondary};stop-opacity:0.4">
        <animate attributeName="stop-opacity" values="0.4;0.6;0.4" dur="2s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>

    <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur"/>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" result="glass"/>
      <feBlend in="SourceGraphic" in2="glass" mode="normal"/>
    </filter>

    <filter id="glow">
      <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600;700&amp;display=swap');
      
      @keyframes iconPulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
      }

      @keyframes warmthGlow {
        0%, 100% { opacity: 0.15; }
        50% { opacity: 0.25; }
      }

      @keyframes quoteFadeIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
    </style>
  </defs>
  <!-- Overlay ambient gradient -->
  <rect width="800" height="250" fill="url(#warmGradient)" style="pointer-events:none; position:absolute; top:0; left:0;" />
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