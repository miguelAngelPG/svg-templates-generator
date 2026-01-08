import { NextRequest } from 'next/server';
import React from 'react';
import { renderComponentToSvg } from '@/lib/render-utils';
import { getTheme } from '@/utils/themes';

export const runtime = 'nodejs'; // Force Node.js runtime to support renderToStaticMarkup without warnings
export const dynamic = 'force-dynamic'; // Ensure no static caching issues for dynamic params

import { UltraStat } from '@/components/templates/ultra/UltraStat';
import { UltraQuote } from '@/components/templates/ultra/UltraQuote';
import { UltraCard } from '@/components/templates/ultra/UltraCard';
import { UltraBadge } from '@/components/templates/ultra/UltraBadge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const component = searchParams.get('component') || 'stat';
    const themeName = searchParams.get('theme') || 'purple-cyan';
    const customColor = searchParams.get('customColor') || undefined;

    const title = searchParams.get('title') || 'Title';
    const content = searchParams.get('content') || '';
    const icon = searchParams.get('icon') || '✨';
    const value = searchParams.get('value') || '100';
    const label = searchParams.get('label') || 'Label';

    // Theme Logic
    const t = getTheme(themeName, customColor);
    const theme = {
      bg: t.bgGradient || t.bg,
      border: customColor ? `${t.accent}40` : 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      secondary: '#94a3b8',
      accent: t.accent,
      blob1: t.blob1,
      blob2: t.blob2
    };

    let componentJsx: React.ReactElement;

    // Select Pure SVG Component
    switch (component) {
      case 'quote':
        componentJsx = <UltraQuote content={content} title={title} label={label} icon={icon} theme={theme} />;
        break;
      case 'card':
        componentJsx = <UltraCard title={title} content={content} icon={icon} theme={theme} />;
        break;
      case 'badge':
        componentJsx = <UltraBadge title={title} content={content} icon={icon} value={value} theme={theme} />;
        break;
      case 'stat':
      default:
        componentJsx = <UltraStat value={value} label={label} icon={icon} content={content} theme={theme} />;
        break;
    }

    // Single source of truth: Render the EXACT same component instance to string
    const svg = renderComponentToSvg(componentJsx);

    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response('<svg><text>Error</text></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
  }
}