import { NextRequest } from 'next/server';
import satori from 'satori';
import { getFonts } from '@/services/fonts';
import { ImpactTemplate } from '@/components/templates/impact/ImpactTemplate';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros
    const company = searchParams.get('company') || 'Grupo Salinas';
    const role = searchParams.get('role') || 'Tech Lead';
    const year = searchParams.get('year') || '2024 - Present';
    const stat = searchParams.get('stat') || '+40%';
    const statDesc = searchParams.get('desc') || 'System Performance';
    const description = searchParams.get('description') || 'Microfrontend architecture for critical banking systems';
    const tech = searchParams.get('tech') || 'React,TypeScript,Jest';
    const logo = searchParams.get('logo') || '🏦';
    const themeName = searchParams.get('theme') || 'cyan';

    const techArray = tech.split(',').slice(0, 4); // Max 4 tags

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
      <ImpactTemplate
                company={ company }
                role = { role }
                year = { year }
                stat = { stat }
                statDesc = { statDesc }
                description = { description }
                techArray = { techArray }
                logo = { logo }
                theme = { currentTheme }
      />,
      {
        width: 380,
        height: 420,
        fonts: [
          { name: 'Outfit', data: fonts.outfitRegular, weight: 400, style: 'normal' },
          { name: 'Outfit', data: fonts.outfitBold, weight: 700, style: 'normal' },
          { name: 'Outfit', data: fonts.outfitBold, weight: 300, style: 'normal' }, // Using bold data for 300 fallback/consistency if needed or load light font
        ],
      }
    );

    // 2. Inject Animations & Advanced Filters (Satori doesn't support these fully yet)
    // We append the <defs> and <style> block just before the closing </svg> tag.
    const injectedStyles = `
  <defs>
    <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" result="glass"/>
      <feBlend in="SourceGraphic" in2="glass" mode="normal"/>
    </filter>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="statGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1">
        <animate attributeName="stop-opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.2">
        <animate attributeName="stop-opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <style>
      @keyframes fadeTag { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      /* We can target elements by class if we added className in React, 
         BUT Satori often strips classNames or scopes them. 
         Ideally, we assume the layout is static and just add "global" ambient animations 
         or we'd need to inspect Satori output to target specific nodes. 
         For now, we'll keep the defs available for reference if we enhance the component later.
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