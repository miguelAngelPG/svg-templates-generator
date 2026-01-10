import { NextRequest, NextResponse } from 'next/server';
import satori from 'satori';
import { getFonts } from '@/services/fonts';
import { StackTemplate } from '@/components/templates/stack/StackTemplate';
import { getTheme } from '@/utils/themes'; // Import standard theme getter
import { fetchIcons } from '@/utils/social-icons'; // Import icon fetcher

export const runtime = 'nodejs'; // Ensure Node.js runtime for now to avoid Edge quirks with large deps if any

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 1. Configurable Parameters & Defaults
    // technologies: "react,typescript,nextdotjs,tailwindcss"
    const techStr = searchParams.get('technologies') || searchParams.get('items') || 'react,typescript,nextdotjs';
    const techSlugs = techStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    // layout params
    const iconStyle = (searchParams.get('iconStyle') as any) || 'original'; // 'original' | 'monochrome' | 'glass'
    const gap = parseInt(searchParams.get('gap') || '16', 10);
    const bgTransparent = searchParams.get('bgTransparent') === 'true';

    // theme params
    const themeName = searchParams.get('theme') || 'purple-cyan';
    const customColor = searchParams.get('customColor') || undefined;
    const customColor2 = searchParams.get('customColor2') || undefined;

    // 2. Resolve Theme & Icons
    const currentTheme = getTheme(themeName, customColor, customColor2);

    // Fetch icons (parallel, server-side)
    // If iconStyle is monochrome/glass, we might want to fetch colored icons and manipulate them, 
    // or fetch white icons. simple-icons supports /color/white.
    // For 'glass', white icons are best. for 'monochrome', maybe accent color?
    // Let's pass undefined color to get original colors by default, unless style demands it.
    let iconColor: string | undefined = undefined;
    if (iconStyle === 'glass' || iconStyle === 'monochrome') {
      iconColor = 'white'; // Satori applies colors better via props or mask, but simple-icons url with color is robust
    }

    const fetchedIcons = await fetchIcons(techSlugs, iconColor);

    // 3. Prepare Fonts
    const fonts = await getFonts();

    // 4. Calculate Dimensions (Dynamic based on content)
    // Horizontal Stack: Padding * 2 + (IconSize * count) + (Gap * (count - 1))
    // IconSize = 40 (from Component)
    const iconSize = 40;
    const padding = 20;
    const count = fetchedIcons.length || 1;
    const contentWidth = (padding * 2) + (iconSize * count) + (gap * (count - 1));
    const width = Math.max(contentWidth, 300); // Minimum width
    const height = 80; // Fixed height for singular row

    // 5. Generate SVG
    const svg = await satori(
      <StackTemplate
        icons={fetchedIcons}
        theme={currentTheme}
        iconStyle={iconStyle}
        gap={gap}
        bgTransparent={bgTransparent}
      />,
      {
        width,
        height,
        fonts: [
          { name: 'Outfit', data: fonts.outfitRegular, weight: 400, style: 'normal' },
        ],
      }
    );

    // 6. Return Response
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, mutable', // Cache for 1 day
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Stack Template Generaton Error:', error);
    return new NextResponse(
      `<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#111"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="red" font-family="monospace">
                Error generating stack
            </text>
        </svg>`,
      { status: 500, headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}