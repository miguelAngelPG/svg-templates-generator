import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';
import { getFonts } from '@/services/fonts';
import { getTheme } from '@/utils/themes';

import { UltraStat } from '@/components/templates/ultra/UltraStat';
import { UltraQuote } from '@/components/templates/ultra/UltraQuote';
import { UltraCard } from '@/components/templates/ultra/UltraCard';
import { UltraBadge } from '@/components/templates/ultra/UltraBadge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Params
    const component = searchParams.get('component') || 'stat';
    const width = parseInt(searchParams.get('width') || '600');
    const height = parseInt(searchParams.get('height') || '300');
    const themeName = searchParams.get('theme') || 'purple-cyan';
    const customColor = searchParams.get('customColor') || undefined;

    const title = searchParams.get('title') || 'Title';
    const content = searchParams.get('content') || undefined;
    const icon = searchParams.get('icon') || '✨';
    const value = searchParams.get('value') || '100';
    const label = searchParams.get('label') || 'Label';

    // Shared Theme Logic
    const t = getTheme(themeName, customColor);

    // Map to Ultra Local Theme Structure
    const theme = {
      bg: t.bgGradient || t.bg,
      border: customColor ? `${t.accent}40` : 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      secondary: '#94a3b8',
      accent: t.accent,
      blob1: t.blob1,
      blob2: t.blob2
    };

    let componentJsx: React.ReactNode;

    switch (component) {
      case 'quote':
        componentJsx = <UltraQuote content={content || 'Insert quote here'} title={title} label={label} icon={icon} theme={theme} />;
        break;
      case 'card':
        componentJsx = <UltraCard title={title} content={content || 'Description goes here'} icon={icon} theme={theme} />;
        break;
      case 'badge':
        componentJsx = <UltraBadge title={title} content={content} icon={icon} value={value} theme={theme} />;
        break;
      case 'stat':
      default:
        componentJsx = <UltraStat value={value} label={label} icon={icon} content={content} theme={theme} />;
        break;
    }

    const fonts = await getFonts();

    // Satori
    const svg = await satori(componentJsx, {
      width,
      height,
      fonts: [
        { name: 'Outfit', data: fonts.outfitRegular, weight: 400, style: 'normal' },
        { name: 'Outfit', data: fonts.outfitBold, weight: 700, style: 'normal' },
      ],
    });

    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
    });

  } catch (error) {
    console.error('Error generating Ultra SVG:', error);
    const errorSvg = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="300" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#f87171" font-family="sans-serif">Error: ${(error as any).message}</text></svg>`;
    return new Response(errorSvg, { headers: { 'Content-Type': 'image/svg+xml' } });
  }
}