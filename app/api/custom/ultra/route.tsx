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
    const content = searchParams.get('content') || undefined;
    const value = searchParams.get('value') || '0';
    const label = searchParams.get('label') || '';
    const componentType = searchParams.get('component') || 'stat';
    const customColor = searchParams.get('customColor') || undefined;
    const customColor2 = searchParams.get('customColor2') || searchParams.get('secColor') || undefined;

    const useNewRender = true; // Flag to easily switch if needed

    const title = searchParams.get('title') || 'Title';
    const icon = searchParams.get('icon') || '✨';

    // 1. Get Theme (now supports multiple custom colors)
    const ultraTheme = getTheme(themeName, customColor, customColor2);

    // Adapt theme object for Ultra components
    const theme = {
      bg: ultraTheme.bgGradient || ultraTheme.bg,
      border: customColor ? `${ultraTheme.accent}40` : 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      secondary: '#94a3b8',
      accent: ultraTheme.accent,
      blob1: ultraTheme.blob1,
      blob2: ultraTheme.blob2
    };

    let componentJsx: React.ReactElement;

    // Select Pure SVG Component
    // Select component
    if (component === 'quote') {
      // UltraQuote uses title as author/header
      componentJsx = <UltraQuote theme={theme} content={content || 'No content provided'} title={title} label={label} icon={icon} />;
    } else if (component === 'card') {
      // UltraCard doesn't use value/label typically, but we pass icon clearly
      componentJsx = <UltraCard theme={theme} title={title} content={content || ''} icon={icon} />;
    } else if (component === 'badge') {
      componentJsx = <UltraBadge theme={theme} title={title} content={content || ''} icon={icon} value={value} />;
    } else {
      // Default to Stat
      componentJsx = <UltraStat theme={theme} value={value} label={label || 'Label'} icon={icon} content={content || ''} />;
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