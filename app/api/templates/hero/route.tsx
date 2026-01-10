import { NextRequest } from 'next/server';
import satori from 'satori';
import React from 'react';
import { getFonts } from '@/services/fonts';
import { getTheme } from '@/utils/themes';
import { ModernTemplate } from '@/components/templates/hero/ModernTemplate';
import { MinimalTemplate } from '@/components/templates/hero/MinimalTemplate';
import { CyberTemplate } from '@/components/templates/hero/CyberTemplate';
import { TerminalTemplate } from '@/components/templates/hero/TerminalTemplate';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // PARAMS
    const name = searchParams.get('name') || 'Miguel Pacheco';
    const title = searchParams.get('title') || 'Full Stack Developer';
    const subtitle = searchParams.get('subtitle') || 'Building digital experiences.';
    const location = searchParams.get('location') || 'Mexico';
    const style = searchParams.get('style') || 'modern'; // modern | minimal | cyber
    const themeName = searchParams.get('theme') || 'purple-cyan';
    const customColor = searchParams.get('customColor') || undefined;
    const customColor2 = searchParams.get('customColor2') || searchParams.get('secColor') || undefined;

    // 1. Get Theme configuration
    const theme = getTheme(themeName, customColor, customColor2);
    const fonts = await getFonts();

    // RENDER LOGIC
    let jsx;

    switch (style) {
      case 'minimal':
        jsx = <MinimalTemplate name={name} title={title} subtitle={subtitle} location={location} theme={theme} />;
        break;
      case 'cyber':
        jsx = <CyberTemplate name={name} title={title} subtitle={subtitle} location={location} theme={theme} />;
        break;
      case 'terminal':
        jsx = <TerminalTemplate name={name} title={title} subtitle={subtitle} location={location} theme={theme} />;
        break;
      case 'modern':
      default:
        jsx = <ModernTemplate name={name} title={title} subtitle={subtitle} location={location} theme={theme} />;
        break;
    }

    const svg = await satori(jsx, {
      width: 800,
      height: 400,
      fonts: [
        { name: 'Outfit', data: fonts.outfitRegular, weight: 400, style: 'normal' },
        { name: 'Outfit', data: fonts.outfitBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: fonts.interBold, weight: 900, style: 'normal' },
        { name: 'Space Mono', data: fonts.spaceMono, weight: 700, style: 'normal' },
      ],
    });

    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(`<svg><text>Error</text></svg>`, { headers: { 'Content-Type': 'image/svg+xml' } });
  }
}