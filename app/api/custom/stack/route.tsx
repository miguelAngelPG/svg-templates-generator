import { NextRequest } from 'next/server';
import satori from 'satori';
import { getTheme } from '@/utils/themes';
import { StackTemplate } from '@/components/templates/stack/StackTemplate';
import { fetchIcons } from '@/utils/social-icons';
import { getFonts } from '@/services/fonts'; // Add font service for consistency if available, or fetch manually

// Force Node.js runtime for buffer handling if needed, though Edge is often preferred. 
// For now, Node.js is safer for reliable Satori usage with external fetches in some environments.
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Params
        const technologies = (searchParams.get('technologies') || 'react,typescript,nextdotjs').split(',');
        const themeName = searchParams.get('theme') || 'purple-cyan';
        const iconStyle = searchParams.get('iconStyle') || 'original'; // original | monochrome | glass
        const gap = parseInt(searchParams.get('gap') || '16');
        const bgTransparent = searchParams.get('bgTransparent') === 'true';

        const iconColorParam = searchParams.get('iconColor');
        const customColor = searchParams.get('customColor');
        const customColor2 = searchParams.get('customColor2');

        // Theme logic
        const t = getTheme(themeName, customColor || undefined, customColor2 || undefined);
        const iconColor = iconStyle === 'monochrome' ? '#ffffff' : iconColorParam;

        // Fetch Icons Logic (Shared Utility)
        const loadedIcons = await fetchIcons(technologies, iconColor || undefined);

        // Layout Dimensions
        const iconSize = 40;
        const padding = 20;
        const width = (loadedIcons.length * iconSize) + ((loadedIcons.length - 1) * gap) + (padding * 2);
        const height = iconSize + (padding * 2) + 20; // Add some height buffer for shadows/glows

        // JSX Construction
        const jsx = (
            <div style={{ width: width, height: height, display: 'flex' }}>
                <StackTemplate
                    icons={loadedIcons}
                    theme={t}
                    iconStyle={iconStyle as any}
                    gap={gap}
                    bgTransparent={bgTransparent}
                />
            </div>
        );

        // Fonts (Standard set)
        const fonts = [
            {
                name: 'Inter',
                data: await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff').then(res => res.arrayBuffer()),
                weight: 400 as const,
                style: 'normal' as const,
            }
        ];

        const svg = await satori(jsx, {
            width,
            height,
            fonts,
        });

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error(error);
        return new Response('<svg><text>Error</text></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
    }
}
